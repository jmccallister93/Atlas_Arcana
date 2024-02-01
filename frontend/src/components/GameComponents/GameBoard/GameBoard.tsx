import React, { useCallback, useMemo, useRef, useState } from "react";

import desert from "./GameTiles/desertTile.png";
import forest from "./GameTiles/forestTile.png";
import grassland from "./GameTiles/grasslandTile.png";
import tundra from "./GameTiles/tundraTile.png";
import oasis from "./GameTiles/oasisTile.png";
import fireTitanToken from "../Titans/Tokens/fire_titan_token.png";
import iceTitanToken from "../Titans/Tokens/ice_titan_token.png";
import stoneTitanToken from "../Titans/Tokens/stone_titan_token.png";
import stormTitanToken from "../Titans/Tokens/storm_titan_token.png";
import stronghold1 from "./GameTiles/stronghold1.png";
import stronghold2 from "./GameTiles/stronghold2.png";
import stronghold3 from "./GameTiles/stronghold3.png";
import stronghold4 from "./GameTiles/stronghold4.png";
import "./GameBoard.scss";
import {
  BuildingInfo,
  GameSessionInfo,
  PlayerInfo,
  StrongholdPosition,
  TitanInfo,
  TitanPosition,
} from "../Interfaces";
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import TileModal from "./TileModal";
import TileAlerts from "./TileAlerts";
import Canvas from "./Canvas";

export interface TileInfo {
  type: string;
  x: number;
  y: number;
  image: string;
  monsterBonuses: string;
  buildingBonuses: string;
  buildings: BuildingInfo[] | null;
  players: PlayerInfo | null;
  stronghold: StrongholdPosition | null;
  strongholdImage: string;
  titan: TitanPosition | null;
  titanImage: string;
}

export interface TileCoordinate {
  x: number;
  y: number;
}
type StrongholdImages = {
  [username: string]: string;
};

interface GameBoardProps {}

const usePlayerBoardData = (players: PlayerInfo[]) => {
  return useMemo(() => {
    return players.map((player) => ({
      username: player.username,
      // strongHold: player.strongHold,
      buildings: player.buildings,
      // position: { row: player.row, col: player.col }, // Assuming these are directly on the player object
    }));
  }, [players]);
};

const GameBoard: React.FC<GameBoardProps> = ({}) => {
  // console.log("GameBoard Rendered");
  // Get Game state componenets
  const players = useGameStatePart((state) => state.players as PlayerInfo[]);
  const playerBoardData = usePlayerBoardData(players);
  const strongholdPositions = useGameStatePart(
    (state) => state.strongholdPositions as StrongholdPosition[]
  );
  const strongholdPositionsRef = useRef(strongholdPositions);
  strongholdPositionsRef.current = strongholdPositions;
  const titans = useGameStatePart(
    (state) => state.titanPositions as TitanPosition[]
  );
  const tileGrid = useGameStatePart((state) => state.tileGrid as string[][]);
  const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
  const [showTileDetails, setShowTileDetails] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage] = useState("");
  const state = useGameStatePart((state) => state);

  // Handle Selected tile
  const handleTileSelection = (x: number, y: number) => {
    if (x < 0 || x >= tileGrid.length || y < 0 || y >= tileGrid[x].length) {
      console.error("Selected tile is out of bounds.");
      return;
    }
    onTileSelect(tileGrid[x][y], x, y);
  };

  // Updated function to check entities on a tile
  const checkEntitiesOnTile = (x: number, y: number) => {
    let buildingsOnTile: BuildingInfo[] = [];

    // Check for titans
    let titanOnTile = null;
    let titanImageUrl = "";
    const foundTitan = titans?.find((titan) => titan.x === x && titan.y === y);
    if (foundTitan) {
      titanOnTile = foundTitan;
      switch (titanOnTile.titanName) {
        case "Fire Titan":
          titanImageUrl = fireTitanToken;
          break;
        case "Ice Titan":
          titanImageUrl = iceTitanToken;
          break;
        case "Stone Titan":
          titanImageUrl = stoneTitanToken;
          break;
        case "Storm Titan":
          titanImageUrl = stormTitanToken;
          break;
      }
    }

    // Determine the image URL based on the player's name
    let playerOnTile = null;
    playerBoardData?.forEach((player) => {
      // Check for player
      // if (player.row === y && player.col === x) {
      //   playerOnTile = player;
      // }
      // Check for buildings
      Object.values(player.buildings).forEach((buildingCategory) => {
        // Ensure buildingCategory is an array before calling forEach
        if (Array.isArray(buildingCategory)) {
          buildingCategory.forEach((building) => {
            building.location.forEach((loc) => {
              if (loc.row === y && loc.col === x) {
                buildingsOnTile.push(building);
              }
            });
          });
        }
      });
    });

    // Stronghold
    let strongholdOnTile = null;
    let strongholdImageUrl = "";
    // Mapping object
    const strongholdImages: StrongholdImages = {
      playerUsername1: stronghold1,
      playerUsername2: stronghold2,
      // Add more mappings as needed
    };
    const foundStronghold = strongholdPositionsRef.current.find(
      (stronghold) => stronghold.x === x && stronghold.y === y
    );

    if (foundStronghold) {
      strongholdOnTile = {
        playerUsername: foundStronghold.playerUsername,
        x: foundStronghold.x,
        y: foundStronghold.y,
      };
      strongholdImageUrl =
        strongholdImages[foundStronghold.playerUsername] || "";
    }

    return {
      playerOnTile,
      strongholdOnTile,
      strongholdImageUrl,
      buildingsOnTile,
      titanOnTile,
      titanImageUrl,
    };
  };

  // On tile Select render out details
  const onTileSelect = (tileType: string, x: number, y: number) => {
    let imageSrc = "";
    let buildingBonuses = "";
    let monsterBonuses = "";

    switch (tileType) {
      case "oasis":
        imageSrc = oasis;
        buildingBonuses = "All tile type bonuses ";
        monsterBonuses = "+1 All Stats";
        break;
      case "desert":
        imageSrc = desert;
        buildingBonuses = "None.";
        monsterBonuses = "+1 Offense";
        break;
      case "forest":
        imageSrc = forest;
        buildingBonuses = "All buildings cost 1 less Resource to build.";
        monsterBonuses = "+1 Defense";
        break;
      case "grassland":
        imageSrc = grassland;
        buildingBonuses = "Resource buildings produce 1 additional Resrouce.";
        monsterBonuses = "+1 Stamina";
        break;
      case "tundra":
        imageSrc = tundra;
        buildingBonuses = "All Buildings have +1 Offense & +1 Defense.";
        monsterBonuses = "+1 Health";
        break;
      default:
        imageSrc = "";
        buildingBonuses = "";
        monsterBonuses = "";
        break;
    }

    if (!imageSrc) {
      console.error("Unknown tile type selected:", tileType);
      return;
    }

    const {
      playerOnTile,
      strongholdOnTile,
      strongholdImageUrl,
      buildingsOnTile,
      titanOnTile,
      titanImageUrl,
    } = checkEntitiesOnTile(x, y);

    setSelectedTile({
      type: tileType,
      x,
      y,
      image: imageSrc,
      monsterBonuses: monsterBonuses,
      buildingBonuses: buildingBonuses,
      titan: titanOnTile,
      titanImage: titanImageUrl,
      players: playerOnTile,
      stronghold: strongholdOnTile,
      strongholdImage: strongholdImageUrl,
      buildings: buildingsOnTile,
    });
    setShowTileDetails(true);
  };

  return (
    <>
      <Canvas handleTileSelection={handleTileSelection} />
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
