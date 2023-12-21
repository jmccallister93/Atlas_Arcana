import React, { useEffect, useState } from 'react';
import { IonToast } from '@ionic/react';
import { useGameContext } from '../../../context/GameContext/GameContext';

interface UpdateNotificationProps {
}

const UpdateNotifications: React.FC<UpdateNotificationProps> = ({ }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onDidDismiss = () => setIsOpen(false);
  const [message, setMessage] = useState<string>("");
  const {gameState} = useGameContext();
  
  // Listen for updates to the game state
  useEffect(() => {
    // If there's a change in currentPhase, update the message
    if (gameState.currentPhase) {
      setIsOpen(true)
      setMessage(`Phase Changed to: ${gameState.currentPhase}`);
    } 
  }, [gameState.currentPhase]);

  useEffect(() => {
    // If there's a change in currentPhase, update the message
    if (gameState.currentPlayerTurn) {
      setIsOpen(true)
      setMessage(`Turn Passed to: ${gameState.currentPlayerTurn}`);
    } 
  }, [gameState.currentPlayerTurn]);

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
