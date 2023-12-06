import { useState } from "react";
import { PlayerInfo } from "../Interfaces";
import { IonButton, IonIcon, IonModal } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

export interface DrawPhase {
  currentPlayer: PlayerInfo | undefined;
}

const DrawPhase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCardDrawDetails, setShowCardDrawDetails] = useState(true);

  return (
    <>
      <IonModal
        isOpen={showCardDrawDetails}
        onDidDismiss={() => setShowCardDrawDetails(false)}
      >
         <button
              className="closeButton"
              onClick={() => setShowCardDrawDetails(false)}
            >
              <IonIcon icon={closeOutline} />
            </button>
        You drew X card.
        <IonButton onClick={() => setShowCardDrawDetails(false)}>Close</IonButton>
      </IonModal>
    </>
  );
};

export default DrawPhase;
