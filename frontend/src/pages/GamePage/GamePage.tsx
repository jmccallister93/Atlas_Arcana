import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
} from "@ionic/react";
import gps from "../GlobalPageStyles.module.scss";
import { useState } from "react";

const GamePage = () => {
  return (
    <IonPage>
      <IonContent>
        <div className={gps.topMargin}></div>
        <h1>Game Page</h1>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome to the game. </IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Past Games</IonCardTitle>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default GamePage;
