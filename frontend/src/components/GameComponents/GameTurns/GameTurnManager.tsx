import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { arrowForwardCircleOutline } from "ionicons/icons";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";

interface GameTurnManagerProps {
  gameState?: GameSessionInfo;
  players: PlayerInfo[];
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
  currentPlayer: PlayerInfo | undefined;
}

const GameTurnManager: React.FC<GameTurnManagerProps> = ({
  gameState,
  players,
  emitGameStateUpdate,
  currentPlayer,
}) => {
  // Turn order and state
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<string | null>(
    null
  );
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [gamePhaseButton, setGamePhaseButton] = useState<JSX.Element | null>();
  // Turn order
  useEffect(() => {
    setCurrentPlayerTurn(gameState?.gameState.currentPlayerTurn ?? null);
  }, [gameState]);

  // Render advance phase for player who's turn it is
  useEffect(() => {
    if (currentPlayer?.username === currentPlayerTurn) {

      const gamePhaseButtonRender = (
        <h4 className="pageHeader">
          Next Phase{" "}
          <IonIcon
            icon={arrowForwardCircleOutline}
            size="large"
            color="success"
            onClick={advancePhase}
          />
        </h4>
      );
      setGamePhaseButton(gamePhaseButtonRender);
    } else {
      setGamePhaseButton(null);
    }
  }, [currentPlayerTurn, gameState]);

  // Set initial phase
  useEffect(() => {
    if (gameState && gameState.gameState) {
      setCurrentPhase(gameState.gameState.currentPhase);
    }
  }, [gameState]);

  // Phase order
  const phaseOrder = ["Draw", "Trade", "Rest", "Map", "Combat", "Titan"];
  const advancePhase = () => {
    const currentPhaseIndex = phaseOrder.indexOf(
      gameState?.gameState?.currentPhase ?? phaseOrder[0]
    );
    const nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
    const nextPhase = phaseOrder[nextPhaseIndex];

    if (gameState && gameState.gameState) {
      let nextPlayerTurn = gameState.gameState.currentPlayerTurn;

      // Check if we need to move to the next player
      if (nextPhase === phaseOrder[0]) {
        console.log(
          "Current Player Turn:",
          gameState.gameState.currentPlayerTurn
        );
        console.log("Turn Order:", gameState.gameState.turnOrder);

        const currentPlayerIndex = gameState.gameState.turnOrder.findIndex(
          (player) => player === gameState.gameState.currentPlayerTurn
        );

        // Debugging logs
        console.log("Current playerindex:", currentPlayerIndex);

        // Handle the case where the current player index is not found
        if (currentPlayerIndex === -1) {
          console.error("Current player turn not found in turn order.");
          // Optionally set a default player or handle this error appropriately
          return;
        }

        const nextPlayerIndex =
          (currentPlayerIndex + 1) % gameState.gameState.turnOrder.length;
        console.log("Current nextPlayerIndex:", nextPlayerIndex);

        nextPlayerTurn = gameState.gameState.turnOrder[nextPlayerIndex];
        console.log("Current nextPlayerTurn:", nextPlayerTurn);
      }

      const newState = {
        gameState: {
          ...gameState.gameState,
          currentPhase: nextPhase,
          currentPlayerTurn: nextPlayerTurn, // Ensured to be a string
        },
      };

      // Emit updated state
      emitGameStateUpdate(newState);
    }
  };

  return (
    <>
      <h4 className="pageHeader">Player Turn: {currentPlayerTurn}</h4>
      <h4 className="pageHeader">
        Game Phase: {gameState?.gameState.currentPhase}
      </h4>
      {gamePhaseButton}
    </>
  );
};

export default GameTurnManager;
