import { useEffect, useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../../Interfaces";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import socket from "../../../../context/SocketClient/socketClient";

export interface RestPhaseProps {}

const RestPhase: React.FC<RestPhaseProps> = ({}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  const [showRestWindow, setShowRestWindow] = useState<boolean>(true);
  const [restAccepted, setRestAccepted] = useState<boolean>(false);

  useEffect(() => {
    console.log("fired with pid:")
    socket.emit("restAccepted", {
      sessionId: gameState.sessionId,
      playerId: currentPlayer,
    });
  }, [restAccepted]);


  return (
    <>
      <IonButton onClick={() => setShowRestWindow(true)}>
        Rest Options
      </IonButton>
      <div className="gameturnMenuContainer">
        <IonModal
          isOpen={showRestWindow}
          onDidDismiss={() => setShowRestWindow(false)}
        >
          <div className="modalHeader">
            <h2>Rest Phase</h2>
            <button
              className="closeButton"
              onClick={() => setShowRestWindow(false)}
            >
              <IonIcon icon={closeOutline} />
            </button>
          </div>
          <h2>
            Rest to full health? <br />
            Movement will be reduced to 0 for the turn.
          </h2>
          <IonButton onClick={() => setRestAccepted(true)}>Rest</IonButton>
          <IonButton onClick={() => setShowRestWindow(false)}>Close</IonButton>
        </IonModal>
      </div>
    </>
  );
};

export default RestPhase;
