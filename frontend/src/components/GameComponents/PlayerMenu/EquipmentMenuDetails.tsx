import React, { useEffect, useState } from "react";
import { IonModal, IonButton, IonIcon, IonAlert } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { BuildingInfo, EquipmentItem, PlayerInfo } from "../Interfaces";
import { useGameContext } from "../../../context/GameContext/GameContext";
import EquipGear from "./EquipGear";
import RankupGear from "./RankupGear";
import AttuneGear from "./AttuneGear";

interface EquipmentMenuDetailsProps {
  equipableItems?: any[];
  player: PlayerInfo;
  updatePlayerData: (updatedPlayer: PlayerInfo) => void;
  currentPlayer: PlayerInfo;
}
const EquipmentMenuDetails: React.FC<EquipmentMenuDetailsProps> = ({
  equipableItems,
  player,
}) => {

  return (
    <>
      {" "}
      {equipableItems && equipableItems.length > 0 && (
        <div>
          <h4>Equipable Items</h4>
          {equipableItems.map((item: any, index: any) => {
            return (
              <div key={index} className="equipmentDetails">
                <EquipGear equipableItems={equipableItems} player={player} />
                <RankupGear equipableItems={equipableItems} player={player} />
                <p>
                  <strong>Slot:</strong> {item.slot}
                </p>
                <p>
                  <strong>Set:</strong> {item.set}
                </p>
                <AttuneGear equipableItems={equipableItems} player={player} />
                <p>
                  <strong>Bonus:</strong> {item.bonus}
                </p>
              </div>
            );
          })}
        </div>
      )}{" "}
    </>
  );
};

export default EquipmentMenuDetails;
