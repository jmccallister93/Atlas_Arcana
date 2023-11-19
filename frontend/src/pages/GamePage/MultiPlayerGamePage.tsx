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

// Define the expected structure of the location state
interface LocationState {
  sessionId?: string;
  gameSessionInfo?: GameSessionInfo;
}

interface PlayerInfo {
  id: string;
  rank: number;
  health: number;
  offense: number;
  defense: number;
  // Add other player properties as needed
}

interface GameSessionInfo {
  sessionId: string;
  gameState: { testState: boolean };
  players: PlayerInfo[];
}


const MultiPlayerGamePage = () => {
  const [gameState, setGameState] = useState<GameSessionInfo>();
  const location = useLocation<LocationState>(); // Specify the type here
  const { gameSessionInfo, sessionId } = location.state; // Destructure the properties

  useEffect(() => {
    if (gameSessionInfo) {
      setGameState(gameSessionInfo);
      console.log("Game Session Info:", gameSessionInfo);
    }
  }, [gameSessionInfo]);

  useEffect(() => {
    console.log(gameState)
    if (gameState && gameState.players) {
      gameState.players.forEach(player => {
        console.log("Player:", player);
      });
    }
  }, [gameState]);

  // Join the game session
  useEffect(() => {
    socket.emit("joinGame", { sessionId });
  }, [sessionId]);

  // Listen for game state updates
  useEffect(() => {
    const handleGameStateUpdate = (newGameState: GameSessionInfo) => {
      setGameState(newGameState);
    };

    socket.on("updateGameState", handleGameStateUpdate);

    return () => {
      // Cleanup
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, [sessionId]);

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
