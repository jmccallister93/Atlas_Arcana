import React, { useEffect, useState } from "react";
import { IonModal, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { EquipmentItem, PlayerInfo } from "../Interfaces";
import EquipmentMenuDetails from "./EquipmentMenuDetails";
import TreasureMenuDetails from "./TreasureMenuDetails";
import QuestMenuDetails from "./QuestMenuDetails";

interface PlayerMenuDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  detailType: string;
  detailContent: string;
  equipableItems?: any[];
  treasureItems?: any[];  // Object for a specific treasure item
  questItems?: any[];       // Object for a specific quest item
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
  currentPlayer: PlayerInfo;
}

const PlayerMenuDetails: React.FC<PlayerMenuDetailsProps> = ({
  isOpen,
  onClose,
  detailType,
  detailContent,
  equipableItems,
  treasureItems,
  questItems,
  player,
  updatePlayerData,
  currentPlayer
}) => {

  return (
    <>
      {detailType === "Treasures" ? (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
          <div className="playerMenuContainer">
            <div className="backButton">
              <IonIcon icon={arrowBack} onClick={onClose} />
            </div>
            <TreasureMenuDetails
              treasureItems={treasureItems}
              player={player}
              updatePlayerData={updatePlayerData}
            />
          </div>
        </IonModal>
      ) : detailType === "Quests" ? (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
          <div className="playerMenuContainer">
            <div className="backButton">
              <IonIcon icon={arrowBack} onClick={onClose} />
            </div>
            <QuestMenuDetails
              questItems={questItems}
              player={player}
              updatePlayerData={updatePlayerData}
            />
          </div>
        </IonModal>
      ) : detailType !== "Equipment Cards" &&
        detailType !== "Weapon" &&
        detailType !== "Armor" &&
        detailType !== "Amulet" &&
        detailType !== "Boots" &&
        detailType !== "Gloves" ? (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
          <div className="playerMenuContainer">
            <div className="backButton">
              <IonIcon icon={arrowBack} onClick={onClose} />
            </div>
            <h3>{detailType}</h3>
            <p>{detailContent}</p>
          </div>
        </IonModal>
      ) : (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
          <div className="playerMenuContainer">
            <div className="backButton">
              <IonIcon icon={arrowBack} onClick={onClose} />
            </div>
            <EquipmentMenuDetails
              equipableItems={equipableItems}
              player={player}
              updatePlayerData={updatePlayerData}
              currentPlayer={currentPlayer}
            />
          </div>
        </IonModal>
      )}
    </>
  );
};

export default PlayerMenuDetails;
