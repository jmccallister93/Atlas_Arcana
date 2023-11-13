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
  IonBackButton,
} from "@ionic/react";
import "./Navbar.scss";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useHistory } from "react-router";

const Navbar: React.FC = () => {
  const { isLoggedIn, logout, username } = useAuth();
  const history = useHistory(); // If you're using react-router

  const handleLogout = () => {
    logout();
    // Redirect user to login page
    history.push("/login");
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonBackButton defaultHref='/home' color="white"/> 
          </IonButtons>
          <IonTitle>Atlas Arcana</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton autoHide={false} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonMenu contentId="mainMenu" side="start" class="navbarMenuContainer">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="usernameDisplay">
          <h2>{username}</h2>
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem button routerLink="/home">
                <IonLabel>Home</IonLabel>
              </IonItem>
              {isLoggedIn ? (
                <IonItem button routerLink="/dashboard">
                  <IonLabel>Dashboard</IonLabel>
                </IonItem>
              ) : null}
              <IonItem button routerLink="/lobby">
                <IonLabel>Lobby</IonLabel>
              </IonItem>
              <IonItem button routerLink="/settings">
                <IonLabel>Settings</IonLabel>
              </IonItem>
              {isLoggedIn ? (
                <>
                  <IonItem button routerLink="/account">
                    <IonLabel>Account</IonLabel>
                  </IonItem>
                  <IonItem button onClick={handleLogout}>
                    <IonLabel>Logout</IonLabel>
                  </IonItem>
                </>
              ) : (
                <IonItem button routerLink="/login">
                  <IonLabel>Login | Sign up</IonLabel>
                </IonItem>
              )}
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  );
};

export default Navbar;
