import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  IonContent,
  IonIcon,
  IonModal,
  IonButton,
  IonAlert,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { BuildingInfo, PlayerInfo, StrongholdPosition, TitanPosition } from "../Interfaces";
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import StrongholdPlacement from "./StrongholdPlacement";
import { TileInfo } from "./GameBoard";
import stronghold1 from "./GameTiles/stronghold1.png";
import stronghold2 from "./GameTiles/stronghold2.png";
import stronghold3 from "./GameTiles/stronghold3.png";
import stronghold4 from "./GameTiles/stronghold4.png";

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
  // const { gameState } = useGameContext();

  const auth = useAuth();
  const playerData = useGameStatePart((state) => {
    return state.players.map(({ username, buildings }) => ({
      username,
      buildings,
    }));
  });
  const currentPlayerTurn = useGameStatePart(
    (state) => state.currentPlayerTurn as string
  );
  const setupPhase = useGameStatePart((state) => state.setupPhase as boolean);
  const [isStrongholdPlacementMode, setIsStrongholdPlacementMode] =
    useState(false);
  const currentPlayer = useMemo(() => {
    return playerData.find((player) => player.username === auth.username);
  }, [playerData, auth.username]);
  const [showStrongholdAlert, setShowStrongholdAlert] = useState(false);
  const [strongholdAlertMessage, setStrongholdAlertMessage] = useState("");


  // console.log("TMD rendered");
  // Check if stronghold is placed and if cuurrent player turn
  useEffect(() => {
    if (setupPhase && currentPlayer?.username === currentPlayerTurn) {
      setIsStrongholdPlacementMode(true);
    } else {
      setIsStrongholdPlacementMode(false);
    }
  }, [setupPhase, currentPlayer]);

  const handleShowStrongholdAlert = (message: string) => {
    setStrongholdAlertMessage(message);
    setShowStrongholdAlert(true);
  };


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
            {/* Stronghold Palcement */}
            {isStrongholdPlacementMode ? (
              <StrongholdPlacement
                selectedTile={selectedTile}
                onShowStrongholdAlert={handleShowStrongholdAlert}
              />
            ) : null}

            {/* titan details */}
            {selectedTile.titan && (
              <div>
                <h3>{selectedTile.titan.titanName} Details</h3>
                <img
                  src={selectedTile.titanImage}
                  alt={selectedTile.titan.titanName}
                  style={{ maxWidth: "100%" }}
                />
                {/* <p>
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
                </p> */}
              </div>
            )}

            {/* Render Player Details */}
            {selectedTile.players && (
              <div>
                <h3>Player Details</h3>
                {/* Add more player details as needed */}
                <p>
                  <b>Username:</b> {selectedTile.players.username}
                </p>
                {/* ...other player details */}
              </div>
            )}

            {/* Render Building Details */}
            {selectedTile.buildings && selectedTile.buildings.length > 0 && (
              <div>
                <h3>Buildings</h3>
                {selectedTile.buildings.map((building, index) => (
                  <div key={index}>
                    <p>
                      <b>Type:</b> {building.type}
                    </p>
                    <p>
                      <b>Count:</b> {building.count}
                    </p>
                    {/* ...other building details */}
                  </div>
                ))}
              </div>
            )}

            {/* Render Stronghold Details */}
            {selectedTile.stronghold && (
              <div>
                <h3>Stronghold</h3>
                <img
                  src={selectedTile.strongholdImage}
                  alt={selectedTile.stronghold.playerUsername}
                  style={{ maxWidth: "100%" }}
                />
                <p>Owner: {selectedTile.stronghold.playerUsername}</p>
                <p>
                  Coordinates: (X: {selectedTile.stronghold.x}, Y:{" "}
                  {selectedTile.stronghold.y})
                </p>
              </div>
            )}

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
        <IonAlert
          isOpen={showStrongholdAlert}
          onDidDismiss={() => setShowStrongholdAlert(false)}
          message={strongholdAlertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonModal>
  );
};

export default React.memo(TileMenuDetails);
