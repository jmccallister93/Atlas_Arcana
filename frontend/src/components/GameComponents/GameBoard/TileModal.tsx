import React from "react";
import { IonModal, IonContent, IonButton, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import TileMenuDetails from "./TileMenuDetails";
import { TileInfo } from "./GameBoard";

interface TileModalProps {
  selectedTile: TileInfo | null;
  showTileDetails: boolean;
  setShowTileDetails: (show: boolean) => void;
}

const TileModal: React.FC<TileModalProps> = ({
  selectedTile,
  showTileDetails,
  setShowTileDetails,
}) => {
 
  // console.log("Tile Modal Rendered")
  return (
    <>
      <IonModal
        isOpen={showTileDetails}
        onDidDismiss={() => setShowTileDetails(false)}
      >
        <IonContent>
          <div className="modalHeader">
            <h2>Details</h2>
            <button
              className="closeButton"
              onClick={() => setShowTileDetails(false)}
            >
              <IonIcon icon={closeOutline} />
            </button>
          </div>
          {selectedTile && (
            <TileMenuDetails
              selectedTile={selectedTile}
              showTileDetails={showTileDetails}
              setShowTileDetails={setShowTileDetails}
            
            />
          )}
          <IonButton onClick={() => setShowTileDetails(false)}>Close</IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default React.memo(TileModal);
