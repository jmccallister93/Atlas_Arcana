import React, { useState, useEffect } from "react";
import { IonModal, IonButton, IonList, IonItem, IonLabel } from "@ionic/react";
import {
  EquipmentItem,
  QuestItem,
  TreasureItem,
  GameSessionInfo,
  PlayerInfo,
} from "../Interfaces";
import "./PlayerMenu.scss";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import PlayerMenuDetails from "./PlayerMenuDetails";
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

interface PlayerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({ isOpen, onClose }) => {
  // Context vars
  const { updatePlayerData } = useGameContext();
  const auth = useAuth();
  // Get Player data
  const players = useGameStatePart((state) => state.players as PlayerInfo[]);
  const currentPlayer = players.find(
    (player) => player.username === auth.username
  );
  // Local States
  const [showDetails, setShowDetails] = useState(false);
  const [currentDetailType, setCurrentDetailType] = useState<string>("");
  const [currentDetailContent, setCurrentDetailContent] = useState<string>("");
  const [currentEquipableItems, setCurrentEquipableItems] = useState<
    EquipmentItem[]
  >([]);
  const [currentQuestItem, setCurrentQuestItem] = useState<QuestItem[]>([]);
  const [currentTreasureItem, setCurrentTreasureItem] = useState<
    TreasureItem[]
  >([]);

