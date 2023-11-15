import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonRange,
} from "@ionic/react";
import { chevronForward, chevronDown } from "ionicons/icons";
import gps from "../GlobalPageStyles.module.scss";
import { useState } from "react";

const SettingsPage = () => {
  const [accountSettingsOpen, setAccountSettingsOpen] =
    useState<boolean>(false);
  const [gameSettingsOpen, setGameSettingsOpen] = useState<boolean>(false);
  const [volumeSettingsOpen, setVolumeSettingsOpen] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState(100);
  const [effectsVolume, setEffectsVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(100);
  const handleMasterVolumeChange = (e: any) => setMasterVolume(e.detail.value);
  const handleEffectsVolumeChange = (e: any) =>
    setEffectsVolume(e.detail.value);
  const handleMusicVolumeChange = (e: any) => setMusicVolume(e.detail.value);

  const toggleAccountSettings = () =>
    setAccountSettingsOpen(!accountSettingsOpen);
  const toggleGameSettings = () => setGameSettingsOpen(!gameSettingsOpen);
  const toggleVolumeSettings = () => setVolumeSettingsOpen(!volumeSettingsOpen);

  return (
    <IonPage>
      <IonContent fullscreen={true} className="ion-padding">
        <div className={gps.topMargin}></div>
        <IonHeader>Settings</IonHeader>
        <IonList>
          <IonItem onClick={toggleAccountSettings}>
            Account Settings
            <IonIcon
              icon={accountSettingsOpen ? chevronDown : chevronForward}
            />
          </IonItem>
          {accountSettingsOpen && (
            <IonList>
              <IonItem>Reset Password</IonItem>
              <IonItem>Change Username</IonItem>
              <IonItem>Logout</IonItem>
            </IonList>
          )}

          <IonItem onClick={toggleGameSettings}>
            Game Settings
            <IonIcon icon={gameSettingsOpen ? chevronDown : chevronForward} />
          </IonItem>
          {gameSettingsOpen && <IonList></IonList>}

          <IonItem onClick={toggleVolumeSettings}>
            Volume Settings
            <IonIcon icon={volumeSettingsOpen ? chevronDown : chevronForward} />
          </IonItem>
          {volumeSettingsOpen && (
            <IonList>
              <IonItem>
                Master Volume | {masterVolume}
                <IonRange
                  min={0}
                  max={100}
                  step={1}
                  snaps={true}
                  value={masterVolume}
                  onIonChange={handleMasterVolumeChange}
                />
              </IonItem>
              <IonItem>
                Effects Volume | {effectsVolume}
                <IonRange
                  min={0}
                  max={100}
                  step={1}
                  snaps={true}
                  value={effectsVolume}
                  onIonChange={handleEffectsVolumeChange}
                />
              </IonItem>
              <IonItem>
                Music Volume | {musicVolume}
                <IonRange
                  min={0}
                  max={100}
                  step={1}
                  snaps={true}
                  value={musicVolume}
                  onIonChange={handleMusicVolumeChange}
                />
              </IonItem>
            </IonList>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
