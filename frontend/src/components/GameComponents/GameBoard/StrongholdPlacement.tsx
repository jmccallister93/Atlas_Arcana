import React, { useState } from "react";
import { IonButton, IonAlert } from "@ionic/react";
import { GameSessionInfo, PlayerInfo, TitanInfo } from "../Interfaces"; // Adjust the import paths based on your project structure
import { useGameContext, useGameStatePart } from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { TileInfo } from "./TileMenuDetails";

interface StrongholdPlacementProps {
  selectedTile: TileInfo | null;
  setGameTurnManagerAlert: React.Dispatch<React.SetStateAction<boolean>>
}

const StrongholdPlacement: React.FC<StrongholdPlacementProps> = ({
  selectedTile,
  setGameTurnManagerAlert
}) => {
  const {emitGameStateUpdate} = useGameContext()
  const players = useGameStatePart((state) => state.players as PlayerInfo[]);
  const titans = useGameStatePart((state) => state.titans as TitanInfo[]);
  const auth = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  

  const currentPlayer = players.find(
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
    for (let titan of titans) {
      const distance = calculateDistance(x, y, titan.col, titan.row);
      if (distance <= 6) return false;
    }

    for (let player of players) {
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
          players: players?.map((p) =>
            p.username === updatedPlayer.username ? updatedPlayer : p
          ),
        };
        // Emit the update to server
        emitGameStateUpdate(updatedGameState);
        setGameTurnManagerAlert(false)
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
