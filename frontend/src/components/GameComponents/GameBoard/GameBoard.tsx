import React, { useRef, useEffect, useState } from "react";
import p5, { Image } from "p5";
import desert from "./GameTiles/desertTile.png";
import forest from "./GameTiles/forestTile.png";
import grassland from "./GameTiles/grasslandTile.png";
import tundra from "./GameTiles/tundraTile.png";
import oasis from "./GameTiles/oasisTile.png";
import stronghold1 from "./GameTiles/stronghold1.png";
import stronghold2 from "./GameTiles/stronghold2.png";
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
import TileMenuDetails from "./TileMenuDetails";
import { GameSessionInfo, PlayerInfo } from "../Interfaces";

interface GameBoardProps {
  gameState?: GameSessionInfo;
  currentPlayer: PlayerInfo | undefined;
  tileGrid?: string[][];
  titans?: {
    titanName: string;
    rank: number;
    health: number;
    offense: number;
    defense: number;
    stamina: number;
    row: number;
    col: number;
  }[];
  players?: PlayerInfo[];
  buildings?: {};
  emitGameStateUpdate: (updatedData: Partial<GameSessionInfo>) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  tileGrid,
  titans,
  players,
  emitGameStateUpdate,
  gameState,
  currentPlayer,
}) => {
  const mouseCoords = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [width, setWidth] = useState(720);
  const [height, setHeight] = useState(720);
  const [tileSize, setTileSize] = useState(30);
  interface TileInfo {
    type: string;
    x: number;
    y: number;
    image: string;
    monsterBonuses: string;
    buildingBonuses: string;
    // buildings: string[];
    // players: string[];

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
  const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
  const [showTileDetails, setShowTileDetails] = useState(false);
  const [isStrongholdPlacementMode, setIsStrongholdPlacementMode] =
    useState(false);
  const [showStrongholdConfirmation, setShowStrongholdConfirmation] =
    useState(false);
  const [selectedStrongholdCoordinates, setSelectedStrongholdCoordinates] =
    useState({ x: 0, y: 0 });

  // Main UseEffect
  useEffect(() => {
    if (!tileGrid) return;
    const sketch = (p: p5) => {
      let desertImg: Image,
        forestImg: Image,
        grasslandImg: Image,
        tundraImg: Image,
        oasisImg: Image,
        fireTitanImg: Image, // Titan token images
        iceTitanImg: Image,
        stoneTitanImg: Image,
        stormTitanImg: Image,
        stronghold1Img: Image,
        stronghold2Img: Image;

      //   Preload images
      p.preload = () => {
        desertImg = p.loadImage(desert);
        forestImg = p.loadImage(forest);
        grasslandImg = p.loadImage(grassland);
        tundraImg = p.loadImage(tundra);
        oasisImg = p.loadImage(oasis);
        fireTitanImg = p.loadImage(fireTitanToken);
        iceTitanImg = p.loadImage(iceTitanToken);
        stoneTitanImg = p.loadImage(stoneTitanToken);
        stormTitanImg = p.loadImage(stormTitanToken);
        stronghold1Img = p.loadImage(stronghold1);
        stronghold2Img = p.loadImage(stronghold2);
      };

      // Setup canvas
      p.setup = () => {
        let canvas = p.createCanvas(width, height); // Create the P5 canvas
        p.noLoop();
        if (canvasRef.current) {
          canvas.parent(canvasRef.current); // Assign P5 canvas to the div
        }
      };

      // Draw everything
      p.draw = () => {
        p.background(255);

        const tileTypeToColor: any = {
          forest: "#095300", // Dark Green
          desert: "#F9DA70", // Sandy Color
          oasis: "#005fcc", // Dark Turquoise
          tundra: "#D9D9D9", // Silver
          grassland: "#00BC53", // Lime Green
        };

        for (let x = 0; x < tileGrid.length; x++) {
          for (let y = 0; y < tileGrid[x].length; y++) {
            let tileType = tileGrid[x][y];
            let color = tileTypeToColor[tileType] || "#FFFFFF";
            p.fill(color);
            p.rect(x * tileSize, y * tileSize, tileSize, tileSize);
            // switch (tileType) {
            //   case "oasis":
            //     p.image(
            //       oasisImg,
            //       x * tileSize,
            //       y * tileSize,
            //       tileSize,
            //       tileSize
            //     );
            //     break;
            //   case "desert":
            //     p.image(
            //       desertImg,
            //       x * tileSize,
            //       y * tileSize,
            //       tileSize,
            //       tileSize
            //     );
            //     break;
            //   case "forest":
            //     p.image(
            //       forestImg,
            //       x * tileSize,
            //       y * tileSize,
            //       tileSize,
            //       tileSize
            //     );
            //     break;
            //   case "grassland":
            //     p.image(
            //       grasslandImg,
            //       x * tileSize,
            //       y * tileSize,
            //       tileSize,
            //       tileSize
            //     );
            //     break;
            //   case "tundra":
            //     p.image(
            //       tundraImg,
            //       x * tileSize,
            //       y * tileSize,
            //       tileSize,
            //       tileSize
            //     );
            //     break;
            //   default:
            //     // Handle unknown tile types if necessary
            //     break;
            // }
          }
        }
        // Draw titan tokens
        titans?.forEach(({ titanName, row, col }) => {
          let img;
          switch (titanName) {
            case "Fire Titan":
              img = fireTitanImg;
              break;
            case "Ice Titan":
              img = iceTitanImg;
              break;
            case "Stone Titan":
              img = stoneTitanImg;
              break;
            case "Storm Titan":
              img = stormTitanImg;
              break;
            // Add cases for other titans as needed
          }
          if (img) {
            p.image(img, col * tileSize, row * tileSize, tileSize, tileSize);
          }
        });
        // Inside p.draw function
        players?.forEach((player) => {
          if (player.strongHold) {
            let strongholdImg =
              player.username === "Player1" ? stronghold1Img : stronghold2Img;
            p.image(
              strongholdImg,
              player.strongHold.col * tileSize,
              player.strongHold.row * tileSize,
              tileSize,
              tileSize
            );
          }
        });
      };
    };

    let myp5 = new p5(sketch);

    // Handle clicking on a tile
    const handleClick = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouseCoords.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        handleTileSelection();
      }
    };
    if (canvasRef.current) {
      canvasRef.current.addEventListener("click", handleClick);
    }

    return () => {
      if (myp5) {
        myp5.remove();
      }
      if (canvasRef.current) {
        // Remove the event listener when the component unmounts
        canvasRef.current.removeEventListener("click", handleTileSelection);
      }
    };
  }, [tileGrid, showTileDetails, titans]);

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
    for (let titan of titans ?? []) {
      const distance = calculateDistance(x, y, titan.col, titan.row);
      if (distance <= 6) {
        return false; // Too close to a titan
      }
    }
    for (let player of players ?? []) {
      const distance = calculateDistance(x, y, player.col, player.row);
      if (distance <= 6) {
        return false; // Too close to a player
      }
    }

    return true; // Valid placement
  };

  // Check if stronghold is placed and if cuurrent player turn
  useEffect(() => {
    if (
      gameState?.gameState.currentPhase === "Setup" &&
      currentPlayer?.username === gameState?.gameState.currentPlayerTurn
    ) {
      setIsStrongholdPlacementMode(true);
    } else {
      setIsStrongholdPlacementMode(false);
    }
  }, [gameState, currentPlayer]);

  // Handle Selected tile
  const handleTileSelection = () => {
    if (!tileGrid) return;

    const xIndex = Math.floor(mouseCoords.current.x / tileSize);
    const yIndex = Math.floor(mouseCoords.current.y / tileSize);

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
      // Perform any additional error handling here
      return;
    }
    // Check for a titan on the tile
    const titanOnTile =
      titans?.find((titan) => titan.row === y && titan.col === x) || null;
    let titanImageUrl = "";
    if (titanOnTile) {
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

    // Handle stronghold placement if in 'Setup' phase
    if (gameState?.gameState.currentPhase === "Setup" && currentPlayer) {
      if (isValidStrongholdPlacement(x, y)) {
        // Update the stronghold position
        const updatedPlayer = {
          ...currentPlayer,
          strongHold: { col: x, row: y },
        };

        // Emit the updated game state
        const updatedGameState = {
          ...gameState,
          players: players?.map((p) =>
            p.username === updatedPlayer.username ? updatedPlayer : p
          ),
        };
        emitGameStateUpdate(updatedGameState);
      } else {
        alert("Invalid stronghold placement.");
        return
      }
    }
    setSelectedTile({
      type: tileType,
      x,
      y,
      image: imageSrc,
      monsterBonuses: monsterBonuses,
      buildingBonuses: buildingBonuses,
      titan: titanOnTile, // set the titan if found
      titanImage: titanOnTile ? getTitanImageUrl(titanOnTile.titanName) : "",
    });
    setShowTileDetails(true);
  };
  // Get titan images
  const getTitanImageUrl = (titanName: any) => {
    switch (titanName) {
      case "Fire Titan":
        return fireTitanToken;
      case "Ice Titan":
        return iceTitanToken;
      case "Stone Titan":
        return stoneTitanToken;
      case "Storm Titan":
        return stormTitanToken;
      default:
        return "";
    }
  };
  // Place stronghold
  const placeStronghold = () => {
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
      const updatedGameState = {
        ...gameState,
        players: players?.map((p) =>
          p.username === updatedPlayer.username ? updatedPlayer : p
        ),
      };
      emitGameStateUpdate(updatedGameState);
      setShowStrongholdConfirmation(false);
      // setStrongholdPlaced(true)
    }
  };

  return (
    <>
      <div className="canvasWrapper">
        <div className="canvasContianer">
          <div ref={canvasRef}></div>
        </div>
      </div>

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
          <TileMenuDetails
            selectedTile={selectedTile}
            showTileDetails={showTileDetails}
            setShowTileDetails={setShowTileDetails}
            isStrongholdPlacementMode={isStrongholdPlacementMode}
            placeStronghold={placeStronghold}
            currentPlayer={currentPlayer}
            strongholdCoordinates={selectedStrongholdCoordinates}
          />

          <IonButton onClick={() => setShowTileDetails(false)}>Close</IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default GameBoard;
