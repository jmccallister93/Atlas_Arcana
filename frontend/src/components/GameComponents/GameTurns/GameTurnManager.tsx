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
  // const [players, setPlayers] = useState<PlayerInfo[]>(gameState.players);
  const currentPlayer = gameState.players.find(
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
  }, [currentPlayerTurn, gameState.players]);
  //@@@@@@@@@Above is what is causing to re-render on gameState.players@@@@@@@@@

  // Function to advance to the next phase and/or player turn
  const advancePhase = () => {
    if (!currentPlayer) {
      console.error("Current player is undefined");
      return;
    }
  
    if (currentPlayer.strongHold === undefined) {
      setShowStrongholdAlert(true);
      return;
    }
  
    const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
    let nextPhaseIndex = currentPhaseIndex;
    let nextPhase = currentPhase;
    let nextPlayerTurn = currentPlayerTurn;
  
    // Determine if it's the setup phase
    const isSetupPhase = currentPhase === "Setup";
  
    if (isSetupPhase) {
      // Find the index of the current player in the turn order
      const currentPlayerIndex = gameState.gameState.turnOrder.findIndex(
        player => player === currentPlayerTurn
      );
      // Calculate the index of the next player
      const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.gameState.turnOrder.length;
      nextPlayerTurn = gameState.gameState.turnOrder[nextPlayerIndex];
  
      // Check if we've looped back to the first player
      if (nextPlayerIndex === 0) {
        // If so, setup is complete, move to the next phase
        nextPhaseIndex = (nextPhaseIndex + 1) % phaseOrder.length;
        nextPhase = phaseOrder[nextPhaseIndex];
      } else {
        // Otherwise, remain in the setup phase
        nextPhase = "Setup";
      }
    } else {
      // Logic for non-setup phases
      nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
      nextPhase = phaseOrder[nextPhaseIndex];
  
      // Move to the next player if we're back at the first phase
      if (nextPhase === phaseOrder[0]) {
        const currentPlayerIndex = gameState.gameState.turnOrder.findIndex(
          player => player === currentPlayerTurn
        );
        const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.gameState.turnOrder.length;
        nextPlayerTurn = gameState.gameState.turnOrder[nextPlayerIndex];
      }
    }
  
    // Update the game state with the new phase and player turn
    const updatedGameState = {
      ...gameState.gameState,
      currentPhase: nextPhase,
      currentPlayerTurn: nextPlayerTurn
    };
  
    emitGameStateUpdate({ gameState: updatedGameState });
  };
  
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
