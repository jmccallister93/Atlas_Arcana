import React, { useEffect, useState } from "react";
import { GameSessionInfo } from "../Interfaces";

interface CurrentPhaseProps {
  gameState: GameSessionInfo;
  onPhaseChange: (newTurn: string) => void;
}

const CurrentPhase: React.FC<CurrentPhaseProps> = ({
  gameState,
  onPhaseChange,
}) => {
  const [currentPhase, setCurrentPhase] = useState<string>(
    gameState.currentPhase
  );
  // Turn order
  useEffect(() => {
    const newPhase = gameState.currentPhase;
    setCurrentPhase(newPhase);
    onPhaseChange(newPhase); // Call the callback function
  }, [gameState.currentPhase, onPhaseChange]);
  
  return (
    <h4 className="pageHeader">Current Phase: {currentPhase}</h4>
  );
};

const areEqual = (prevProps: any, nextProps: any) => {
  if (
    prevProps.gameState.currentPhase !==
    nextProps.gameState.currentPhase
  ) {
    return false; // Re-render if currentPlayer changes
  }

  return true; // Props are equal, don't re-render
};

export default React.memo(CurrentPhase, areEqual);
