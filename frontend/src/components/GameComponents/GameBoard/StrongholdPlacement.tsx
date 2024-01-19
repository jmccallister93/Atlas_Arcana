import React, { useState, useEffect, useMemo } from "react";
import { IonButton, IonAlert } from "@ionic/react";
import {
  GameSessionInfo,
  PlayerInfo,
  TitanInfo,
  StrongholdPosition,
} from "../Interfaces"; // Adjust the import paths based on your project structure
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { TileInfo } from "./TileMenuDetails";

interface StrongholdPlacementProps {
  selectedTile: TileInfo | null;
  onShowStrongholdAlert: (message: string) => void;
}

const StrongholdPlacement: React.FC<StrongholdPlacementProps> = ({
  selectedTile,
  onShowStrongholdAlert,
}) => {
  const { updateStrongholdPosition } = useGameContext();
  const players = useGameStatePart((state) => state.players as PlayerInfo[]);
  const titans = useGameStatePart((state) => state.titans as TitanInfo[]);
  const strongholdPositions = useGameStatePart(
    (state) => state.strongholdPositions as StrongholdPosition[]
  );

  const auth = useAuth();

  // console.log("STHLDP rendered");

  const currentPlayer = useMemo(() => {
    return players.find((player) => player.username === auth.username);
  }, [players, auth.username]);

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

    for (let stronghold of strongholdPositions) {
      if (stronghold.playerUsername !== currentPlayer?.username) {
        const distance = calculateDistance(x, y, stronghold.x, stronghold.y);
        if (distance <= 6) return false;
      }
    }

    return true;
  };

  // Place stronghold
  const placeStronghold = () => {
    if (selectedTile && currentPlayer) {
      if (isValidStrongholdPlacement(selectedTile.x, selectedTile.y)) {
        const updatedStrongholdPosition: StrongholdPosition = {
          playerUsername: currentPlayer.username,
          x: selectedTile.x,
          y: selectedTile.y,
        };

        // Update the stronghold position
        
        updateStrongholdPosition(updatedStrongholdPosition);
      } else {
        onShowStrongholdAlert(
          "Invalid stronghold placement. Must be at least 6 tiles away from Player Stronghold and Titan."
        );
      }
    }
  };

  return (
    <>
      <IonButton onClick={placeStronghold}>Place Stronghold</IonButton>
    </>
  );
};

export default React.memo(StrongholdPlacement);
