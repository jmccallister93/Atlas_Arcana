import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
} from "@ionic/react";
import gps from "../GlobalPageStyles.module.scss";
import { useEffect, useState } from "react";
import socket from "../../context/SocketClient/socketClient";
import { useLocation } from "react-router";

// Define the expected structure of the location state
interface LocationState {
  sessionId: string;
}

const MultiPlayerGamePage = () => {
  const [gameState, setGameState] = useState(/* initial game state */);
  const location = useLocation();
  const state = location.state as LocationState; // Type assertion
  const sessionId = state.sessionId;

  useEffect(() => {
    // Join the game session
    socket.emit("joinGame", { sessionId });
    console.log("SessionId from MultiPlayerGame: " + sessionId)
    // Listen for game state updates
    socket.on("gameStateUpdate", (newState) => {
      setGameState(newState);
    });

    return () => {
      // Leave game session and clean up on component unmount
      socket.emit("leaveGame", { sessionId });
      socket.off("gameStateUpdate");
    };
  }, [sessionId]);

  // Render your game UI based on gameState
  return (
    <IonPage>
      <IonContent>
        <div className={gps.topMargin}></div>
        <h1>Game Page</h1>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome to the game.</IonCardTitle>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default MultiPlayerGamePage;
