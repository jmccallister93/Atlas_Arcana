import { useState } from "react";
import { GameSessionInfo, PlayerInfo } from "../../Interfaces";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { useGameContext } from "../../../../context/GameContext/GameContext";
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

export interface MapPhaseProps {}

const MapPhase: React.FC<MapPhaseProps> = ({}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  const [showMapDetails, setShowMapDetails] = useState(true);
  const [moveState, setMoveState] = useState(false);

  const handleMoveClick = () => {
    setShowMapDetails(false);
    setMoveState(true);
  };

  return (
    <>
      <div className="gameturnMenuContainer">
        <IonButton onClick={() => setShowMapDetails(true)}>
          Map Options
        </IonButton>
        <IonModal
          isOpen={showMapDetails}
          onDidDismiss={() => setShowMapDetails(false)}
        >
          <div className="modalHeader">
            <h3>Map Phase</h3>
            <button
              className="closeButton"
              onClick={() => setShowMapDetails(false)}
            >
              <IonIcon icon={closeOutline} />
            </button>
          </div>
          {moveState ? (
            <>
              <IonButton onClick={() => setMoveState(false)} color="danger">Cancel Move</IonButton>
            </>
          ) : (
            <>
              <IonButton onClick={handleMoveClick}>Move Character</IonButton>
            </>
          )}

          <IonButton>Build Structure</IonButton>
          <p>
            <b>WARNING:</b> If Rest is taken Map Phase will be skipped.
          </p>
          <IonButton color='warning'>Rest</IonButton>
        </IonModal>
      </div>
      {moveState ? <>Move Charcter</> : <></>}
    </>
  );
};

export default MapPhase;
