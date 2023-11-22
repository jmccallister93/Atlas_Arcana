import React from "react";
import { IonModal, IonButton, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";
import { EquipmentItem, PlayerInfo } from "./Interfaces";

interface PlayerMenuDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  detailType: string;
  detailContent: string;
  equipableItems?: any[];
  onEquipItem: (item: EquipmentItem) => void
  player: PlayerInfo;
}

const PlayerMenuDetails: React.FC<PlayerMenuDetailsProps> = ({
  isOpen,
  onClose,
  detailType,
  detailContent,
  equipableItems,
  onEquipItem,
  player,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <div className="detailsContainer">
        <div className="backButton">
          <IonIcon icon={arrowBack} onClick={onClose} />
        </div>
        <h3>{detailType}</h3>
        <p>{detailContent}</p>
        {equipableItems && equipableItems.length > 0 && (
  <div>
    <h4>Equipable Items</h4>
    {equipableItems.map((item: any, index: any) => {
          // Cast slot to keyof PlayerInfo["equippedItems"] to ensure type safety
          const slot = item.slot as keyof PlayerInfo["equippedItems"];

          // Check if the item is equipped
          const isEquipped = player.equippedItems[slot]?.some(
            (equippedItem) => equippedItem.equipmentName === item.equipmentName
          );

      return (
        <div key={index} className={`equipmentDetails ${isEquipped ? "equipped" : ""}`}>
          <div key={index} className="equipmentDetails">
                <p>
                  <strong>Name:</strong> {item.equipmentName}
                </p>
                <p>
                  <strong>Rank:</strong> {item.rank}
                </p>
                <p>
                  <strong>Slot:</strong> {item.slot}
                </p>
                <p>
                  <strong>Set:</strong> {item.set}
                </p>
                <p>
                  <strong>Element:</strong> {item.element}
                </p>
                <p>
                  <strong>Bonus:</strong> {item.bonus}
                </p>
              </div>
          {isEquipped ? (
            <IonButton disabled={true}>Equipped</IonButton>
          ) : (
            <IonButton onClick={() => onEquipItem(item)}>Equip</IonButton>
          )}
        </div>
      );
    })}
  </div>
)}
      </div>
    </IonModal>
  );
};

export default PlayerMenuDetails;