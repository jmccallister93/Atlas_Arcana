import React from 'react';
import { IonToast } from '@ionic/react';

interface UpdateNotificationProps {
  message: string;
  isOpen: boolean;
  onDidDismiss: () => void;
}

const UpdateNotifications: React.FC<UpdateNotificationProps> = ({ message, isOpen, onDidDismiss }) => {
  return (
    <IonToast
      isOpen={isOpen}
      onDidDismiss={onDidDismiss}
      message={message}
      duration={5000}
      position="top"
    />
  );
};

export default UpdateNotifications;
