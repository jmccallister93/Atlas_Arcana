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

interface GameBoardProps {
  // gameState?: GameSessionInfo;
  currentPlayer: PlayerInfo | undefined;
  currentPlayerTurn: string | undefined;
  hasSetupCompleted: boolean;
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
  // gameState,
  currentPlayer,
  currentPlayerTurn,
  hasSetupCompleted,
}) => {
  interface TileInfo {
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
  const mouseCoords = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [width, setWidth] = useState(720);
  const [height, setHeight] = useState(720);
  const [tileSize, setTileSize] = useState(30);

  const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
  const [showTileDetails, setShowTileDetails] = useState(false);
  const [isStrongholdPlacementMode, setIsStrongholdPlacementMode] =
    useState(false);
  const [selectedStrongholdCoordinates, setSelectedStrongholdCoordinates] =
    useState({ x: 0, y: 0 });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
        stronghold2Img: Image,
        stronghold3Img: Image,
        stronghold4Img: Image;

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
        stronghold3Img = p.loadImage(stronghold3);
        stronghold4Img = p.loadImage(stronghold4);
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

        // Draw player strongholds
        const strongholdImages = [
          stronghold1Img,
          stronghold2Img,
          stronghold3Img,
          stronghold4Img,
        ];

        players?.forEach((player, index) => {
          if (player.strongHold) {
            let strongholdImg =
              strongholdImages[index % strongholdImages.length];
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
        canvasRef.current.removeEventListener("click", handleClick);
      }
    };
  }, [tileGrid, titans]);

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
    for (let player of players ?? []) {
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
    if (
      !hasSetupCompleted &&
      currentPlayer?.username === currentPlayerTurn
    ) {
      setIsStrongholdPlacementMode(true);
    } else {
      setIsStrongholdPlacementMode(false);
    }
  }, [currentPlayer]);

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
    players?.forEach((player) => {
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
    console.log("Selected Stronghold x",selectedStrongholdCoordinates.x,
    "Selected Stronghold y", selectedStrongholdCoordinates.y,
    "Selected Tile", selectedTile,
    "currentPlayer:", currentPlayer
    );
    if (
      currentPlayer 
      && isValidStrongholdPlacement(
        selectedStrongholdCoordinates.x,
        selectedStrongholdCoordinates.y
      )
    ) {
      console.log("Fired")
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
        players: players?.map((p) =>
          p.username === updatedPlayer.username ? updatedPlayer : p
        ),
      };
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
          />

          <IonButton onClick={() => setShowTileDetails(false)}>Close</IonButton>
        </IonContent>
      </IonModal>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Alert"}
        message={alertMessage}
        buttons={["OK"]}
      />
    </>
  );
};
const areEqual = (prevProps: any, nextProps: any) => {
  if (prevProps.currentPlayer?.username !== nextProps.currentPlayer?.username) {
    return false;  // Re-render if currentPlayer changes
  }
  
  // Compare specific parts of gameState
  if (prevProps.currentPlayerTurn !== nextProps.currentPlayerTurn) {
    return false; // Not equal, should re-render
  }
  if (prevProps.tileGrid !== nextProps.tileGrid) {
    return false;
  }
  if (prevProps.titans !== nextProps.titans) {
    return false; // Not equal, should re-render
  }
  if (prevProps.players !== nextProps.players) {
    return false; // Not equal, should re-render
  }

  return true; // Props are equal, don't re-render
};
export default React.memo(GameBoard, areEqual);
