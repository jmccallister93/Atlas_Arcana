import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import GamePage from "./pages/GamePage/GamePage";
import LobbyPage from "./pages/LobbyPage/LobbyPage";
import Navbar from "./components/NavBar/Navbar";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import DashBoardPage from "./pages/DashboardPage/DashboardPage";
import AccountPage from "./pages/AccountPage/AccountPage";

import { AuthProvider } from './context/AuthContext/AuthContext'


setupIonicReact();

const App: React.FC = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <Navbar />
        <IonRouterOutlet id="mainMenu">
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/signup">
            <SignupPage />
          </Route>
          <Route exact path="/resetPassword">
            <ResetPasswordPage />
          </Route>
          <Route exact path="/settings">
            <SettingsPage />
          </Route>
          <Route exact path="/game">
            <GamePage />
          </Route>
          <Route exact path="/lobby">
            <LobbyPage />
          </Route>
          <Route exact path="/dashboard">
            <DashBoardPage />
          </Route>
          <Route exact path="/account">
            <AccountPage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
);

export default App;
