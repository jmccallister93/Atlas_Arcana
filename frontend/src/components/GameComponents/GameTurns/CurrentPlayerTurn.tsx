import React, { useEffect, useState } from "react";
import { GameSessionInfo } from "../Interfaces";

interface CurrentPlayerTurnProps {
  gameState: GameSessionInfo;
  onPlayerTurnChange: (newTurn: string) => void;
}

const CurrentPlayerTurn: React.FC<CurrentPlayerTurnProps> = ({
  gameState,
  onPlayerTurnChange,
}) => {
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<string>(
    gameState.gameState.currentPlayerTurn
  );
  // Turn order
  useEffect(() => {
    const newTurn = gameState.gameState.currentPlayerTurn;
    setCurrentPlayerTurn(newTurn);
    onPlayerTurnChange(newTurn); // Call the callback function
  }, [gameState.gameState.currentPlayerTurn, onPlayerTurnChange]);
  
  return (
    <h4 className="pageHeader">Current Player Turn: {currentPlayerTurn}</h4>
  );
};

const areEqual = (prevProps: any, nextProps: any) => {
  if (
    prevProps.gameState.gameState.currentPlayerTurn !==
    nextProps.gameState.gameState.currentPlayerTurn
  ) {
    return false; // Re-render if currentPlayer changes
  }

  return true; // Props are equal, don't re-render
};

export default React.memo(CurrentPlayerTurn, areEqual);
