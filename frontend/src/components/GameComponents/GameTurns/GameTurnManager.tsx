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
import socket from "../../../context/SocketClient/socketClient";
import { useGameContext } from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";

interface GameTurnManagerProps {}

const GameTurnManager: React.FC<GameTurnManagerProps> = ({}) => {
  // Get Game state
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  // Player info
  const [players, setPlayers] = useState<PlayerInfo[]>(gameState.players);
  const currentPlayer = players.find(
    (player) => player.username === auth.username
  );
  // States that were being passed
  const turnOrder = gameState.gameState.turnOrder;
  const currentPhase = gameState.gameState.currentPhase;
  const currentPlayerTurn = gameState.gameState.currentPlayerTurn;

  const [gamePhaseButton, setGamePhaseButton] = useState<JSX.Element | null>();
  const phaseOrder = ["Draw", "Trade", "Rest", "Map", "Combat", "Titan"];
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
  }, [currentPlayerTurn]);

  // Socket emit for current player turn
  const emitCurrentPlayerTurnUpdate = (
    newCurrentPlayerTurn: string,
    sessionId: string
  ) => {
    const partialUpdate = {
      currentPlayerTurn: newCurrentPlayerTurn,
    };

    socket.emit("updateCurrentPlayerTurn", sessionId, partialUpdate);
  };

  // Socket emit for current phase
  const emitCurrentPhaseUpdate = (
    newCurrentPhase: string,
    sessionId: string
  ) => {
    const partialUpdate = {
      currentPhase: newCurrentPhase,
    };

    socket.emit("updateCurrentPhase", sessionId, partialUpdate);
  };

  // Phase order
  //Advance PHase
  const advancePhase = () => {
    if (!currentPlayer) {
      console.error("Current player is undefined");
      return;
    }
    if (currentPlayer.strongHold === undefined) {
      setShowStrongholdAlert(true);
      return;
    }
    const isSetupPhase = currentPhase === "Setup";
    let nextPhase, nextPlayerTurn;

    if (isSetupPhase) {
      // Find the next player who needs to complete the setup phase
      const currentPlayerIndex = turnOrder.findIndex(
        (player) => player === currentPlayerTurn
      );

      const nextPlayerIndex = (currentPlayerIndex + 1) % turnOrder.length;
      nextPlayerTurn = turnOrder[nextPlayerIndex];

      // If we have looped back to the first player, setup is complete
      if (nextPlayerIndex === 0) {
        nextPhase = phaseOrder[0]; // Assuming 'Draw' is the first phase after setup
      } else {
        nextPhase = "Setup";
      }
    } else {
      // Existing logic for normal game phases
      const currentPhaseIndex = phaseOrder.indexOf(
        currentPhase ?? phaseOrder[0]
      );
      const nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
      nextPhase = phaseOrder[nextPhaseIndex];

      // Move to next player if the phase has wrapped around
      if (nextPhase === phaseOrder[0]) {
        const currentPlayerIndex = turnOrder.findIndex(
          (player) => player === currentPlayerTurn
        );
        const nextPlayerIndex = (currentPlayerIndex + 1) % turnOrder.length;
        nextPlayerTurn = turnOrder[nextPlayerIndex];
      } else {
        nextPlayerTurn = currentPlayerTurn;
      }
    }

    emitCurrentPlayerTurnUpdate(gameState.sessionId, nextPlayerTurn);
    emitCurrentPhaseUpdate(gameState.sessionId, nextPhase);
  };
  // Switch Case phase
  // useEffect(() => {
  //   if (currentPlayerTurn === currentPlayer?.username) {

  //     switch (currentPhase) {
  //       case "Draw":
  //         setPhaseAction(
  //           <DrawPhase
  //             currentPhase = {currentPhase}
  //             players={players}
  //             emitGameStateUpdate={emitGameStateUpdate}
  //             currentPlayer={currentPlayer}
  //           />
  //         );
  //         break;
  //       case "Trade":
  //         setPhaseAction(
  //           <TradePhase
  //             currentPhase = {currentPhase}
  //             players={players}
  //             emitGameStateUpdate={emitGameStateUpdate}
  //             currentPlayer={currentPlayer}
  //           />
  //         );
  //         break;
  //       case "Rest":
  //         setPhaseAction(
  //           <RestPhase
  //             currentPhase = {currentPhase}
  //             players={players}
  //             emitGameStateUpdate={emitGameStateUpdate}
  //             currentPlayer={currentPlayer}
  //           />
  //         );
  //         break;
  //       case "Map":
  //         setPhaseAction(
  //           <MapPhase
  //             currentPhase = {currentPhase}
  //             players={players}
  //             emitGameStateUpdate={emitGameStateUpdate}
  //             currentPlayer={currentPlayer}
  //           />
  //         );
  //         break;
  //       case "Combat":
  //         setPhaseAction(
  //           <CombatPhase
  //             currentPhase = {currentPhase}
  //             players={players}
  //             emitGameStateUpdate={emitGameStateUpdate}
  //             currentPlayer={currentPlayer}
  //           />
  //         );
  //         break;
  //       case "Titan":
  //         setPhaseAction(
  //           <TitanPhase
  //             currentPhase = {currentPhase}
  //             players={players}
  //             emitGameStateUpdate={emitGameStateUpdate}
  //             currentPlayer={currentPlayer}
  //           />
  //         );
  //         break;
  //       default:
  //         // Optional: handle any case where currentPhase doesn't match any of the cases
  //         break;
  //     }
  //   } else {
  //     setPhaseAction(null);
  //   }
  // }, [ currentPlayerTurn, currentPlayer]);

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

const areEqual = (prevProps: any, nextProps: any) => {
  if (prevProps.playerNames !== nextProps.playerNames) {
    return false;
  }
  if (prevProps.currentPlayerTurn !== nextProps.currentPlayerTurn) {
    return false;
  }
  if (prevProps.currentPhase !== nextProps.currentPhase) {
    return false;
  }
  if (prevProps.turnOrder !== nextProps.turnOrder) {
    return false;
  }
  if (prevProps.currentPlayer !== nextProps.currentPlayer) {
    return false;
  }

  return true; // Props are equal, don't re-render
};

export default React.memo(GameTurnManager, areEqual);
