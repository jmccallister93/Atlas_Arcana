import React, { useState, useEffect } from 'react';
import { IonModal, IonButton, IonList, IonItem, IonLabel } from '@ionic/react';
import { PlayerInfo } from './Interfaces'; // Adjust the path as needed

interface PlayerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerInfo | null;
}

const PlayerMenu: React.FC<PlayerMenuProps> = ({ isOpen, onClose, player }) => {
  // You can add more states and effects as needed based on your game's functionality

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <div className="playerMenuContainer">
        <h2>{player?.username}'s Menu</h2>
        <IonList>
          <IonItem>
            <IonLabel>Inventory</IonLabel>
            {/* Display Inventory Items */}
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
