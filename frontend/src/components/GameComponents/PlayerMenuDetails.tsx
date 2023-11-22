import React from 'react';
import { IonModal, IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import "./PlayerMenu.scss"

interface PlayerMenuDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    detailType: string;
    detailContent: string;
  }

const PlayerMenuDetails: React.FC<PlayerMenuDetailsProps> = ({ isOpen, onClose, detailType, detailContent }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <div className="detailsContainer">
        <div className="backButton" >
          <IonIcon icon={arrowBack} onClick={onClose} />
        </div>
        <h3>{detailType}</h3>
        <p>{detailContent}</p>
      </div>
    </IonModal>
  );
};

export default PlayerMenuDetails;
