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
import { GameState } from "../../context/GameState/GameState";

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
      console.log("Received GameState Update:", newGameState);
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
