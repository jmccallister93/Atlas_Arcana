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
import axios from "../../context/AuthContext/AxiosInterceptor";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useHistory } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoggedIn, login, username } = useAuth();
  const history = useHistory();

   // Redirect to home after a short delay
  useEffect(() => {
    if (isLoggedIn) {
      setErrorMessage("");
      setTimeout(() => history.push("/dashboard"), 3000);
    }
    
  }, [isLoggedIn, history]);

  // Login function
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      const username = response.data.user.username;
      const token = response.data.token;
      const userId = response.data.user._id;
      login(username, token, userId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed";
      setErrorMessage(errorMessage);
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
              <IonRouterLink routerLink="/signup">
                Don't have an account? Sign up here!
              </IonRouterLink>
            </>
          ) : (
            <IonContent>
              <h2>Success! Welcome back {username}, redirecting...</h2>
            </IonContent>
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
