import { useState } from "react";
import { useGameContext } from "../../../context/GameContext/GameContext";
import { StrongholdInfo, TileInfo } from "./TileMenuDetails";
import { BuildingInfo } from "../Interfaces";
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

const TileSelect: React.FC = ({}) => {
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const [tileGrid, setTileGrid] = useState<string[][]>(
    gameState.gameState.tileGrid
  );
  const titans = gameState.gameState.titans;
  const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
  const [showTileDetails, setShowTileDetails] = useState(false);

  // Handle Selected tile
  const handleTileSelection = (xIndex: number, yIndex: number) => {
    if (
      xIndex < 0 ||
      xIndex >= tileGrid.length ||
      yIndex < 0 ||
      yIndex >= tileGrid[xIndex].length
    ) {
      console.error("Selected tile is out of bounds.");
      return;
    }
    onTileSelect(tileGrid[xIndex][yIndex], xIndex, yIndex);
  };

  // Updated function to check entities on a tile
  const checkEntitiesOnTile = (x: number, y: number) => {
    let playerOnTile = null;
    let strongholdOnTile: StrongholdInfo | null = null;
    let buildingsOnTile: BuildingInfo[] = [];
    let titanOnTile = null;
    let titanImageUrl = "";
    // Check for titans
    const foundTitan = titans?.find(
      (titan) => titan.row === y && titan.col === x
    );
    if (foundTitan) {
      titanOnTile = foundTitan;
      // Determine the image URL based on the titan's name
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
    // Determine the image URL based on the titan's name
    gameState.players?.forEach((player) => {
      // Check for player
      if (player.row === y && player.col === x) {
        playerOnTile = player;
      }

      if (
        player.strongHold &&
        player.strongHold.row === y &&
        player.strongHold.col === x
      ) {
        strongholdOnTile = {
          ...player.strongHold,
          ownerUsername: player.username, // Include the owner's username
        };
      }

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

    return {
      playerOnTile,
      strongholdOnTile,
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
        imageSrc = ""; // Default image or leave blank
        buildingBonuses = "";
        monsterBonuses = "";
        break;
    }
    // Handle unknown or undefined tile types
    if (!imageSrc) {
      console.error("Unknown tile type selected:", tileType);
      return;
    }

    const {
      playerOnTile,
      strongholdOnTile,
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
      buildings: buildingsOnTile,
    });
    setShowTileDetails(true);
  };
  return <></>;
};

export default TileSelect;
