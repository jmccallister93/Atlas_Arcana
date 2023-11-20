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
import { GameState } from "../../context/GameState/GameState";
import GameBoard from "../../components/GameComponents/GameBoard";
import "./MultiPlayerGamePage.scss";
import { addCircleOutline, arrowForwardCircleOutline } from "ionicons/icons";
import WelcomeModal from "../../components/GameComponents/WelcomeModal";
import {
  LocationState,
  PlayerInfo,
  GameSessionInfo,
} from "../../components/GameComponents/Interfaces";

import GameSocket from "../../components/GameComponents/GameSocket";

const MultiPlayerGamePage = () => {
  const [gameState, setGameState] = useState<GameSessionInfo>();
  const location = useLocation<LocationState>();
  const { gameSessionInfo, sessionId } = location.state;
  const [playerNames, setPlayerNames] = useState<string[]>([]);
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

  // Set local playernames State
  useEffect(() => {
    if (gameState && gameState.players) {
      setPlayerNames(gameState.players);
    }
  }, [gameState]);

  // Send the update
  // const sendTestUpdate = () => {
  //   const newTestState = !gameState.testState;

  //   socket.emit("updateGameState", {
  //     sessionId,
  //     newState: { testState: newTestState },
  //   });
  // };

  const toggleMenu = () => {};

  return (
    <IonPage>
      {sessionId && (
        <GameSocket
          sessionId={sessionId}
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
          {playerNames?.map((name, index) => {
            return (
              <div key={index} className="playerName">
                {name}
              </div>
            );
          })}
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
