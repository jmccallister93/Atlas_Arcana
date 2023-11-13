import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonHeader,
} from "@ionic/react";
import {
  peopleOutline,
  listOutline,
  trophyOutline,
  gameControllerOutline,
} from "ionicons/icons";
import "./DashBoardPage.scss";
import gps from "../GlobalPageStyles.module.scss";

const DashBoardPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen={true} className={`ion-padding`}>
        <div className={gps.topMargin}></div>
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-tiles">
          <IonCard button routerLink="/lobby">
            <IonCardHeader>
              <IonCardTitle>
                {" "}
                <IonIcon
                  icon={gameControllerOutline}
                  size="large"
                  color="primary"
                />{" "}
                Find Game
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>

          <IonCard button>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={peopleOutline} size="large" color="secondary" />
                {" "}Friends List
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>

          <IonCard button>
            <IonCardHeader>
              <IonCardTitle>
                {" "}
                <IonIcon
                  icon={trophyOutline}
                  size="large"
                  color="warning"
                />{" "}
                Match History
              </IonCardTitle>
              <IonCardSubtitle>Wins/Losses/Games Played</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>

          <IonCard button>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={listOutline} size="large" color="tertiary" />{" "}
                Player Statistics
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>

          {/* Add more tiles as needed */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashBoardPage;
