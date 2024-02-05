import React, { useState, useEffect } from "react";
import { IonIcon, ReactComponentOrElement, IonAlert } from "@ionic/react";
import { arrowForwardCircleOutline } from "ionicons/icons";
import { GameSessionInfo, PlayerInfo, StrongholdPosition } from "../Interfaces";
import DrawPhase from "./DrawPhase/DrawPhase";
import TradePhase from "./TradePhase/TradePhase";
import RestPhase from "./RestPhase/RestPhase";
import MapPhase from "./MapPhase/MapPhase";
import CombatPhase from "./CombatPhase";
import TitanPhase from "./TitanPhase";
import socket from "../../../context/SocketClient/socketClient";
import { useGameContext } from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

interface GameTurnManagerProps {}

const GameTurnManager: React.FC<GameTurnManagerProps> = ({}) => {
  // Get Game state
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  // Player info
  // const [players, setPlayers] = useState<PlayerInfo[]>(gameState.players);
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  // States that were being passed
  const turnOrder = gameState.turnOrder;
  const currentPhase = gameState.currentPhase;
  const currentPlayerTurn = gameState.currentPlayerTurn;

  const [gamePhaseButton, setGamePhaseButton] = useState<JSX.Element | null>();
  const phaseOrder = ["Draw", "Trade", "Map", "Combat", "Titan"];
  const [phaseAction, setPhaseAction] =
    useState<ReactComponentOrElement | null>();
  const [showStrongholdAlert, setShowStrongholdAlert] = useState(false);

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

  // Example function to check if all strongholds are placed
  const areAllStrongholdsPlaced = () => {
    return gameState.players.every((player) =>
      gameState.strongholdPositions.some(
        (stronghold) => stronghold.playerUsername === player.username
      )
    );
  };


  const hasCurrentPlayerPlacedStronghold = () => {
    return gameState.strongholdPositions.some(
      (stronghold) => stronghold.playerUsername === currentPlayer?.username
    );
  };

  // Function to advance to the next phase and/or player turn
  const advancePhase = () => {
    if (!currentPlayer) {
      console.error("Current player is undefined");
      return;
    }

    // Check if Setup Phase is active
    const isSetupPhase = gameState.setupPhase;

    if (isSetupPhase) {
      if (!hasCurrentPlayerPlacedStronghold()) {
        setShowStrongholdAlert(true);
        return;
      }

      // Logic to handle Setup Phase
      const currentPlayerIndex = turnOrder.findIndex(
        (player) => player === currentPlayerTurn
      );

      const nextPlayerIndex = (currentPlayerIndex + 1) % turnOrder.length;

      const nextPlayerTurn = turnOrder[nextPlayerIndex];
  

      if (nextPlayerIndex === 0) {
        // Check if all strongholds are placed
        if (areAllStrongholdsPlaced()) {
          gameState.setupPhase = false; // End setup phase
          gameState.currentPhase = phaseOrder[0]; // Start with the first phase
          gameState.currentPlayerTurn = turnOrder[0]; // Reset to the first player in turn order
        }
      } else {
        gameState.currentPlayerTurn = nextPlayerTurn; // Move to the next player in setup
      }
    } else {
      // Logic for non-setup phases
      const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
      let nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
      let nextPhase = phaseOrder[nextPhaseIndex];
      let nextPlayerTurn = currentPlayerTurn;

      // Move to the next player if we're back at the first phase
      if (nextPhase === phaseOrder[0]) {
        const currentPlayerIndex = turnOrder.findIndex(
          (player) => player === currentPlayerTurn
        );
        const nextPlayerIndex = (currentPlayerIndex + 1) % turnOrder.length;
        nextPlayerTurn = turnOrder[nextPlayerIndex];

        // Check if a full cycle is completed
        if (
          nextPlayerIndex === 0 &&
          currentPhaseIndex === phaseOrder.length - 1
        ) {
          // Increment turnsCompleted by 1
          gameState.turnsCompleted += 1;
        }
      }

      gameState.currentPhase = nextPhase;
      gameState.currentPlayerTurn = nextPlayerTurn;
    }

    // Update the game state with the new phase and player turn
    emitGameStateUpdate(gameState);
  };

  // Switch Case phase
  useEffect(() => {
    if (currentPlayerTurn === currentPlayer?.username) {
      switch (currentPhase) {
        case "Draw":
          setPhaseAction(<DrawPhase />);
          break;
        case "Trade":
          setPhaseAction(<TradePhase />);
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
  }, [currentPlayerTurn, currentPlayer]);

  return (
    <>
      <h4 className="pageHeader">Player Turn: {currentPlayerTurn}</h4>
      <h4 className="pageHeader">Game Phase: {currentPhase}</h4>
      {gamePhaseButton}
      {currentPlayerTurn === currentPlayer?.username ? (
        <>{phaseAction}</>
      ) : (
        <></>
      )}
      <h4 className="pageHeader">Turn Number: {gameState.turnsCompleted}</h4>

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
