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
}

const MultiPlayerGamePage = () => {
  const [gameState, setGameState] = useState<GameState>({ testState: false });
  const location = useLocation();
  const state = location.state as LocationState; // Type assertion
  const sessionId = state?.sessionId;

  // Join the game session
  useEffect(() => {
    socket.emit("joinGame", { sessionId });
  }, [sessionId]);

  // Listen for game state updates
  useEffect(() => {
    const handleGameStateUpdate = (newGameState: GameState) => {
      setGameState(newGameState);
    };

    socket.on("updateGameState", handleGameStateUpdate);

    return () => {
      // Cleanup
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, [sessionId]);

  // Send the update
  const sendTestUpdate = () => {
    const newTestState = !gameState.testState;

    socket.emit("updateGameState", {
      sessionId,
      newState: { testState: newTestState },
    });
  };

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
        <h4 className="pageHeader">Next Phase  <IonIcon
              icon={arrowForwardCircleOutline}
              size="large"
              color="success"
              onClick={toggleMenu}
            /></h4>
      </IonContent>
    </IonPage>
  );
};

export default MultiPlayerGamePage;
