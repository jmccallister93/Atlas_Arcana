import React from "react";
import { IonContent, IonIcon, IonModal, IonButton } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

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
}

const TileMenuDetails: React.FC<TileMenuDetailsProps> = ({
  selectedTile,
  showTileDetails,
  setShowTileDetails,
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
             {/* {selectedTile.player && (
              <div>
                <h3>{selectedTile.player.playerName} Details</h3>
                <img
                  src={selectedTile.player.image}
                  alt={selectedTile.player.playerName}
                  style={{ maxWidth: "100%" }}
                />
                <p>
                  <b>Rank:</b> {selectedTile.player.rank}
                </p>
                <p>
                  <b>Health:</b> {selectedTile.player.health}
                </p>
                <p>
                  <b>Offense:</b> {selectedTile.player.offense}
                </p>
                <p>
                  <b>Defense:</b> {selectedTile.player.defense}
                </p>
                <p>
                  <b>Stamina:</b> {selectedTile.player.stamina}
                </p>
              </div>
            )}
             {selectedTile.building && (
              <div>
                <h3>{selectedTile.building.buildingName} Details</h3>
                <img
                  src={selectedTile.building.image}
                  alt={selectedTile.building.buildingName}
                  style={{ maxWidth: "100%" }}
                />
                <p>
                  <b>Description:</b> {selectedTile.building.description}
                </p>
                <p>
                  <b>Health:</b> {selectedTile.building.health}
                </p>
                <p>
                  <b>Offense:</b> {selectedTile.building.offense}
                </p>
                <p>
                  <b>Defense:</b> {selectedTile.building.defense}
                </p>
              </div>
            )} */}
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
