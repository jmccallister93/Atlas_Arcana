import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
} from "@ionic/react";
// import {
//   addCircleIcon
// } from "ionicons/icons";
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

import GameSocket from "../../components/GameComponents/GameSocket";

const MultiPlayerGamePage = () => {
  const [gameState, setGameState] = useState<GameSessionInfo>();
  const location = useLocation<LocationState>();
  const { gameSessionInfo, sessionId } = location.state;
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [modalMessage, setModalMessage] = useState<string>(
    "Welcome to the game"
  );
  useEffect(() => {
    const sequence = [
      { message: "Welcome to the game", delay: 2000 },
      { message: "Rolling for turn order", delay: 2000 },
      { message: "Drawing cards", delay: 2000 },
    ];

    sequence
      .reduce((promise, item) => {
        return promise.then(() => {
          return new Promise<void>((resolve) => {
            setModalMessage(item.message);
            setTimeout(() => {
              resolve();
            }, item.delay);
          });
        });
      }, Promise.resolve())
      .then(() => {
        setShowModal(false);
      });
  }, []);

  const handleGameStateUpdate = (newGameState: GameSessionInfo) => {
    setGameState(newGameState);
  };

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


  // Set local players State
  //  useEffect(() => {
  //   if (gameState && gameState.players) {
  //     const playerInfos = gameState.players.map(username => {
  //       // Assuming you have a way to get or derive the full PlayerInfo from the username
  //       const playerInfo = getPlayerInfoByUsername(username); // This is a hypothetical function
  //       return playerInfo;
  //     });
  //     setPlayers(playerInfos);
  //   }
  // }, [gameState]);

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

    // Emit the updated state to the server
    socket.emit("updateGameState", updatedState);
  };

  const toggleMenu = () => {};

  useEffect(() => {
    console.log(gameSessionInfo);
  }, [gameState, sessionId]);

  return (
    <IonPage>
      {sessionId && (
        <GameSocket
          sessionId={sessionId}
          gameState={gameState}
          setGameState={setGameState}
          onGameStateUpdate={handleGameStateUpdate}
        />
      )}
      <WelcomeModal
        isOpen={showModal}
        message={modalMessage}
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
