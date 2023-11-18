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
import MultiPlayerGamePage from "./pages/GamePage/MultiPlayerGamePage";
import LobbyPage from "./pages/LobbyPage/LobbyPage";
import Navbar from "./components/NavBar/Navbar";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import DashBoardPage from "./pages/DashboardPage/DashboardPage";
import AccountPage from "./pages/AccountPage/AccountPage";

import { AuthProvider } from "./context/AuthContext/AuthContext";

import "./global.scss";
import FriendsPage from "./pages/FriendsPage/FriendsPage";

import MatchFoundListener from "./context/MatchFoundListener/MatchFoundListener";
import MatchHistoryPage from "./pages/MatchHistoryPage/MatchHistoryPage";
import SinglePlayerGamePage from "./pages/GamePage/SinglePlayerGamePage";

setupIonicReact();
import io from "socket.io-client";

// Initiate connection to socket server
const socket = io("http://localhost:3001"); 

const App: React.FC = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <Navbar />
        <MatchFoundListener /> {/* Include the listener */}
        <IonRouterOutlet id="mainMenu">
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignupPage} />
          <Route exact path="/resetPassword" component={ResetPasswordPage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/multiGame" component={MultiPlayerGamePage} />
          <Route exact path="/singleGame" component={SinglePlayerGamePage} />
          <Route exact path="/lobby" component={LobbyPage} />
          <Route exact path="/dashboard" component={DashBoardPage} />
          <Route exact path="/account" component={AccountPage} />
          <Route exact path="/friends" component={FriendsPage} />
          <Route exact path="/matchHistory" component={MatchHistoryPage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
);

export default App;