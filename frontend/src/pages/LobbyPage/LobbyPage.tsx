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

const LobbyPage = () => {
  // Dummy data for players online, you can replace it with real data from your backend
  const playersOnline = 123;

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
                  {playersOnline} players are currently online.
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
