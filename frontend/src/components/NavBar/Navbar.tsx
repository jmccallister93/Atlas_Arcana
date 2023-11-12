import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonButtons,
  IonMenu,
  IonList,
  IonMenuToggle,
  IonItem,
  IonLabel,
  IonFooter,
} from "@ionic/react";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Atlas Arcana</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton autoHide={false} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonMenu contentId="mainMenu" side="start" class="navbarMenuContainer">
        <IonHeader>
          <IonToolbar>
            <IonTitle >Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonMenuToggle autoHide={false} >
              <IonItem button routerLink="/home">
                <IonLabel>Home</IonLabel>
              </IonItem>
              <IonItem button routerLink="/login">
                <IonLabel>Login | Sign up</IonLabel>
              </IonItem>
              <IonItem button routerLink="/lobby">
                <IonLabel>Lobby</IonLabel>
              </IonItem>
              <IonItem button routerLink="/settings">
                <IonLabel>Settings</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>


    </>
  );
};

export default Navbar;
