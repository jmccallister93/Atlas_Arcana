import React, { useState, useEffect } from "react";
import { IonModal, IonButton, IonList, IonItem, IonLabel } from "@ionic/react";
import { GameSessionInfo, GameState, PlayerInfo } from "./Interfaces"; // Adjust the path as needed
import "./PlayerMenu.scss";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import PlayerMenuDetails from "./PlayerMenuDetails";

interface PlayerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  player?: PlayerInfo;
  gameState?: GameSessionInfo;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({ isOpen, onClose, player }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentDetailType, setCurrentDetailType] = useState<string>("");
  const [currentDetailContent, setCurrentDetailContent] = useState<string>("");

  // Need to verify player exists
  if (!player) {
    return null;
  }
  //Conditional if equippedItems item is empty
  const renderEquippedItem = (item: any) => {
    return item && item.length > 0 ? item : "None";
  };
  //Conditional if inventory item is empty
  const renderInventoryItem = (item: any) => {
    return item && item.length > 0 ? item : "None";
  };

  //   Test on click

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
  //Conditional if equipment card item is empty
  const renderEquipmentCardDescription = (equipment: any) => {
    return equipment && equipment.length > 0
      ? equipment.map((equipment: any, index: any) => (
          <div className="namedCard" key={index}>
            <div> Name: {equipment.equipmentName}</div>
            <div> Slot: {equipment.slot}</div>
            <div>Set: {equipment.set}</div>
            <div>Element: {equipment.element}</div>
            <div>Bonus: {equipment.bonus}</div>
            <div>-------------------------------------</div>
          </div>
        ))
      : "None";
  };
    //Conditional if inventory item is empty
    const renderQuestCardDescription = (equipment: any) => {
        return equipment && equipment.length > 0
          ? equipment.map((equipment: any, index: any) => (
              <div className="namedCard" key={index}>
                <div> Name: {equipment.equipmentName}</div>
                <div> Slot: {equipment.slot}</div>
                <div>Set: {equipment.set}</div>
                <div>Element: {equipment.element}</div>
                <div>Bonus: {equipment.bonus}</div>
                <div>-------------------------------------</div>
              </div>
            ))
          : "None";
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
          name: buildingName,
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
      value: renderEquippedItem(player.equippedItems.weapon),
      description: "Used to increase offense.",
      equippableCards: "",
    },
    {
      label: "Armor",
      value: renderEquippedItem(player.equippedItems.armor),
      description: "Used to increase defense.",
    },
    {
      label: "Amulet",
      value: renderEquippedItem(player.equippedItems.amulet),
      description: "Used to increase health.",
    },
    {
      label: "Boots",
      value: renderEquippedItem(player.equippedItems.boots),
      description: "Used to increase speed.",
    },

    {
      label: "Gloves",
      value: renderEquippedItem(player.equippedItems.gloves),
      description: "Used to increase build.",
    },
  ];
  const equippedItemsCards = equippedItems.map((item) => (
    <div
      className="statCard"
      key={item.label}
      onClick={() => handleItemClick(item.label, item.description)}
    >
      {item.label} <div>{item.value}</div>
    </div>
  ));
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
      description: renderEquipmentCardDescription(player.inventory.equipment),
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
  const handleItemClick = (type: string, content: string) => {
    setCurrentDetailType(type);
    setCurrentDetailContent(content);
    setShowDetails(true);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <PlayerMenuDetails
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        detailType={currentDetailType}
        detailContent={currentDetailContent}
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
              <div className="victoryPointsCard">
                Victory Points <div>{player?.victoryPoints}</div>
              </div>
            </div>
          </IonItem>
          <IonItem slot="center">
            <h3>Player Stats</h3>
            <div className="statsCards">{statsCards}</div>
          </IonItem>
          <IonItem slot="center">
            <h3>Equipped Gear</h3>
            <div className="statsCards">{equippedItemsCards}</div>
          </IonItem>
          <IonItem slot="center">
            <h3>Inventory</h3>
            <div className="inventoryCards">{inventoryCards}</div>
          </IonItem>
          <IonItem slot="center">
            <h3>Buildings</h3>
            <div className="buildingCards">{buildingCards}</div>
          </IonItem>
        </IonList>
        <IonButton onClick={onClose}>Close Menu</IonButton>
      </div>
    </IonModal>
  );
};

export default PlayerMenu;
