import { IonContent, IonPage, IonButton, IonText, IonImg } from "@ionic/react";
import "./HomePage.scss";
import gps from "../GlobalPageStyles.module.scss";

import logo from "../../assets/images/AALogo.png";
import Navbar from "../../components/NavBar/Navbar";

import { useAuth } from "../../context/AuthContext/AuthContext";

const HomePage: React.FC = () => {
  const { isLoggedIn, username } = useAuth();

  return (
    <IonPage>
      <IonContent fullscreen={true} className="homepage-content">
        <div className={gps.topMargin}></div>
        <div className="splash-screen">
          {isLoggedIn ? (
            <h1>Welcome {username} to Atlas Arcana</h1>
          ) : (
            <h1>Welcome to Atlas Arcana</h1>
          )}

          <img src={logo} alt="Atlas Arcana Logo" className="logo-img" />
          <p className="game-description">
            Embark on a journey of strategy and adventure in Atlas Arcana, a
            captivating PvP/PvE base builder, deck builder, and turn-based strategy
            game. Whether you're a tactician or a warlord, this game offers a
            unique blend of strategic planning and competitive fun.
          </p>
          <p className="game-modes">
            Choose your path: engage in thrilling single-player campaigns or
            challenge friends and players worldwide in multiplayer battles.
          </p>
          {!isLoggedIn ? (
            <div className="action-buttons">
              <IonButton href="/login" expand="block">
                Login
              </IonButton>
              <IonButton href="/signup" expand="block" fill="outline">
                Sign Up
              </IonButton>
            </div>
          ) : (
            <div className="action-buttons">
              <IonButton href="/dashboard" expand="block">
                Dashboard
              </IonButton>
              <IonButton href="/lobby" expand="block" fill="outline">
                Find Game
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