  // Need to verify player exists
  if (!currentPlayer) {
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
  //   Render treasure cards TO DO
  const renderTreasureCardItem = (treasure: any) => {
    return treasure && treasure.length > 0
      ? treasure.map((treasure: any, index: any) => (
          <div className="namedCard" key={index}>
            {treasure.treasureName}
          </div>
        ))
      : "None";
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
  const renderQuestCardItem = (quest: any) => {
    return quest && quest.length > 0
      ? quest.map((quest: any, index: any) => (
          <div className="namedCard" key={index}>
            {quest.questName}
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

  function countBuildingsByCategory(buildingsArray: any[]) {
    const categoryCounts: any = {};
  
    buildingsArray.forEach(building => {
      const category = building.category; // Assuming each building has a 'category' property
      if (category) {
        if (!categoryCounts[category]) {
          categoryCounts[category] = 0;
        }
        categoryCounts[category]++;
      }
    });
  
    return categoryCounts;
  }
  
  

  // Get and display stats
  const stats = [
    {
      label: "Rank",
      value: currentPlayer.rank,
      description: "Used to determine usable equipment level.",
    },
    {
      label: "Health",
      value: currentPlayer.health,
      description: "Used for total life force, when 0 player dies.",
    },
    {
      label: "Offense",
      value: currentPlayer.offense,
      description: "Used to determine number added to attack rolls.",
    },
    {
      label: "Defense",
      value: currentPlayer.defense,
      description: "Used to determine number added to defense rolls.",
    },
    {
      label: "Stamina",
      value: currentPlayer.stamina,
      description: "Used to determine usable total attacks per combat round.",
    },
    {
      label: "Movement",
      value: currentPlayer.movement,
      description: "Used to determine move spaces on the board.",
    },
    {
      label: "Build",
      value: currentPlayer.build,
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
      {item.label} <div className="namedCard">{item.value}</div>
    </div>
  ));
  //   Get and display equipped items
  const equippedItems = [
    {
      label: "Weapon",
      value: renderEquippedItem(currentPlayer.equippedItems.weapon, "weapon"),
      description: "Used to increase offense.",
    },
    {
      label: "Armor",
      value: renderEquippedItem(currentPlayer.equippedItems.armor, "armor"),
      description: "Used to increase defense.",
    },
    {
      label: "Amulet",
      value: renderEquippedItem(currentPlayer.equippedItems.amulet, "amulet"),
      description: "Used to increase health.",
    },
    {
      label: "Boots",
      value: renderEquippedItem(currentPlayer.equippedItems.boots, "boots"),
      description: "Used to increase speed.",
    },
    {
      label: "Gloves",
      value: renderEquippedItem(currentPlayer.equippedItems.gloves, "gloves"),
      description: "Used to increase build.",
    },
  ];

  const equippedItemsCards = equippedItems.map((item) => {
    const slot = item.label.toLowerCase() as keyof PlayerInfo["equippedItems"];
    return (
      <div
        className="inventoryCard"
        key={item.label}
        onClick={() => handleItemClick(item.label, item.description)}
      >
        {item.label}{" "}
        <div className="namedCard">
          {renderEquippedItem(currentPlayer.equippedItems[slot], slot)}
        </div>
      </div>
    );
  });

  //Get and display inventory
  const inventory = [
    {
      label: "Resources",
      value: currentPlayer.inventory.resources,
      description: "Used to construct buildings.",
    },
    {
      label: "Equipment Cards",
      value: renderEquipmentCardItem(currentPlayer.inventory.equipment),
      description: currentPlayer.inventory.equipment,
    },
    {
      label: "Treasures",
      value: renderTreasureCardItem(currentPlayer.inventory.treasures),
      description: currentPlayer.inventory.treasures,
    },
    {
      label: "Quests",
      value: renderQuestCardItem(currentPlayer.inventory.quests),
      description: currentPlayer.inventory.quests,
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
      value: renderBuildingItem(currentPlayer.buildings.resource),
      description: "Used to generate resources.",
    },
    {
      label: "Defense",
      value: renderBuildingItem(currentPlayer.buildings.defense),
      description: "Used to defend against attackers.",
    },
    {
      label: "Equipment",
      value: renderBuildingItem(currentPlayer.buildings.equipment),
      description: "Used to increase/modify equipment.",
    },
    {
      label: "Quest",
      value: renderBuildingItem(currentPlayer.buildings.quest),
      description: "Used to gain quests.",
    },
    {
      label: "Movement",
      value: renderBuildingItem(currentPlayer.buildings.movement),
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
  const handleItemClick = (
    type: string,
    content: string | EquipmentItem[] | any
  ) => {
    setCurrentDetailType(type);

    if (type === "Quests") {
      setCurrentQuestItem(content as QuestItem[]);
    } else if (type === "Treasures") {
      setCurrentTreasureItem(content as TreasureItem[]);
    } else if (
      Array.isArray(content) &&
      content[0] &&
      content[0].hasOwnProperty("equipmentName")
    ) {
      setCurrentEquipableItems(content as EquipmentItem[]);
    } else {
      // Only set content if it's a string, otherwise clear it
      if (typeof content === "string") {
        setCurrentDetailContent(content);
      } else {
        setCurrentDetailContent("");
      }
    }

    setShowDetails(true);

    // Fetch equipable items if the clicked type is an equipment category or "Equipment Cards"
    if (
      [
        "Weapon",
        "Armor",
        "Amulet",
        "Boots",
        "Gloves",
        "Equipment Cards",
      ].includes(type)
    ) {
      const equipableItems =
        type === "Equipment Cards"
          ? (content as EquipmentItem[])
          : currentPlayer.inventory.equipment.filter(
              (item) => item.slot.toLowerCase() === type.toLowerCase()
            );
      setCurrentEquipableItems(equipableItems);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <PlayerMenuDetails
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        detailType={currentDetailType}
        detailContent={currentDetailContent}
        equipableItems={currentEquipableItems}
        questItems={currentQuestItem}
        treasureItems={currentTreasureItem}
        player={currentPlayer}
        updatePlayerData={updatePlayerData}
        currentPlayer={currentPlayer}
      />

      <div className="playerMenuContainer">
        <div className="modalHeader">
          <h2>{currentPlayer?.username}'s Menu</h2>
          <button className="closeButton" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>
        <IonList>
          <IonItem>
            <div className="victoryPointsCards">
              <h3 className="victoryPointsCard">
                Victory Points {currentPlayer?.victoryPoints}
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
            <div className="inventoryCards">
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
