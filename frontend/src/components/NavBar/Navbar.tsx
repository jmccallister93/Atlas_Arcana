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
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import "./Navbar.scss";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const Navbar: React.FC = () => {
  const { isLoggedIn, logout, username } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    // Redirect user to login page
    history.push("/login");
  };

  return (
    <>
    <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-align-items-center">
              {/* Menu Button */}
              <IonCol className="ion-text-left">
                <IonButtons>
                  <IonMenuButton autoHide={false} />
                </IonButtons>
              </IonCol>

              {/* Title - Always centered */}
              <IonCol className="ion-text-center">
                <IonLabel>Atlas Arcana</IonLabel>
              </IonCol>

              {/* Logged in Username */}
              {isLoggedIn && (
                <IonCol className="ion-text-right">
                  <IonLabel>Logged in as {username}</IonLabel>
                </IonCol>
              )}
              {!isLoggedIn && <IonCol ></IonCol>} {/* Placeholder */}
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>

      <IonMenu contentId="mainMenu" side="start" class="navbarMenuContainer">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="usernameDisplay">
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
                <IonLabel>Play Game</IonLabel>
              </IonItem>
              <IonItem button routerLink="/settings">
                <IonLabel>Settings</IonLabel>
              </IonItem>
              {isLoggedIn ? (
                <>
                  {/* <IonItem button routerLink="/account">
                    <IonLabel>Account</IonLabel>
                  </IonItem> */}
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
