import React, { useState, useEffect } from "react";
import { IonModal, IonButton, IonList, IonItem, IonLabel } from "@ionic/react";
import { GameSessionInfo, GameState, PlayerInfo } from "./Interfaces"; // Adjust the path as needed
import "./PlayerMenu.scss";
interface PlayerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  player?: PlayerInfo;
  gameState?: GameSessionInfo;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({ isOpen, onClose, player }) => {
  // You can add more states and effects as needed based on your game's functionality
  if (!player) {
    return null; // or some placeholder UI
  }

  //Conditional if inventory item is empty
  const renderInventoryItem = (item: any) => {
    return item && item.length > 0 ? item : "None";
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <div className="playerMenuContainer">
        <h2>Stats Menu</h2>
        <IonList>
          <IonItem>
            <IonLabel>Player Stats</IonLabel>
          </IonItem>
          <IonItem slot="center">
            <div className="statsCards">
              <div className="statCard">
                Rank <div>{player.rank} </div>
              </div>
              <div className="statCard">
                Health <div>{player.health}</div>
              </div>
              <div className="statCard">
                Offense <div>{player.offense}</div>
              </div>
              <div className="statCard">
                Defense <div>{player.defense}</div>
              </div>
              <div className="statCard">
                Stamina <div>{player.stamina}</div>
              </div>
              <div className="statCard">
                Movement <div>{player.movement}</div>
              </div>
            </div>
          </IonItem>
          <IonItem>
            <IonLabel>Inventory</IonLabel>
          </IonItem>

          <IonItem slot="center">
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

          <IonItem>
            <IonLabel>Buildings</IonLabel>
            {/* Display Building Information */}
          </IonItem>
          <IonItem>
            <IonLabel>Victory Points: </IonLabel>
            {/* {player?.victoryPoints} */}
            {/* Display Victory Points */}
          </IonItem>
        </IonList>
        <IonButton onClick={onClose}>Close Menu</IonButton>
      </div>
    </IonModal>
  );
};

export default PlayerMenu;
