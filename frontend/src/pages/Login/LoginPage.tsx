import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonRouterLink,
} from "@ionic/react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useHistory } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoggedIn, login, username } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      // Redirect to home after a short delay
      setTimeout(() => history.push("/home"), 3000);
    }
  }, [isLoggedIn, history]);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
  
      // Assuming the username is part of the response
      const username = response.data.username;
      login(username);
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Login failed";
      setErrorMessage(errMsg);
    }
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {!isLoggedIn ? (
            <>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="text"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                  required
                ></IonInput>
              </IonItem>
              <IonButton
                expand="block"
                style={{ marginTop: 20 }}
                onClick={handleLogin}
              >
                Login
              </IonButton>
              <IonRouterLink routerLink="/PasswordResetPage">
                Forgot Password?
              </IonRouterLink>
              <br />
              <IonRouterLink routerLink="/SignupPage">
                Don't have an account? Sign up here!
              </IonRouterLink>
            </>
          ) : (
            <div>
              <h2>Welcome {username}, redirecting to Home page...</h2>
            </div>
          )}
          {errorMessage && (
            <IonText
              color="danger"
              style={{ display: "block", textAlign: "center", marginTop: 20 }}
            >
              {errorMessage}
            </IonText>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default LoginPage;
