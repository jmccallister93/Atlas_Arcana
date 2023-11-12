import React, { useState } from "react";
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
  IonFooter,
  IonText,
} from "@ionic/react";
import axios from "axios";
import { IonRouterLink } from "@ionic/react";

const LoginPage: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        emailOrUsername,
        password,
      });
      console.log("Login successful:", response.data);
      // Handle successful login (e.g., redirect to dashboard, store token)
    } catch (error: any) {
        console.log(error)
      const errorMessage = error.response?.data?.message || "Login failed";
      setErrorMessage(errorMessage);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Email/Username</IonLabel>
          <IonInput
            type="text"
            value={emailOrUsername}
            onIonChange={(e) => setEmailOrUsername(e.detail.value!)}
            required
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
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
        <br/>
        <IonRouterLink routerLink="/SignupPage">
          Don't have an account? Sign up here!
        </IonRouterLink>
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
  );
};

export default LoginPage;
