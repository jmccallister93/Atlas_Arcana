import React, { useState, useEffect } from "react";
import { IonIcon, ReactComponentOrElement } from "@ionic/react";
import { arrowForwardCircleOutline } from "ionicons/icons";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";
import DrawPhase from "./DrawPhase";

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
  const phaseOrder = ["Draw", "Trade", "Rest", "Map", "Combat", "Titan"];
  const [drawPhase, setDrawPhase] = useState<ReactComponentOrElement>();

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
  //Advance PHase
  const advancePhase = () => {
    if (!gameState || !gameState.gameState) {
      console.error("Game state is undefined");
      return; // Exit the function if gameState is undefined
    }

    const isSetupPhase = gameState?.gameState?.currentPhase === "Setup";
    let nextPhase, nextPlayerTurn;

    if (isSetupPhase) {
      // Find the next player who needs to complete the setup phase
      const currentPlayerIndex = gameState.gameState.turnOrder.findIndex(
        (player) => player === gameState.gameState.currentPlayerTurn
      );

      const nextPlayerIndex =
        (currentPlayerIndex + 1) % gameState.gameState.turnOrder.length;
      nextPlayerTurn = gameState.gameState.turnOrder[nextPlayerIndex];

      // If we have looped back to the first player, setup is complete
      if (nextPlayerIndex === 0) {
        nextPhase = phaseOrder[0]; // Assuming 'Draw' is the first phase after setup
      } else {
        nextPhase = "Setup";
      }
    } else {
      // Existing logic for normal game phases
      const currentPhaseIndex = phaseOrder.indexOf(
        gameState?.gameState?.currentPhase ?? phaseOrder[0]
      );
      const nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
      nextPhase = phaseOrder[nextPhaseIndex];

      // Move to next player if the phase has wrapped around
      if (nextPhase === phaseOrder[0]) {
        const currentPlayerIndex = gameState?.gameState.turnOrder.findIndex(
          (player) => player === gameState.gameState.currentPlayerTurn
        );
        const nextPlayerIndex =
          (currentPlayerIndex + 1) % gameState.gameState.turnOrder.length;
        nextPlayerTurn = gameState?.gameState.turnOrder[nextPlayerIndex];
      } else {
        nextPlayerTurn = gameState?.gameState.currentPlayerTurn;
      }
    }

    // Update the game state
    const newState = {
      gameState: {
        ...gameState.gameState,
        currentPhase: nextPhase,
        currentPlayerTurn: nextPlayerTurn,
      },
    };

    emitGameStateUpdate(newState);
  };
  // Draw phase
  useEffect(() => {
    if(currentPlayer?.username === currentPlayerTurn){
      if (
        gameState?.gameState.currentPhase === "Draw" 
      ) {
        // setDrawPhase(<DrawPhase currentPlayer={currentPlayer}/>)
        console.log(currentPlayerTurn);
      }
    }
   
  }, [gameState]);

  return (
    <>
      <h4 className="pageHeader">Player Turn: {currentPlayerTurn}</h4>
      <h4 className="pageHeader">
        Game Phase: {gameState?.gameState.currentPhase}
      </h4>
      {gamePhaseButton}
      {drawPhase}
    </>
  );
};

export default GameTurnManager;
