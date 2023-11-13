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
import socket from '../../context/SocketClient/socketClient'

const LobbyPage = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    socket.on('updateOnlineUsers', (count: number) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off('updateOnlineUsers');
    };
  }, []);

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
