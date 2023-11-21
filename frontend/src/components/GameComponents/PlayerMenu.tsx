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
  ];
  const statsCards = stats.map((stat) => (
    <div
      className="statCard"
      key={stat.label}
      onClick={() => handleItemClick(stat.label, stat.description)}
    >
      {stat.label} <div>{stat.value}</div>
    </div>
  ));

  //Conditional if inventory item is empty
  const renderInventoryItem = (item: any) => {
    return item && item.length > 0 ? item : "None";
  };
  //Conditional if building item is empty
  const renderBuildingItem = (item: any) => {
    return item && item.length > 0 ? item : "None";
  };

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
            <h3>Inventory</h3>
            <div className="inventoryCards">
              <div className="inventoryCard">
                Resources{" "}
                <div>{renderInventoryItem(player.inventory.resources)}</div>
              </div>
              <div className="inventoryCard">
                Equipment{" "}
                <div>{renderInventoryItem(player.inventory.equipment)}</div>
              </div>
              <div className="inventoryCard">
                Treasures{" "}
                <div>{renderInventoryItem(player.inventory.treasures)}</div>
              </div>
              <div className="inventoryCard">
                Quests <div>{renderInventoryItem(player.inventory.quests)}</div>
              </div>
            </div>
          </IonItem>
          <IonItem slot="center">
            <h3>Buildings</h3>
            <div className="buildingCards">
              <div className="buildingCard">
                Defense{" "}
                <div>{renderBuildingItem(player.buildings.defense)}</div>
              </div>
              <div className="buildingCard">
                Equipment{" "}
                <div>{renderBuildingItem(player.buildings.equipment)}</div>
              </div>
              <div className="buildingCard">
                Quest <div>{renderBuildingItem(player.buildings.quest)}</div>
              </div>
              <div className="buildingCard">
                Resource{" "}
                <div>{renderBuildingItem(player.buildings.resource)}</div>
              </div>
              <div className="buildingCard">
                Movement{" "}
                <div>{renderBuildingItem(player.buildings.movement)}</div>
              </div>
            </div>
          </IonItem>
        </IonList>
        <IonButton onClick={onClose}>Close Menu</IonButton>
      </div>
    </IonModal>
  );
};

export default PlayerMenu;
