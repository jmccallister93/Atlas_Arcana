import React, { useState } from "react";

import desert from "./GameTiles/desertTile.png";
import forest from "./GameTiles/forestTile.png";
import grassland from "./GameTiles/grasslandTile.png";
import tundra from "./GameTiles/tundraTile.png";
import oasis from "./GameTiles/oasisTile.png";
import fireTitanToken from "../Titans/Tokens/fire_titan_token.png";
import iceTitanToken from "../Titans/Tokens/ice_titan_token.png";
import stoneTitanToken from "../Titans/Tokens/stone_titan_token.png";
import stormTitanToken from "../Titans/Tokens/storm_titan_token.png";
import "./GameBoard.scss";
import { StrongholdInfo } from "./TileMenuDetails";
import { BuildingInfo, GameSessionInfo, PlayerInfo } from "../Interfaces";
import { useGameContext } from "../../../context/GameContext/GameContext";
import TileModal from "./TileModal";
import TileAlerts from "./TileAlerts";
import Canvas from "./Canvas";

interface GameBoardProps {}
export interface TileInfo {
  type: string;
  x: number;
  y: number;
  image: string;
  monsterBonuses: string;
  buildingBonuses: string;
  buildings: BuildingInfo[] | null;
  players: PlayerInfo | null;
  stronghold: StrongholdInfo | null;
  titan: {
    titanName: string;
    rank: number;
    health: number;
    offense: number;
    defense: number;
    stamina: number;
    row: number;
    col: number;
  } | null;
  titanImage: string;
}

export interface TileCoordinate {
  x: number;
  y: number;
}

const GameBoard: React.FC<GameBoardProps> = ({}) => {
  console.log("GameBoard Rendered");
  // Get Game state
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const [tileGrid, setTileGrid] = useState<string[][]>(
    gameState.gameState.tileGrid
  );
  const titans = gameState.gameState.titans;
  const [tileSize, setTileSize] = useState(30);
  const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
  const [showTileDetails, setShowTileDetails] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


  return (
    <>
      <Canvas
        tileGrid={tileGrid}
        titans={titans}
        players={gameState.players}
        tileSize={tileSize}
        handleTileSelection={handleTileSelection}
      />

      <TileModal
        selectedTile={selectedTile}
        showTileDetails={showTileDetails}
        setShowTileDetails={setShowTileDetails}
      />

      <TileAlerts
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertMessage={alertMessage}
        selectedTile={selectedTile}
      />

   
    </>
  );
};

export default React.memo(GameBoard);
