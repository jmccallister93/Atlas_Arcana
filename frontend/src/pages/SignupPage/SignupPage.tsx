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
  IonText,
} from "@ionic/react";
import axios from "axios";

const SignupPage: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/players", {
        username: userName,
        email,
        password,
      });
      console.log("User created:", response.data);
      // Redirect user or show success message
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              value={userName}
              onIonInput={(e) => setUserName(e.detail.value!)}
              required
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
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
          <IonItem>
            <IonLabel position="floating">Confirm Password</IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              onIonInput={(e) => {
                setConfirmPassword(e.detail.value!);
              }}
              required
            ></IonInput>
          </IonItem>
          <IonButton type="submit" expand="block" style={{ marginTop: 20 }}>
            Signup
          </IonButton>
          {errorMessage && (
            <IonText
              color="danger"
              style={{ display: "block", textAlign: "center" }}
            >
              {errorMessage}
            </IonText>
          )}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default SignupPage;
