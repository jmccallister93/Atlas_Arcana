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
  
        <IonMenu contentId="mainMenu" side="start">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonMenuToggle autoHide={false}>
                <IonItem button routerLink="/login">
                  <IonLabel>Login</IonLabel>
                </IonItem>
                <IonItem button routerLink="/signup">
                  <IonLabel>Signup</IonLabel>
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
  