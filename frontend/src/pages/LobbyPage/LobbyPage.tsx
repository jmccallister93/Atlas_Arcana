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
} from "@ionic/react";
import gps from "../GlobalPageStyles.module.scss";
import { useEffect, useState } from "react";
import socket from "../../context/SocketClient/socketClient";
import axios from "axios";

const LobbyPage = () => {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);

  useEffect(() => {
    // Fetch initial online users count
    const fetchOnlineUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/online-users');
        setOnlineUsers(response.data.onlineUsers);
      } catch (error) {
        console.error('Error fetching online users:', error);
      }
    };
  
    fetchOnlineUsers();
  
    // Existing socket setup
    const handleUpdateOnlineUsers = (usersCount: number) => {
      // console.log("Received users count from server:", usersCount);
      setOnlineUsers(usersCount);
    };
  
    // console.log("Setting up event listener for updateOnlineUsers");
    socket.on('updateOnlineUsers', handleUpdateOnlineUsers);
  
    return () => {
      // console.log("Cleaning up event listener for updateOnlineUsers");
      socket.off('updateOnlineUsers', handleUpdateOnlineUsers);
    };
  }, []);
  

  // console.log(onlineUsers);

  return (
    <IonPage>
      <IonContent fullscreen={true} className="ion-padding">
        <div className={gps.topMargin}></div>
        <h1>Game Lobby</h1>
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
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

            <IonCol size="12" size-md="6">
              <IonCard button={true} routerLink="/multiplayer">
                <IonCardHeader>
                  <IonCardTitle>Multiplayer Game</IonCardTitle>
                  <IonCardSubtitle>Join a multiplayer battle</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  Dive into intense multiplayer action.
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
    </IonPage>
  );
};

export default LobbyPage;
