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
    IonText
  } from '@ionic/react';
  
  const LoginPage: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput type="email" required></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password" required></IonInput>
          </IonItem>
          <IonButton expand="block" style={{ marginTop: 20 }}>Login</IonButton>
          <IonText style={{ display: 'block', textAlign: 'center', marginTop: 20 }}>
            <p>
              Don't have an account? <a href="/signup">Signup here!</a>
            </p>
            <p>
              <a href="/forgot-password">Forgot Password?</a>
            </p>
          </IonText>
        </IonContent>
        
      </IonPage>
    );
  };
  
  export default LoginPage;
  