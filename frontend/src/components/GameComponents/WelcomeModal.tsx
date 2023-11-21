// WelcomeModal.tsx
import { IonModal, IonButton, IonContent } from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./WelcomeModal.scss";

interface WelcomeModalProps {
  isOpen: boolean;
  messageGroups: MessageGroup[];
  onClose: () => void;
}

interface MessageGroup {
  title: string;
  content: { message: string; delay: number }[];
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  messageGroups,
  onClose,
}) => {
  // State to hold the current message group
  const [currentMessageGroup, setCurrentMessageGroup] = useState<MessageGroup | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  useEffect(() => {
    const displayMessageGroups = async () => {
      for (const group of messageGroups) {
        setCurrentMessageGroup(group); // Set the current group
        setCurrentContentIndex(-1); // Set to -1 to indicate that content messages are not yet displayed

        // Wait for an initial delay before showing the first content message
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust this delay as needed

        // Display each content message with a delay
        for (let i = 0; i < group.content.length; i++) {
          setCurrentContentIndex(i);
          await new Promise((resolve) => setTimeout(resolve, group.content[i].delay));
        }

        // Optional: Add a delay between groups
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      onClose(); // Close the modal after all groups
    };

    if (isOpen && messageGroups.length > 0) {
      displayMessageGroups();
    }
  }, [isOpen, messageGroups, onClose]);

  return (
    <IonModal isOpen={isOpen}>
      <IonContent>
        <h1>{currentMessageGroup?.title}</h1>
        {currentMessageGroup && currentContentIndex >= 0 && currentMessageGroup.content.slice(0, currentContentIndex + 1).map((msg, index) => (
          <p key={index} className="fadeIn">{msg.message}</p>
        ))}
      </IonContent>
    </IonModal>
  );
};


export default WelcomeModal;
