import React, { useRef, useEffect, useState } from "react";
import p5, { Image } from "p5";
import desert from "./GameTiles/desertTile.png";
import forest from "./GameTiles/forestTile.png";
import grassland from "./GameTiles/grasslandTile.png";
import tundra from "./GameTiles/tundraTile.png";
import oasis from "./GameTiles/oasisTile.png";
import stronghold1 from "./GameTiles/stronghold1.png";
import stronghold2 from "./GameTiles/stronghold2.png";
import stronghold3 from "./GameTiles/stronghold3.png";
import stronghold4 from "./GameTiles/stronghold4.png";
import {
  IonAlert,
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import fireTitanToken from "../Titans/Tokens/fire_titan_token.png";
import iceTitanToken from "../Titans/Tokens/ice_titan_token.png";
import stoneTitanToken from "../Titans/Tokens/stone_titan_token.png";
import stormTitanToken from "../Titans/Tokens/storm_titan_token.png";
import "./GameBoard.scss";
import TileMenuDetails, { StrongholdInfo } from "./TileMenuDetails";
import { BuildingInfo, GameSessionInfo, PlayerInfo } from "../Interfaces";
import { useGameContext } from "../../../context/GameContext/GameContext";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import TileModal from "./TileModal";
import TileAlerts from "./TileAlerts";
import TileGrid from "./BackgroundCanvas";
import BackgroundCanvas from "./BackgroundCanvas";
import StrongholdCanvas from "./StrongholdCanvas";
import BackgroundCanvasTest from "./Phaertest";

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
  // Get Game state
  const { gameState, emitGameStateUpdate, updatePlayerData } = useGameContext();
  const auth = useAuth();
  // Player info
  // const [players, setPlayers] = useState<PlayerInfo[]>(gameState.players);
  // useEffect(() => {setPlayers(gameState.players)},[gameState.players])
  const currentPlayer = gameState.players.find(
    (player) => player.username === auth.username
  );
  // States that were being passed
  const currentPlayerTurn = gameState.gameState.currentPlayerTurn;
  const [tileGrid, setTileGrid] = useState<string[][]>(
    gameState.gameState.tileGrid
  );
  const titans = gameState.gameState.titans;

  const [hasSetupCompleted, setHasSetupCompleted] = useState(false);

  useEffect(() => {
    console.log("FIRED");
    // Only proceed if setup has not been completed yet

    if (gameState.gameState.setupPhase) {
      setHasSetupCompleted(false);
    } else {
      setHasSetupCompleted(true);
    }
  }, [gameState.gameState.setupPhase]);

  const [tileSize, setTileSize] = useState(30);

  const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
  const [showTileDetails, setShowTileDetails] = useState(false);
  const [isStrongholdPlacementMode, setIsStrongholdPlacementMode] =
    useState(false);
  const [selectedStrongholdCoordinates, setSelectedStrongholdCoordinates] =
    useState({ x: 0, y: 0 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Calculate distance of tiles
  const calculateDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
  // Validate stronghold placement
  const isValidStrongholdPlacement = (x: number, y: number): boolean => {
    // Check distance from titans
    for (let titan of titans ?? []) {
      const distance = calculateDistance(x, y, titan.col, titan.row);

      if (distance <= 6) {
        return false; // Too close to a titan
      }
    }

    // Check distance from other players' strongholds
    for (let player of gameState.players ?? []) {
      if (player.strongHold && player.username !== currentPlayer?.username) {
        const distance = calculateDistance(
          x,
          y,
          player.strongHold.col,
          player.strongHold.row
        );

        if (distance <= 6) {
          return false; // Too close to another player's stronghold
        }
      }
    }

    return true; // Valid placement
  };

  // Check if stronghold is placed and if cuurrent player turn
  useEffect(() => {
    if (!hasSetupCompleted && currentPlayer?.username === currentPlayerTurn) {
      setIsStrongholdPlacementMode(true);
    } else {
      setIsStrongholdPlacementMode(false);
    }
  }, [currentPlayer]);

  // Handle Selected tile
  // Modified handleTileSelection to accept coordinates
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

    setSelectedStrongholdCoordinates({ x: xIndex, y: yIndex });
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

  // Place stronghold
  const placeStronghold = () => {
    console.log(
      "Selected Stronghold x",
      selectedStrongholdCoordinates.x,
      "Selected Stronghold y",
      selectedStrongholdCoordinates.y,
      "Selected Tile",
      selectedTile,
      "currentPlayer:",
      currentPlayer
    );
    if (
      currentPlayer &&
      isValidStrongholdPlacement(
        selectedStrongholdCoordinates.x,
        selectedStrongholdCoordinates.y
      )
    ) {
      const updatedPlayer = {
        ...currentPlayer,
        strongHold: {
          col: selectedStrongholdCoordinates.x,
          row: selectedStrongholdCoordinates.y,
        },
      };
      //HERERERERERER
      const updatedGameState = {
        // ...gameState,
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
  };

  return (
    <>
      <div className="canvasWrapper">
        <BackgroundCanvasTest
          tileGrid={tileGrid}
          titans={titans}
          players={gameState.players}
          tileSize={tileSize}
          handleTileSelection={handleTileSelection}
        />
        {/* <StrongholdCanvas 
        tileGrid={tileGrid}
        players={gameState.players}
        tileSize={tileSize}
        onStrongholdPlaced={placeStronghold}
        /> */}
      </div>

      <TileModal
        selectedTile={selectedTile}
        showTileDetails={showTileDetails}
        setShowTileDetails={setShowTileDetails}
        isStrongholdPlacementMode={isStrongholdPlacementMode}
        placeStronghold={placeStronghold}
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

export default GameBoard;
