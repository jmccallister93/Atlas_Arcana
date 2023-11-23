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

import GameBoard from "../../components/GameComponents/GameBoard";
import "./MultiPlayerGamePage.scss";
import { addCircleOutline, arrowForwardCircleOutline } from "ionicons/icons";
import WelcomeModal from "../../components/GameComponents/WelcomeModal";
import {
  LocationState,
  PlayerInfo,
  GameSessionInfo,
  GameState,
  EquipmentItem
} from "../../components/GameComponents/Interfaces";
import PlayerMenu from "../../components/GameComponents/PlayerMenu";
import { useAuth } from "../../context/AuthContext/AuthContext";

const MultiPlayerGamePage = () => {
  // Game State
  const [gameState, setGameState] = useState<GameSessionInfo>();
  const location = useLocation<LocationState>();
  const { gameSessionInfo, sessionId } = location.state;
  // Player State
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  // Show Welcome Modal
  const [showModal, setShowModal] = useState<boolean>(true);
  // Player Menu
  const [isPlayerMenuOpen, setIsPlayerMenuOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>();
  const auth = useAuth();
  // Set the current player based on authxontext
  const currentPlayer = players.find(player => player.username === auth.username);
  const [currentPlayerData, setCurrentPlayerData] = useState<PlayerInfo[]>([]);

  // Join the game session
  useEffect(() => {
    socket.emit("joinGame", { sessionId });
  }, [sessionId]);

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
    players
  }, [gameState])

  // Example function to update a part of the game state
  const updateGame = (newData: any) => {
    // Update the local game state
    setGameState((prevState) => ({
      ...prevState,
      ...newData,
    }));

    // Prepare data to send to the backend
    const updatedState = {
      sessionId: gameState?.sessionId,
      newState: newData,
    };
    console.log("Multiplayer  updatedState from updateGame: ", updatedState);
    // Emit the updated state to the server
    socket.emit("updateGameState", updatedState);
  };

  // Open and close playermenu
  const togglePlayerMenu = () => {
    console.log(currentPlayer)
    setIsPlayerMenuOpen(!isPlayerMenuOpen);
  };
 
const updatePlayerData = (updatedPlayer: PlayerInfo) => {
  // Define updatedPlayers outside of the setGameState call
  let updatedPlayers: PlayerInfo[] = [];

  console.log("From multi player page updatedPlayer: ", updatedPlayer)
  
  setGameState((prevState) => {
    if (!prevState) {
      console.log("From multi player page gamestate undefined.")
      return prevState;
    }

    const updatedPlayers = prevState.players.map(player =>
      player.username === updatedPlayer.username ? updatedPlayer : player
    );
    console.log("From multi player page updatedPlayers: ", updatedPlayers)

    return {
      ...prevState,
      players: updatedPlayers,
      // Other properties of GameSessionInfo remain unchanged
      sessionId: prevState.sessionId,
      gameState: prevState.gameState,
    };
  });

  // Emit the updated state to the server
  if (gameState) {
    const updatedState = {
      sessionId: gameState.sessionId,
      newState: {
        ...gameState,
        players: updatedPlayers,
      },
    };
    socket.emit("updateGameState", updatedState);
  }
};


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
            <IonIcon
              icon={addCircleOutline}
              size="large"
              color="success"
            />
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
        <h4 className="pageHeader">Player Turn: </h4>
        <h4 className="pageHeader">Game Phase: </h4>
        <h4 className="pageHeader">Turn Number: </h4>
        <h4 className="pageHeader">VP Counts: </h4>
        <h4 className="pageHeader">Timer: </h4>
        <div className="gameBoardContainer">
          {" "}
          <GameBoard />
        </div>
        <h4 className="pageHeader">
          Next Phase{" "}
          <IonIcon
            icon={arrowForwardCircleOutline}
            size="large"
            color="success"
            // onClick={toggleMenu}
          />
        </h4>
      </IonContent>
    </IonPage>
  );
};

export default MultiPlayerGamePage;
