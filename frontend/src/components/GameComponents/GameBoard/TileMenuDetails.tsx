import React, { useContext, useEffect, useState } from "react";
import { IonContent, IonIcon, IonModal, IonButton } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { BuildingInfo, PlayerInfo } from "../Interfaces";
import { useGameContext } from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import StrongholdPlacement from "./StrongholdPlacement";

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
export interface StrongholdInfo {
  row: number;
  col: number;
  ownerUsername: string; // Add this to store the owner's username
}

export interface TileInfo {
  type: string;
  x: number;
  y: number;
  image: string;
  monsterBonuses: string;
  buildingBonuses: string;
  players: PlayerInfo | null;
  buildings: BuildingInfo[] | null;
  stronghold: StrongholdInfo | null;
  titan: Titan | null;
  titanImage?: string;
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
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  useGameContext;
  const [isStrongholdPlacementMode, setIsStrongholdPlacementMode] =
    useState(false);
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  const currentPlayerTurn = gameState.currentPlayerTurn;

  // Check if stronghold is placed and if cuurrent player turn
  useEffect(() => {
    if (
      gameState.setupPhase &&
      currentPlayer?.username === currentPlayerTurn
    ) {
      setIsStrongholdPlacementMode(true);
    } else {
      setIsStrongholdPlacementMode(false);
    }
  }, [gameState.setupPhase, currentPlayer]);


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
              <StrongholdPlacement selectedTile={selectedTile} />
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
                <p>Owner: {selectedTile.stronghold.ownerUsername}</p>
                <p>
                  Coordinates: (X: {selectedTile.stronghold.col}, Y:{" "}
                  {selectedTile.stronghold.row})
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
      </IonContent>
    </IonModal>
  );
};

export default TileMenuDetails;
