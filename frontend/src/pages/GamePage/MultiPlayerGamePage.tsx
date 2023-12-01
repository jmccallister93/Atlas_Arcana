import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
} from "@ionic/react";
import gps from "../GlobalPageStyles.module.scss";
import { useEffect, useState } from "react";
import socket from "../../context/SocketClient/socketClient";
import { useLocation } from "react-router";

import GameBoard from "../../components/GameComponents/GameBoard/GameBoard";
import "./MultiPlayerGamePage.scss";
import { addCircleOutline, arrowForwardCircleOutline } from "ionicons/icons";
import WelcomeModal from "../../components/GameComponents/WelcomeModal";
import {
  LocationState,
  PlayerInfo,
  GameSessionInfo,
  GameState,
  EquipmentItem,
} from "../../components/GameComponents/Interfaces";
import PlayerMenu from "../../components/GameComponents/PlayerMenu/PlayerMenu";
import { useAuth } from "../../context/AuthContext/AuthContext";
import GameTurnManager from "../../components/GameComponents/GameTurns/GameTurnManager";

const MultiPlayerGamePage = () => {
  // Game State
  const [gameState, setGameState] = useState<GameSessionInfo>();
  const location = useLocation<LocationState>();
  const { gameSessionInfo, sessionId } = location?.state;
  // Player State
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  // Show Welcome Modal
  const [showModal, setShowModal] = useState<boolean>(true);
  // Player Menu
  const [isPlayerMenuOpen, setIsPlayerMenuOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>();
  const auth = useAuth();
  // Set the current player based on authxontext
  const currentPlayer = players.find(
    (player) => player.username === auth.username
  );

  // Join the game session
  useEffect(() => {
    socket.emit("joinGame", { sessionId });
  }, [sessionId]);

  // Centralized function to emit game state updates
  const emitGameStateUpdate = (updatedData: Partial<GameSessionInfo>) => {
    if (gameState) {
      const updatedState = {
        sessionId: gameState.sessionId,
        newState: {
          ...gameState,
          ...updatedData,
        },
      };
      socket.emit("updateGameState", updatedState);
    }
  };

  // Handle game stateupdate
  useEffect(() => {
    const handleGameStateUpdate = (updatedGameState: any) => {
      console.log("Received updated game state:", updatedGameState);

      // Update the entire game state
      setGameState(updatedGameState);

      // Check if the updated game state contains player information and update accordingly
      if (updatedGameState && updatedGameState.players) {
        setPlayers(updatedGameState.players);
      }
    };
    // Register the event listener
    socket.on("updateGameState", handleGameStateUpdate);

    // Clean up the event listener
    return () => {
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, []);

  // Set local gamestate
  useEffect(() => {
    if (gameSessionInfo) {
      setGameState(gameSessionInfo);
    }
  }, [gameSessionInfo]);

  // Set local players State
  useEffect(() => {
    if (gameState && gameState.players) {
      setPlayers(gameState.players);
    }
  }, [gameState]);

  //Display all players Victory Points
  useEffect(() => {
    players;
  }, [gameState]);

  // Open and close playermenu
  const togglePlayerMenu = () => {
    setIsPlayerMenuOpen(!isPlayerMenuOpen);
  };

  // Function to update player data
  const updatePlayerData = (updatedPlayer: PlayerInfo) => {
    setGameState((prevState) => {
      if (!prevState) {
        return prevState;
      }

      const updatedPlayers = prevState.players.map((player) =>
        player.username === updatedPlayer.username ? updatedPlayer : player
      );

      // Update the game state with the new players array
      const newState: GameSessionInfo = {
        ...prevState,
        players: updatedPlayers,
      };

      return newState;
    });

    // Emit updated player data after state update
    if (gameState) {
      emitGameStateUpdate({
        players: gameState.players.map((player) =>
          player.username === updatedPlayer.username ? updatedPlayer : player
        ),
      });
    }
  };

  // Transform the titan positions to the expected format
  // const transformedTitanPositions = gameState?.gameState.titanPosition?.map(
  //   (tp) => ({
  //     titan: tp.titan, // Assuming you want to use the titanName here
  //     row: tp.row,
  //     col: tp.col,
  //   })
  // );

  console.log(gameState?.gameState.titanPosition);
  return (
    <IonPage>
      {/* <WelcomeModal
        gameState={gameState}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      /> */}
      <PlayerMenu
        isOpen={isPlayerMenuOpen}
        onClose={() => setIsPlayerMenuOpen(false)}
        player={currentPlayer}
        gameState={gameState}
        updatePlayerData={updatePlayerData}
      />
      <IonContent>
        {/* Floating player menu */}
        <div className="actionsMenu">
          <button className="actionsIcon" onClick={togglePlayerMenu}>
            <IonIcon icon={addCircleOutline} size="large" color="success" />
          </button>
        </div>
        <h1 className="pageHeader">Multiplayer Game</h1>
        <h4 className="pageHeader">Players in Game:</h4>
        <div className="playerList">
          {players.map((player, index) => (
            <div key={index} className="playerName">
              {player.username} - VP's: {player.victoryPoints}
            </div>
          ))}
        </div>

        <GameTurnManager
          gameState={gameState}
          players={players}
          emitGameStateUpdate={emitGameStateUpdate}
          currentPlayer={currentPlayer}
        />
        <h4 className="pageHeader">Turn Number: </h4>
        <h4 className="pageHeader">VP Counts: </h4>
        <h4 className="pageHeader">Timer: </h4>
        <div className="gameBoardContainer">
          {" "}
          <GameBoard
            tileGrid={gameState?.gameState.tileGrid}
            titanPositions={gameState?.gameState.titanPosition}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MultiPlayerGamePage;
