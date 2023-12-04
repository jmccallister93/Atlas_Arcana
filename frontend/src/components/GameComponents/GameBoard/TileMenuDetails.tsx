import React from "react";
import { IonContent, IonIcon, IonModal, IonButton } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { PlayerInfo } from "../Interfaces";

interface Titan {
  titanName: string;
  rank: number;
  health: number;
  offense: number;
  defense: number;
  stamina: number;
  row: number;
  col: number;
  image?: string;
}

interface TileInfo {
  type: string;
  x: number;
  y: number;
  image: string;
  monsterBonuses: string;
  buildingBonuses: string;
  titan: Titan | null;
}

interface TileMenuDetailsProps {
  selectedTile: TileInfo | null;
  showTileDetails: boolean;
  setShowTileDetails: (show: boolean) => void;
  isStrongholdPlacementMode: boolean;
  placeStronghold: () => void;

}

const TileMenuDetails: React.FC<TileMenuDetailsProps> = ({
  selectedTile,
  showTileDetails,
  setShowTileDetails,
  isStrongholdPlacementMode,
  placeStronghold,

}) => {
  return (
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
          <>
            {selectedTile.titan && (
              <div>
                <h3>{selectedTile.titan.titanName} Details</h3>
                <img
                  src={selectedTile.titan.image}
                  alt={selectedTile.titan.titanName}
                  style={{ maxWidth: "100%" }}
                />
                <p>
                  <b>Rank:</b> {selectedTile.titan.rank}
                </p>
                <p>
                  <b>Health:</b> {selectedTile.titan.health}
                </p>
                <p>
                  <b>Offense:</b> {selectedTile.titan.offense}
                </p>
                <p>
                  <b>Defense:</b> {selectedTile.titan.defense}
                </p>
                <p>
                  <b>Stamina:</b> {selectedTile.titan.stamina}
                </p>
              </div>
            )}
            {isStrongholdPlacementMode ? (
              <>
              <p>Place Stronghold on Tile?</p>
              <IonButton onClick={placeStronghold}>Confirm</IonButton>
              </>
            ) : (null)}
            <div>
              <h3>Tile Details</h3>
            <img
              src={selectedTile.image}
              alt={selectedTile.type}
              style={{ maxWidth: "45%" }}
            />
            <p>
              <b>Type:</b> {selectedTile.type}
            </p>
            <p>
              <b>Coordinates:</b> (X: {selectedTile.x}, Y: {selectedTile.y})
            </p>
            <p>
              <b>Building Bonuses:</b> {selectedTile.buildingBonuses}
            </p>
            <p>
              <b>Monster Bonuses:</b> {selectedTile.monsterBonuses}
            </p>
            </div>
          </>
        )}
        <IonButton onClick={() => setShowTileDetails(false)}>Close</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default TileMenuDetails;
