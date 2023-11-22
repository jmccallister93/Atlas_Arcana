import React, { useState, useEffect } from "react";
import { IonModal, IonButton, IonList, IonItem, IonLabel } from "@ionic/react";
import {
  EquipmentItem,
  GameSessionInfo,
  GameState,
  PlayerInfo,
} from "./Interfaces"; // Adjust the path as needed
import "./PlayerMenu.scss";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import PlayerMenuDetails from "./PlayerMenuDetails";

interface PlayerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  player?: PlayerInfo;
  gameState?: GameSessionInfo;
  onEquipItem: (item: EquipmentItem) => void;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({
  isOpen,
  onClose,
  player,
  onEquipItem,
  gameState,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentDetailType, setCurrentDetailType] = useState<string>("");
  const [currentDetailContent, setCurrentDetailContent] = useState<string>("");
  const [currentEquipableItems, setCurrentEquipableItems] = useState<
    EquipmentItem[]
  >([]);

  // Need to verify player exists
  if (!player) {
    return null;
  }
  //Conditional if equippedItems item is empty
  const renderEquippedItem = (
    item: any[],
    slot: keyof PlayerInfo["equippedItems"]
  ) => {
    return item && item.length > 0 ? item[0].equipmentName : "None";
  };
  //Conditional if inventory item is empty
  const renderInventoryItem = (item: any) => {
    return item && item.length > 0 ? item : "None";
  };

  //Conditional if equipment item is empty
  const renderEquipmentCardItem = (equipment: any) => {
    return equipment && equipment.length > 0
      ? equipment.map((equipment: any, index: any) => (
          <div className="namedCard" key={index}>
            {equipment.equipmentName}
          </div>
        ))
      : "None";
  };

  //Conditional if inventory item is empty
  const renderQuestCardDescription = (equipment: any) => {
    return equipment && equipment.length > 0
      ? equipment.map((equipment: any, index: any) => (
          <div className="namedCard" key={index}>
            <div>Name: {equipment.equipmentName}</div>
            <div>Slot: {equipment.slot}</div>
            <div>Set: {equipment.set}</div>
            <div>Element: {equipment.element}</div>
            <div>Bonus: {equipment.bonus}</div>
            <div>-------------------------------------</div>
          </div>
        ))
      : "None";
  };

  //   Format building keys
  const formatBuildingKey = (key: any) => {
    if (!key) return "";

    // Capitalize the first letter
    let formattedKey = key.charAt(0).toUpperCase() + key.slice(1);

    // Insert space before capital letters and capitalize them
    return formattedKey.replace(/([A-Z])/g, " $1").trim();
  };

  //Conditional if building item is empty
  const renderBuildingItem = (buildings: any) => {
    const buildingArray = [];

    // Loop through the properties of player.buildings
    for (const buildingName in buildings) {
      if (buildings.hasOwnProperty(buildingName)) {
        // Create an object for each building with name and value
        const buildingValue = buildings[buildingName];
        buildingArray.push({
          name: formatBuildingKey(buildingName),
          value: buildingValue,
        });
      }
    }

    if (buildingArray.length > 0) {
      // If there are buildings, display them as a list
      return buildingArray.map((building, index) => (
        <div className="namedCard" key={index}>
          {building.name}: {building.value}
        </div>
      ));
    } else {
      return "None";
    }
  };

  //   },[player])
  // Get and display stats
  const stats = [
    {
      label: "Rank",
      value: player.rank,
      description: "Used to determine usable equipment level.",
    },
    {
      label: "Health",
      value: player.health,
      description: "Used for total life force, when 0 player dies.",
    },
    {
      label: "Offense",
      value: player.offense,
      description: "Used to determine number added to attack rolls.",
    },
    {
      label: "Defense",
      value: player.defense,
      description: "Used to determine number added to defense rolls.",
    },
    {
      label: "Stamina",
      value: player.stamina,
      description: "Used to determine usable total attacks per combat round.",
    },
    {
      label: "Movement",
      value: player.movement,
      description: "Used to determine move spaces on the board.",
    },
    {
      label: "Build",
      value: player.build,
      description:
        "Used to determine number of constructed buildings per turn.",
    },
  ];
  const statsCards = stats.map((item) => (
    <div
      className="statCard"
      key={item.label}
      onClick={() => handleItemClick(item.label, item.description)}
    >
      {item.label} <div>{item.value}</div>
    </div>
  ));
  //   Get and display equipped items
  const equippedItems = [
    {
      label: "Weapon",
      value: renderEquippedItem(player.equippedItems.weapon, "weapon"),
      description: "Used to increase offense.",
    },
    {
      label: "Armor",
      value: renderEquippedItem(player.equippedItems.armor, "armor"),
      description: "Used to increase defense.",
    },
    {
      label: "Amulet",
      value: renderEquippedItem(player.equippedItems.amulet, "amulet"),
      description: "Used to increase health.",
    },
    {
      label: "Boots",
      value: renderEquippedItem(player.equippedItems.boots, "boots"),
      description: "Used to increase speed.",
    },
    {
      label: "Gloves",
      value: renderEquippedItem(player.equippedItems.gloves, "gloves"),
      description: "Used to increase build.",
    },
  ];

  const equippedItemsCards = equippedItems.map((item) => {
    const slot = item.label.toLowerCase() as keyof PlayerInfo["equippedItems"];
    return (
      <div
        className="statCard"
        key={item.label}
        onClick={() => handleItemClick(item.label, item.description)}
      >
        {item.label}{" "}
        <div>{renderEquippedItem(player.equippedItems[slot], slot)}</div>
      </div>
    );
  });

  //Get and display inventory
  const inventory = [
    {
      label: "Resources",
      value: renderInventoryItem(player.inventory.resources),
      description: "Used to construct buildings.",
    },
    {
      label: "Equipment Cards",
      value: renderEquipmentCardItem(player.inventory.equipment),
      description: player.inventory.equipment,
    },
    {
      label: "Treasures",
      value: renderInventoryItem(player.inventory.treasures),
      description: "Used to alter game situations.",
    },
    {
      label: "Quests",
      value: renderInventoryItem(player.inventory.quests),
      description: "Used to gain victory points.",
    },
  ];
  const inventoryCards = inventory.map((item) => (
    <div
      className="inventoryCard"
      key={item.label}
      onClick={() => handleItemClick(item.label, item.description)}
    >
      {item.label} <div>{item.value}</div>
    </div>
  ));
  //Get and display buildings
  const buildings = [
    {
      label: "Resource",
      value: renderBuildingItem(player.buildings.resource),
      description: "Used to generate resources.",
    },
    {
      label: "Defense",
      value: renderBuildingItem(player.buildings.defense),
      description: "Used to defend against attackers.",
    },
    {
      label: "Equipment",
      value: renderBuildingItem(player.buildings.equipment),
      description: "Used to increase/modify equipment.",
    },
    {
      label: "Quest",
      value: renderBuildingItem(player.buildings.quest),
      description: "Used to gain quests.",
    },
    {
      label: "Movement",
      value: renderBuildingItem(player.buildings.movement),
      description: "Used to increase board moevement.",
    },
  ];
  const buildingCards = buildings.map((item) => (
    <div
      className="buildingCard"
      key={item.label}
      onClick={() => handleItemClick(item.label, item.description)}
    >
      {item.label} <div>{item.value}</div>
    </div>
  ));

  // Handling click to call details on item
  const handleItemClick = (type: string, content: string | EquipmentItem[]) => {
    setCurrentDetailType(type);

    // Only set content if it's a string, otherwise clear it
    if (typeof content === "string") {
      setCurrentDetailContent(content);
    } else {
      setCurrentDetailContent("");
    }

    setShowDetails(true);

    // Fetch equipable items if the clicked type is an equipment category
    if (["Weapon", "Armor", "Amulet", "Boots", "Gloves"].includes(type)) {
      const equipableItems = player.inventory.equipment.filter(
        (item) => item.slot.toLowerCase() === type.toLowerCase()
      );
      setCurrentEquipableItems(equipableItems);
    }
  };

  //Handle equipping an item
  const handleEquipItem = (itemToEquip: EquipmentItem) => {
    // Cast the slot to the correct type
    const slotKey = itemToEquip.slot as keyof PlayerInfo["equippedItems"];

    // Now TypeScript knows that slotKey is one of the keys of equippedItems
    const updatedEquippedItems = { ...player.equippedItems };
    updatedEquippedItems[slotKey] = [itemToEquip];

    // Now you can safely update the player state
    // Assuming you have a setter for your player state, which might look like this:
    // setPlayer({ ...player, equippedItems: updatedEquippedItems });

    // Close the details modal
    setShowDetails(false);

    // If you need to update the state in a parent component or send it to the server,
    // You would typically do that here
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <PlayerMenuDetails
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        detailType={currentDetailType}
        detailContent={currentDetailContent}
        equipableItems={currentEquipableItems}
        onEquipItem={onEquipItem}
      />
      <div className="playerMenuContainer">
        <div className="modalHeader">
          <h2>{player?.username}'s Menu</h2>
          <button className="closeButton" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>
        <IonList>
          <IonItem>
            <div className="victoryPointsCards">
              <h3 className="victoryPointsCard">
                Victory Points {player?.victoryPoints}
              </h3>
            </div>
          </IonItem>
          <IonItem slot="center">
            <div className="statsCards">
              <h3>Player Stats</h3>
              {statsCards}
            </div>
          </IonItem>
          <IonItem slot="center">
            <div className="statsCards">
              <h3>Equipped Gear</h3>
              {equippedItemsCards}
            </div>
          </IonItem>
          <IonItem slot="center">
            <div className="inventoryCards">
              {" "}
              <h3>Inventory</h3>
              {inventoryCards}
            </div>
          </IonItem>
          <IonItem slot="center">
            <div className="buildingCards">
              <h3>Buildings</h3>
              {buildingCards}
            </div>
          </IonItem>
        </IonList>
        <IonButton onClick={onClose}>Close Menu</IonButton>
      </div>
    </IonModal>
  );
};

export default PlayerMenu;
