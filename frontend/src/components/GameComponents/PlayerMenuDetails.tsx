import React, { useEffect, useState } from "react";
import { IonModal, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { EquipmentItem, PlayerInfo } from "./Interfaces";
import EquipmentMenuDetails from "./EquipmentMenuDetails";

interface PlayerMenuDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  detailType: string;
  detailContent: string;
  equipableItems?: any[];
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
}

const PlayerMenuDetails: React.FC<PlayerMenuDetailsProps> = ({
  isOpen,
  onClose,
  detailType,
  detailContent,
  equipableItems,
  player,
  updatePlayerData,
}) => {
  return (
    <>
      {detailType !== "Equipment Cards" &&
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
            />
          </div>
        </IonModal>
      )}
    </>
  );
};

export default PlayerMenuDetails;
