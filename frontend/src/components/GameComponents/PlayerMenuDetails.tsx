import React from "react";
import { IonModal, IonButton, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./PlayerMenu.scss";

interface PlayerMenuDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  detailType: string;
  detailContent: string;
  equipableItems?: any[];
//   onEquipItem: any;
}

const PlayerMenuDetails: React.FC<PlayerMenuDetailsProps> = ({
    isOpen,
    onClose,
    detailType,
    detailContent,
    equipableItems
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
              {equipableItems.map((item, index) => (
                <div key={index} className="equipmentDetails">
                  <p><strong>Name:</strong> {item.equipmentName}</p>
                  <p><strong>Slot:</strong> {item.slot}</p>
                  <p><strong>Set:</strong> {item.set}</p>
                  <p><strong>Element:</strong> {item.element}</p>
                  <p><strong>Bonus:</strong> {item.bonus}</p>
                  <IonButton onClick={() => {/* Handle Equip logic here */}}>
                    Equip
                  </IonButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonModal>
    );
  };
  

export default PlayerMenuDetails;
