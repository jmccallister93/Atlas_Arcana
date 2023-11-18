import {
  IonButton,
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
  sessionId?: string;
}

interface GameState {
  testState: boolean;
}

const MultiPlayerGamePage = () => {
  const [gameState, setGameState] = useState<GameState>({ testState: false });
  const location = useLocation();
  const state = location.state as LocationState; // Type assertion
  const sessionId = state?.sessionId;

  useEffect(() => {
    // Join the game session
    socket.emit("joinGame", { sessionId });
    console.log("SessionId from MultiPlayerGame: " + sessionId);
    console.log("Initial GameState:", gameState);
    // Listen for game state updates
    const handleGameStateUpdate = (newGameState: GameState) => {
      console.log("Received GameState Update:", newGameState);
      setGameState(newGameState);
    };

    socket.on("updateGameState", handleGameStateUpdate);

    return () => {
      // Cleanup
      socket.off("updateGameState", handleGameStateUpdate);
    };
  }, [sessionId]);

  const sendTestUpdate = () => {
    const newTestState = !gameState.testState;
    setGameState({ testState: newTestState }); // Update local state

    // Emit the updated state to the server
    socket.emit("updateGameState", {
      sessionId,
      newState: { testState: newTestState },
    });
  };

  return (
    <IonPage>
      <IonContent>
        <div className={gps.topMargin}></div>
        <h1>Game Page</h1>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Welcome to the game. Test State:{" "}
              {gameState.testState ? "True" : "False"}
            </IonCardTitle>
            <IonButton onClick={sendTestUpdate}>Test me</IonButton>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default MultiPlayerGamePage;
