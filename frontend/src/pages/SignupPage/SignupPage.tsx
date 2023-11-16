import React, { useEffect, useState } from "react";
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
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext/AuthContext";

const SignupPage: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successfulSignup, setSuccessfulSignup] = useState(false);
  const { isLoggedIn, login, username } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      // Redirect to home after a short delay
      setErrorMessage("")
      setTimeout(() => history.push("/dashboard"), 3000);
    }
  }, [isLoggedIn, history]);

  // Submit registration
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/register", {
        username: userName,
        email,
        password,
      });
      
      if (response.data && response.data.token) {  
        login(userName, response.data.token, response.data._id);
        setSuccessfulSignup(true);
        setTimeout(() => history.push("/dashboard"), 3000);
      } else {
        throw new Error("Signup successful, but missing login data.");
      }
    } catch (error: any) {
      console.log(error.response)
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      setErrorMessage(errorMessage);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      {successfulSignup ? (
        <IonContent>
          <h2>Success! Welcome {username}, redirecting...</h2>
        </IonContent>
      ) : (
        <>
          {" "}
          <IonContent className="ion-padding">
            <form onSubmit={handleSubmit}>
              <IonItem>
                <IonLabel position="floating">User Name</IonLabel>
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
          </IonContent>{" "}
        </>
      )}
    </IonPage>
  );
};

export default SignupPage;
