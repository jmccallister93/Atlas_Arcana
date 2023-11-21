// WelcomeModal.tsx
import { IonModal, IonButton, IonContent } from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./WelcomeModal.scss";

interface WelcomeModalProps {
  isOpen: boolean;
  messages: { message: string; delay: number }[]; // Array of messages with delays
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  messages,
  onClose,
}) => {
  // State to hold the current message
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    // Function to display messages in sequence
    const displayMessagesInSequence = async () => {
      for (const messageObj of messages) {
        await new Promise((resolve) => {
          setCurrentMessage(messageObj.message);
          setTimeout(resolve, messageObj.delay);
        });
      }
      onClose(); // Close the modal after displaying all messages
    };

    if (isOpen && messages.length > 0) {
      displayMessagesInSequence();
    }
  }, [isOpen, messages, onClose]);

  return (
    <IonModal isOpen={isOpen}>
      <IonContent>
        <p className="fadeIn">{currentMessage}</p>
      </IonContent>
    </IonModal>
  );
};

export default WelcomeModal;
