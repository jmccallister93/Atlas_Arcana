import React, { useState, useEffect, useCallback } from "react";
import { IonIcon, ReactComponentOrElement, IonAlert } from "@ionic/react";
import { arrowForwardCircleOutline } from "ionicons/icons";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";
import DrawPhase from "./DrawPhase";
import TradePhase from "./TradePhase";
import RestPhase from "./RestPhase";
import MapPhase from "./MapPhase";
import CombatPhase from "./CombatPhase";
import TitanPhase from "./TitanPhase";
import socket from "../../../context/SocketClient/socketClient";
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import UpdateNotifications from "../GameBar/UpdateNotification";

interface GameTurnManagerProps {

}

const GameTurnManager: React.FC<GameTurnManagerProps> = ({}) => {
  // Get Game state
  const { emitGameStateUpdate } = useGameContext();
  const auth = useAuth();
  const players = useGameStatePart((state) => state.players as PlayerInfo[]);
  const currentPlayer = players.find(
    (player) => player.username === auth.username
  );
  const turnOrder = useGameStatePart((state) => state.turnOrder as string[]);
  const currentPhase = useGameStatePart(
    (state) => state.currentPhase as string
  );
  const currentPlayerTurn = useGameStatePart(
    (state) => state.currentPlayerTurn as string
  );
  const setupPhase = useGameStatePart((state) => state.setupPhase as boolean);
  const turnsCompleted = useGameStatePart(
    (state) => state.turnsCompleted as number
  );
  const [gamePhaseButton, setGamePhaseButton] = useState<JSX.Element | null>();
  const phaseOrder = ["Draw", "Trade", "Rest", "Map", "Combat", "Titan"];
  const [phaseAction, setPhaseAction] =
    useState<ReactComponentOrElement | null>();
  const [showStrongholdAlert, setShowStrongholdAlert] = useState(false);

  // Render advance phase for player who's turn it is
  useEffect(() => {
    console.log("GTM firing");
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
  }, [currentPlayerTurn]);

  // Example function to check if all strongholds are placed
  const areAllStrongholdsPlaced = (players: PlayerInfo[]) => {
    return players.every((player) => player.strongHold !== undefined);
  };

  // Function to advance to the next phase and/or player turn
  const advancePhase = useCallback(() => {
    if (!currentPlayer) {
      console.error("Current player is undefined");
      return;
    }

    if (setupPhase) {
      // Check if current player has not placed a stronghold
      if (currentPlayer.strongHold === undefined) {
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
        if (areAllStrongholdsPlaced(players)) {
          // Create a partial update for the game state
          const gameStateUpdate = {
            setupPhase: false, // End setup phase
            currentPhase: phaseOrder[0], // Start with the first phase
            currentPlayerTurn: turnOrder[0], // Reset to the first player in turn order
          };

          // Emit the partial update
          emitGameStateUpdate(gameStateUpdate);
        }
      } else {
        // Create a partial update for advancing to the next player's turn
        const gameStateUpdate = {
          currentPlayerTurn: nextPlayerTurn, // Move to the next player in setup
        };

        // Emit the partial update
        emitGameStateUpdate(gameStateUpdate);
      }
    } else {
      // Logic for non-setup phases
      const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
      let nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
      let nextPhase = phaseOrder[nextPhaseIndex];
      let nextPlayerTurn = currentPlayerTurn;

      let gameStateUpdate = {
        currentPhase: nextPhase,
        currentPlayerTurn: nextPlayerTurn,
        turnsCompleted,
      };

      // Move to the next player if we're back at the first phase
      if (nextPhase === phaseOrder[0]) {
        const currentPlayerIndex = turnOrder.findIndex(
          (player) => player === currentPlayerTurn
        );
        const nextPlayerIndex = (currentPlayerIndex + 1) % turnOrder.length;
        nextPlayerTurn = turnOrder[nextPlayerIndex];
        gameStateUpdate.currentPlayerTurn = nextPlayerTurn;

        // Check if a full cycle is completed
        if (
          nextPlayerIndex === 0 &&
          currentPhaseIndex === phaseOrder.length - 1
        ) {
          // Increment turnsCompleted by 1
          gameStateUpdate.turnsCompleted = turnsCompleted + 1;
        }
      }

      // Emit the update for the game state
      emitGameStateUpdate(gameStateUpdate);
    }
  }, [
    currentPlayer,
    setupPhase,
    turnOrder,
    currentPhase,
    currentPlayerTurn,
    emitGameStateUpdate,
    players,
    turnsCompleted,
  ]);

  // Switch Case phase
  useEffect(() => {
    // if (currentPlayerTurn === currentPlayer?.username) {
    //   switch (currentPhase) {
    //     case "Draw":
    //       setPhaseAction(
    //         <DrawPhase
    //           currentPhase = {currentPhase}
    //           players={players}
    //           emitGameStateUpdate={emitGameStateUpdate}
    //           currentPlayer={currentPlayer}
    //         />
    //       );
    //       break;
    //     case "Trade":
    //       setPhaseAction(
    //         <TradePhase
    //           currentPhase = {currentPhase}
    //           players={players}
    //           emitGameStateUpdate={emitGameStateUpdate}
    //           currentPlayer={currentPlayer}
    //         />
    //       );
    //       break;
    //     case "Rest":
    //       setPhaseAction(
    //         <RestPhase
    //           currentPhase = {currentPhase}
    //           players={players}
    //           emitGameStateUpdate={emitGameStateUpdate}
    //           currentPlayer={currentPlayer}
    //         />
    //       );
    //       break;
    //     case "Map":
    //       setPhaseAction(
    //         <MapPhase
    //           currentPhase = {currentPhase}
    //           players={players}
    //           emitGameStateUpdate={emitGameStateUpdate}
    //           currentPlayer={currentPlayer}
    //         />
    //       );
    //       break;
    //     case "Combat":
    //       setPhaseAction(
    //         <CombatPhase
    //           currentPhase = {currentPhase}
    //           players={players}
    //           emitGameStateUpdate={emitGameStateUpdate}
    //           currentPlayer={currentPlayer}
    //         />
    //       );
    //       break;
    //     case "Titan":
    //       setPhaseAction(
    //         <TitanPhase
    //           currentPhase = {currentPhase}
    //           players={players}
    //           emitGameStateUpdate={emitGameStateUpdate}
    //           currentPlayer={currentPlayer}
    //         />
    //       );
    //       break;
    //     default:
    //       // Optional: handle any case where currentPhase doesn't match any of the cases
    //       break;
    //   }
    // } else {
    //   setPhaseAction(null);
    // }
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
      <h4 className="pageHeader">Turn Number: {turnsCompleted}</h4>

      <IonAlert
        isOpen={showStrongholdAlert}
        onDidDismiss={() => setShowStrongholdAlert(false)}
        header={"Action Required"}
        message={"Please place your Stronghold before advancing the turn."}
        buttons={["OK"]}
      />

      {/* Update notification */}
      {/* <UpdateNotifications
      message=""
      isOpen={true}
      onDidDismiss={}
      /> */}
    </>
  );
};

export default GameTurnManager;
