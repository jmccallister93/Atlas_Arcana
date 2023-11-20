// WelcomeModal.tsx
import { IonModal, IonButton, IonContent } from '@ionic/react';
import React from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, message, onClose }) => {
  return (
    <IonModal isOpen={isOpen}>
      <IonContent>
        <p>{message}</p>
      </IonContent>
    </IonModal>
  );
};

export default WelcomeModal;
