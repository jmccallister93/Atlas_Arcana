// TileAlerts.tsx
import React from 'react';
import { IonAlert } from '@ionic/react';
import { TileInfo } from './GameBoard';

interface TileAlertsProps {
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  alertMessage: string;
  selectedTile?: TileInfo | null; // Optional, can be used for more specific alerts in the future
}

const TileAlerts: React.FC<TileAlertsProps> = ({
  showAlert,
  setShowAlert,
  alertMessage,
  selectedTile,
}) => {
  return (
    <IonAlert
      isOpen={showAlert}
      onDidDismiss={() => setShowAlert(false)}
      header={"Alert"}
      message={alertMessage}
      buttons={["OK"]}
    />
  );
};

export default TileAlerts;
