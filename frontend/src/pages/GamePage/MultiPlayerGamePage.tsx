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
} from "../../components/GameComponents/Interfaces";

const MultiPlayerGamePage = () => {
  const [gameState, setGameState] = useState<GameSessionInfo>();
  const location = useLocation<LocationState>();
  const { gameSessionInfo, sessionId } = location.state;
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [modalMessages, setModalMessages] = useState<
    { title: string; content: { message: string; delay: number }[] }[]
  >([]);

  // Turn order message
  useEffect(() => {
    // Welcome players
    const players = gameState?.players || [];
    const playerNames = players.map((player) => player.username).join(", ");

    // Map each username in the turnOrder to a message object
    const turnOrder = gameState?.gameState?.turnOrder || [];
    const turnOrderMessages = turnOrder.map((username, index) => ({
      message: username,
      delay: 1000, // This adds a delay between each player's name
    }));

    // Determine starting cards
    const startingCards = gameState?.players || []
    const startingCardsMessage = startingCards.map((player) => player.inventory.equipment).join()

    const messageGroups = [
      {
        title: "Welcome to the game",
        content: [{ message: playerNames, delay: 1000 }],
      },
      {
        title: "Rolling for turn order...",
        content: turnOrderMessages,
      },
      {
        title: "Drawing starting cards...",
        content: [
          { message: startingCardsMessage, delay: 1000 },
          { message: "Card2", delay: 1000 },
          { message: "Card3", delay: 2000 },
        ],
      },
      {
        title: "Let's Play!",
        content: [],
      },
    ];
    setModalMessages(messageGroups);
  }, [gameState]); // Add gameState as a dependency

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

  const toggleMenu = () => {};

  // Function to handle the rank update
  const updatePlayerRank = () => {
    if (gameState && gameState.players && gameState.players.length > 0) {
      const updatedPlayers = gameState.players.map((player, index) => {
        if (index === 0) {
          // Assuming player 1 is at index 0
          return { ...player, rank: 2 };
        }
        return player;
      });

      // Update the gameState with the new players array
      const updatedGameState = { ...gameState, players: updatedPlayers };
      setGameState(updatedGameState);

      // Emit the updated state to the server
      updateGame({ players: updatedPlayers });
    }
  };

  return (
    <IonPage>
      <WelcomeModal
        isOpen={showModal}
        messageGroups={modalMessages}
        onClose={() => setShowModal(false)}
      />
      <IonContent>
        {/* Floating hamburger menu */}
        <div className="actionsMenu">
          <button className="actionsIcon" onClick={toggleMenu}>
            <IonIcon
              icon={addCircleOutline}
              size="large"
              color="success"
              onClick={toggleMenu}
            />
          </button>

          <div className="actionsContent">{/* Menu items go here */}</div>
        </div>
        <h1 className="pageHeader">Multiplayer Game</h1>
        <h4 className="pageHeader">Players in Game:</h4>
        <div className="playerList">
          {players.map((player, index) => (
            <div key={index} className="playerName">
              {player.username} - Rank: {player.rank}, Health: {player.health}
              {/* Display other player details as needed */}
            </div>
          ))}
        </div>
        <IonButton onClick={updatePlayerRank}>Rank up</IonButton>
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
            onClick={toggleMenu}
          />
        </h4>
      </IonContent>
    </IonPage>
  );
};

export default MultiPlayerGamePage;
