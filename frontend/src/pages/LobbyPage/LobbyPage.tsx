import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonButton,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import gps from "../GlobalPageStyles.module.scss";
import { useEffect, useState } from "react";
import socket from "../../context/SocketClient/socketClient";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useHistory } from "react-router-dom";

interface GameSessionInfo {
  // Define the properties of gameSessionInfo
  // For instance:
  playerId: string;
  opponentId: string;
  // Add other relevant properties
}
interface LeftMatchmakingResponse {
  success: boolean;
}

const LobbyPage = () => {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [searchingForGame, setSearchingForGame] = useState<boolean>(false);
  const [matchFound, setMatchFound] = useState<boolean>(false);
  const { token, isLoggedIn } = useAuth();
  const history = useHistory();

  // Handle online user count
  useEffect(() => {
    // Existing socket setup
    const handleUpdateOnlineUsers = (usersCount: number) => {
      // console.log("Received users count from server:", usersCount);
      setOnlineUsers(usersCount);
    };

    // console.log("Setting up event listener for updateOnlineUsers");
    socket.on("updateOnlineUsers", handleUpdateOnlineUsers);

    return () => {
      // console.log("Cleaning up event listener for updateOnlineUsers");
      socket.off("updateOnlineUsers", handleUpdateOnlineUsers);
    };
  }, []);

  // Join matchmaking
  const joinMatchmaking = async () => {
    setSearchingForGame(true);
    try {
      console.log("Attempting to join matchmaking queue", { userId: token });
      socket.emit("joinMatchmaking", { userId: token });
    } catch (error) {
      console.error("Error joining matchmaking:", error);
    }
  };

  // Leave matchmaking
  const leaveMatchmaking = () => {
    setSearchingForGame(false);
    console.log("Leaving matchmaking queue", { userId: token });
    socket.emit("leaveMatchmaking", { userId: token }); // Emit an event to leave the queue
  };

  // handle left matchmaking update
  useEffect(() => {
    const handleLeftMatchmaking = (data: LeftMatchmakingResponse) => {
      if (data.success) {
        setSearchingForGame(false);
        console.log("Successfully left the matchmaking queue");
      }
    };

    socket.on("leftMatchmaking", handleLeftMatchmaking);

    return () => {
      socket.off("leftMatchmaking", handleLeftMatchmaking);
    };
  }, []);

  // Register player with socketio
  useEffect(() => {
    if (isLoggedIn && token) {
      socket.emit("registerPlayer", token);
    }
  }, [isLoggedIn, token]);

  // Handle match found event
  useEffect(() => {
    const handleMatchFound = (gameSessionInfo: GameSessionInfo) => {
      console.log("Match found! Game session info:", gameSessionInfo);
      setSearchingForGame(false);
      setMatchFound(true);

      // Redirect after a 5-second delay
      setTimeout(() => {
        history.push("/game", { gameSession: gameSessionInfo });
        setMatchFound(false);
      }, 5000);
    };

    socket.on("matchFound", handleMatchFound);

    return () => {
      socket.off("matchFound", handleMatchFound);
    };
  }, [history, socket]);

  return (
    <IonPage>
      {isLoggedIn ? (
        <IonContent fullscreen={true} className="ion-padding">
          <div className={gps.topMargin}></div>
          <h1>Game Lobby</h1>
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-md="6">
                {/* CALL ON SINGLEPLAYER FROM HERE SEPERATE COMPONENET, START GAME */}
                <IonCard button={true} routerLink="/singleplayer">
                  <IonCardHeader>
                    <IonCardTitle>Single Player Game</IonCardTitle>
                    <IonCardSubtitle>Play solo</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Challenge yourself in a single player game.
                    <div style={{ textAlign: "center" }}>
                      <IonButton>Start Game</IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* CALL ON MULTIPLAYER QUE FROM HERE SEPERATE COMPONENET */}
              <IonCol size="12" size-md="6">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Multiplayer Game</IonCardTitle>
                    <IonCardSubtitle>Join a multiplayer battle</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Dive into intense multiplayer action.
                    {searchingForGame ? (
                      <div style={{ textAlign: "center" }}>
                        <IonSpinner name="crescent" />
                        <p>Searching for game...</p>
                        <IonButton onClick={leaveMatchmaking} color="danger">
                          Leave Que
                        </IonButton>
                      </div>
                    ) : matchFound ? ( // Check if match is found
                      <div style={{ textAlign: "center", color: "green" }}>
                        <h2>Match Found!</h2>
                        <p>Joining game...</p>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <IonButton onClick={joinMatchmaking}>
                          Start Search
                        </IonButton>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" size-md="6">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Players Online</IonCardTitle>
                    <IonCardSubtitle>Current online players</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {onlineUsers} players are currently online.
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Add additional tiles here */}
            </IonRow>
          </IonGrid>
        </IonContent>
      ) : (
        <IonContent>
          <div className={gps.topMargin}></div>
          <IonCard button routerLink="/login">
            <IonCardHeader>
              <IonCardTitle>Please Login to continue to Dashboard</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        </IonContent>
      )}
    </IonPage>
  );
};

export default LobbyPage;
