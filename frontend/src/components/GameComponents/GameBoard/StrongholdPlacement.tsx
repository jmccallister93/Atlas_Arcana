import React, { useState } from "react";
import { IonButton, IonAlert } from "@ionic/react";
import { GameSessionInfo, PlayerInfo, TitanInfo } from "../Interfaces"; // Adjust the import paths based on your project structure
import { useGameContext } from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { TileInfo } from "./TileMenuDetails";

interface StrongholdPlacementProps {
  selectedTile: TileInfo | null;
}

const StrongholdPlacement: React.FC<StrongholdPlacementProps> = ({
  selectedTile,
}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );

  const calculateDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const isValidStrongholdPlacement = (x: number, y: number): boolean => {
    for (let titan of gameState.titans) {
      const distance = calculateDistance(x, y, titan.col, titan.row);
      if (distance <= 6) return false;
    }

    for (let player of gameState.players) {
      if (player.strongHold && player.username !== currentPlayer?.username) {
        const distance = calculateDistance(
          x,
          y,
          player.strongHold.col,
          player.strongHold.row
        );
        if (distance <= 6) return false;
      }
    }

    return true;
  };

  // Place stronghold
  const placeStronghold = () => {
    if (selectedTile) {
      if (
        currentPlayer &&
        isValidStrongholdPlacement(selectedTile.x, selectedTile.y)
      ) {
        const updatedPlayer = {
          ...currentPlayer,
          strongHold: {
            col: selectedTile.x,
            row: selectedTile.y,
          },
        };
        const updatedGameState = {
          players: gameState.players?.map((p) =>
            p.username === updatedPlayer.username ? updatedPlayer : p
          ),
        };
        // Emit the update to server
        emitGameStateUpdate(updatedGameState);
      } else {
        setAlertMessage(
          "Invalid stronghold placement. Must be at least 6 tiles away from Player Stronghold and Titan."
        );
        setShowAlert(true);
        return;
      }
    }
  };

  return (
    <>
      <IonButton onClick={placeStronghold}>Place Stronghold</IonButton>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        message={alertMessage}
        buttons={["OK"]}
      />
    </>
  );
};

export default StrongholdPlacement;
