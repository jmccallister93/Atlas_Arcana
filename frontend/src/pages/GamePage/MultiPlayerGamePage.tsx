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
  TitanInfo,
} from "../../components/GameComponents/Interfaces";
import PlayerMenu from "../../components/GameComponents/PlayerMenu/PlayerMenu";
import { useAuth } from "../../context/AuthContext/AuthContext";
import GameTurnManager from "../../components/GameComponents/GameTurns/GameTurnManager";
import PlayersInGame from "../../components/GameComponents/GameBar/PlayersInGame";

const MultiPlayerGamePage = () => {
  // Must have variables
  const location = useLocation<LocationState>();
  const { gameSessionInfo } = location.state;
  const [gameState, setGameState] = useState<GameSessionInfo>(gameSessionInfo);
  const auth = useAuth();

  // Immutable Variables
  const sessionId = gameState.sessionId;
  const turnOrder = gameState.gameState.turnOrder;
  const tileGrid = gameState.gameState.tileGrid;

  //  Changing Variables
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<string>();
  const [currentPhase, setCurrentPhase] = useState<string>();
  const [turnsCompleted, setTurnsCompleted] = useState<number>();
  const [titans, setTitans] = useState<TitanInfo[]>();
  const [equipmentCardCount, setEquipmentCardCount] = useState<[]>();
  const [questCardCount, setQuestCardCount] = useState<[]>();
  const [treasureCardCount, setTreasureCardCount] = useState<[]>();
  const [worldEventCardCount, setWorldEventCardCount] = useState<[]>();

  // Show Welcome Modal
  const [showModal, setShowModal] = useState<boolean>(true);
  
  // Player Menu
  const [isPlayerMenuOpen, setIsPlayerMenuOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>();

  // Has setup completed?
  const [hasSetupCompleted, setHasSetupCompleted] = useState(false);
  
  // Set the current player based on authxontext
  const currentPlayer = players.find(
    (player) => player.username === auth.username
  );

  // SET LOCAL STATES
  // Set local gamestates
  useEffect(() => {
    setGameState(gameSessionInfo);
  }, []);
  // Set local players State
  useEffect(() => {
    if (gameState.players) {
      setPlayers(gameState.players);
    }
  }, [gameState.players]);
  // Set Player turn
  useEffect(() => {
    if (gameState.gameState.currentPlayerTurn) {
      setCurrentPlayerTurn(gameState.gameState.currentPlayerTurn);
    }
  }, [gameState.gameState.currentPlayerTurn]);
  // Set Current Phase
  useEffect(() => {
    if (gameSessionInfo.gameState.currentPhase) {
      setCurrentPhase(gameState.gameState.currentPhase);
    }
  }, [gameState.gameState.currentPhase]);
  // Set Current Player Turn
  useEffect(() => {
    if (gameSessionInfo.gameState.currentPlayerTurn) {
      setCurrentPlayerTurn(gameState.gameState.currentPlayerTurn);
    }
  }, []);
  // Set Turns Completed
  useEffect(() => {
    if (gameSessionInfo?.gameState.turnsCompleted) {
      setTurnsCompleted(gameState.gameState.turnsCompleted);
    }
  }, []);

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

  // Is setup completed?
  useEffect(() => {
    if (gameState?.gameState.currentPhase) {
      if (gameState?.gameState.currentPhase === "Setup") {
        setHasSetupCompleted(false);
      } else {
        setHasSetupCompleted(true);
      }
    }
  }, [gameState.gameState.currentPhase]);
  //Set current game phase
  useEffect(() => {
    if (gameState?.gameState.currentPhase) {
      setCurrentPhase(gameState?.gameState.currentPhase);
    }
    if (gameState?.gameState.currentPlayerTurn) {
      setCurrentPlayerTurn(gameState?.gameState.currentPlayerTurn ?? null);
    }
  }, [gameState.gameState.currentPhase]);

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

  return (
    <IonPage>
      {/* Welcome Modal */}
      {/* <WelcomeModal
        gameState={gameState}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      /> */}

      {/* Player Menu */}
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

        {/* Title */}
        <h1 className="pageHeader">Multiplayer Game</h1>

        {/* Players in Game */}
        <PlayersInGame
          playerNames={gameState.players.map((player) => player.username)}
        />

        {/* Turn Manager */}
        <GameTurnManager
          gameState={gameState}
          players={players}
          emitGameStateUpdate={emitGameStateUpdate}
          currentPlayer={currentPlayer}
        />

        {/* Turn Count */}
        <h4 className="pageHeader">Turn Number: </h4>

        {/* VP Count */}
        <h4 className="pageHeader">VP Counts: </h4>

        {/* GameTimers */}
        <h4 className="pageHeader">Timer: </h4>

        {/* GameBoard */}
        <div className="gameBoardContainer">
          <GameBoard
            hasSetupCompleted={hasSetupCompleted}
            currentPlayerTurn={gameState?.gameState.currentPlayerTurn}
            currentPlayer={currentPlayer}
            tileGrid={gameState?.gameState.tileGrid}
            titans={gameState?.gameState.titans}
            players={gameState?.players}
            emitGameStateUpdate={emitGameStateUpdate}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MultiPlayerGamePage;
