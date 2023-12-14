// WelcomeModal.tsx
import { IonModal, IonButton, IonContent } from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./WelcomeModal.scss";
import {
  GameSessionInfo,
} from "../../components/GameComponents/Interfaces";
import { useGameContext } from "../../context/GameContext/GameContext";

interface WelcomeModalProps {
  isOpen: boolean;
  // messageGroups: MessageGroup[];
  onClose: () => void;
}

interface MessageGroup {
  title: string;
  content: { message: string; delay: number }[];
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  // messageGroups,
  onClose,
}) => {
  // State to hold the current message group
const {gameState} = useGameContext()
  const [currentMessageGroup, setCurrentMessageGroup] =
    useState<MessageGroup | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [modalMessages, setModalMessages] = useState<
    { title: string; content: { message: string; delay: number }[] }[]
  >([]);

  // Welcome Modal message
  useEffect(() => {
    if (!gameState) return;
    // Welcome players
    const players = gameState.players || [];
    const playerNames = players.map((player) => player.username).join(", ");

    // Map each username in the turnOrder to a message object
    const turnOrder = gameState.turnOrder || [];
    const turnOrderMessages = turnOrder.map(
      (username: string, index: number) => ({
        message: username,
        delay: 1000 + index * 1000, // This adds a delay between each player's name
      })
    );

    const distributingCardsMessage = [
      {
        message: "Allocating Resources",
        delay: 1000,
      },
      { message: "Drawing Equipment Cards", delay: 1000 },
      { message: "Drawing Titan Cards", delay: 1000 },
    ];

    const messageGroups = [
      {
        title: "Welcome to the game",
        content: [{ message: playerNames, delay: 1000 }],
      },
      {
        title: "Rolling for turn order...",
        content: turnOrderMessages,
      },
      {
        title: "Distributing Starting Cards...",
        content: distributingCardsMessage,
      },
      {
        title: "Let's Play!",
        content: [],
      },
    ];
    setModalMessages(messageGroups);
  }, [gameState]); // Add gameState as a dependency

  useEffect(() => {
    const displayMessageGroups = async () => {
      for (const group of modalMessages) {
        setCurrentMessageGroup(group); // Set the current group
        setCurrentContentIndex(-1); // Set to -1 to indicate that content messages are not yet displayed

        // Wait for an initial delay before showing the first content message
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust this delay as needed

        // Display each content message with a delay
        for (let i = 0; i < group.content.length; i++) {
          setCurrentContentIndex(i);
          await new Promise((resolve) =>
            setTimeout(resolve, group.content[i].delay)
          );
        }

        // Optional: Add a delay between groups
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      onClose(); // Close the modal after all groups
    };

    if (isOpen && modalMessages.length > 0) {
      displayMessageGroups();
    }
  }, [isOpen, modalMessages, onClose]);

  return (
    <IonModal isOpen={isOpen}>
      <IonContent>
        <h1>{currentMessageGroup?.title}</h1>
        {currentMessageGroup &&
          currentContentIndex >= 0 &&
          currentMessageGroup.content
            .slice(0, currentContentIndex + 1)
            .map((msg, index) => (
              <p key={index} className="fadeIn">
                {msg.message}
              </p>
            ))}
      </IonContent>
    </IonModal>
  );
};

export default WelcomeModal;
