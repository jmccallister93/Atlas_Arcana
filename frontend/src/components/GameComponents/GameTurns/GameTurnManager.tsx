import React, { useState, useEffect } from "react";
import { IonIcon, ReactComponentOrElement, IonAlert } from "@ionic/react";
import { arrowForwardCircleOutline } from "ionicons/icons";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";
import DrawPhase from "./DrawPhase";
import TradePhase from "./TradePhase";
import RestPhase from "./RestPhase";
import MapPhase from "./MapPhase";
import CombatPhase from "./CombatPhase";
import TitanPhase from "./TitanPhase";

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
  const [phaseAction, setPhaseAction] =
    useState<ReactComponentOrElement | null>();
  const [showStrongholdAlert, setShowStrongholdAlert] = useState(false);

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
    if (!currentPlayer || currentPlayer.strongHold === undefined) {
      setShowStrongholdAlert(true); // Show alert if 'strongHold' is missing
      return; // Prevent further execution
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
    if (currentPlayerTurn === currentPlayer?.username) {
      const currentPhase = gameState?.gameState.currentPhase;
      switch (currentPhase) {
        case "Draw":
          setPhaseAction(<DrawPhase />);
          break;
        case "Trade":
          setPhaseAction(<TradePhase />);
          break;
        case "Rest":
          setPhaseAction(<RestPhase />);
          break;
        case "Map":
          setPhaseAction(<MapPhase />);
          break;
        case "Combat":
          setPhaseAction(<CombatPhase />);
          break;
        case "Titan":
          setPhaseAction(<TitanPhase />);
          break;
        default:
          // Optional: handle any case where currentPhase doesn't match any of the cases
          break;
      }
    } else {
      setPhaseAction(null);
    }
  }, [gameState, currentPlayerTurn, currentPlayer]);

  return (
    <>
      <h4 className="pageHeader">Player Turn: {currentPlayerTurn}</h4>
      <h4 className="pageHeader">
        Game Phase: {gameState?.gameState.currentPhase}
      </h4>
      {gamePhaseButton}
      {currentPlayerTurn === currentPlayer?.username ? (
        <>{phaseAction}</>
      ) : (
        <></>
      )}

      <IonAlert
        isOpen={showStrongholdAlert}
        onDidDismiss={() => setShowStrongholdAlert(false)}
        header={"Action Required"}
        message={"Please place your Stronghold before advancing the turn."}
        buttons={["OK"]}
      />
    </>
  );
};

export default GameTurnManager;
