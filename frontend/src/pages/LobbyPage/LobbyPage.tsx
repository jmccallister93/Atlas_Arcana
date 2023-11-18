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
} from "@ionic/react";
import gps from "../GlobalPageStyles.module.scss";
import { useEffect, useState } from "react";
import socket from "../../context/SocketClient/socketClient";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useHistory } from 'react-router-dom';


interface GameSessionInfo {
  // Define the properties of gameSessionInfo
  // For instance:
  playerId: string;
  opponentId: string;
  // Add other relevant properties
}

const LobbyPage = () => {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [searchingForGame, setSearchingForGame] = useState<boolean>(false);
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
  // Function to handle leaving the matchmaking queue
  const leaveMatchmaking = () => {
    setSearchingForGame(false);
    console.log("Leaving matchmaking queue", { userId: token });
    socket.emit("leaveMatchmaking", { userId: token }); // Emit an event to leave the queue
  };
  useEffect(() => {
    if (isLoggedIn && token) {
      console.log("Registering player with server", { playerId: token });
      socket.emit('registerPlayer', token);
    }

    // ... other useEffect logic

  }, [isLoggedIn, token]);
// Handle match found event
useEffect(() => {
  const handleMatchFound = (gameSessionInfo: GameSessionInfo) => {
    console.log("Match found! Game session info:", gameSessionInfo);
    setSearchingForGame(false); // Update state to stop showing 'searching for game'

    // Redirect to the game page with the necessary game session info
    history.push('/game', { gameSession: gameSessionInfo });
  };

  socket.on("matchFound", handleMatchFound);

  return () => {
    socket.off("matchFound", handleMatchFound);
  };
}, [history, socket]); // Add history to the dependency array

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
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* CALL ON MULTIPLAYER QUE FROM HERE SEPERATE COMPONENET */}
              <IonCol size="12" size-md="6">
                <IonCard button={true} onClick={joinMatchmaking}>
                  <IonCardHeader>
                    <IonCardTitle>Multiplayer Game</IonCardTitle>
                    <IonCardSubtitle>Join a multiplayer battle</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Dive into intense multiplayer action.
                  </IonCardContent>
                  {searchingForGame ? (
                    <div style={{ textAlign: "center" }}>
                      <IonSpinner name="crescent" />
                      <p>Searching for game...</p>
                      <IonButton onClick={leaveMatchmaking} color="danger">
                        Leave Que
                      </IonButton>
                    </div>
                  ) : null}
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
