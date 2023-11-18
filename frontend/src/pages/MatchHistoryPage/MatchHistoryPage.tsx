import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
} from "@ionic/react";
import gps from "../GlobalPageStyles.module.scss";
import { useState } from "react";

const MatchHistoryPage: React.FC = () => {
  const [wins, setWins] = useState()
  return (
    <IonPage>
      <IonContent>
        <div className={gps.topMargin}></div>
        <h1>Match History</h1>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Wins {wins}</IonCardTitle>
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

export default MatchHistoryPage;
