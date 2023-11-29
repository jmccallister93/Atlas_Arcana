import React, { useRef, useEffect, useState } from "react";
import p5, { Image } from "p5";

import {
  EquipmentItem,
  QuestItem,
  TreasureItem,
  GameSessionInfo,
  PlayerInfo,
} from "../Interfaces";

import desert from "./GameTiles/desertTile.png";
import forest from "./GameTiles/forestTile.png";
import grassland from "./GameTiles/grasslandTile.png";
import tundra from "./GameTiles/tundraTile.png";
import oasis from "./GameTiles/oasisTile.png";
import { IonButton, IonContent, IonModal } from "@ionic/react";

interface GameBoardProps {
  gameSessionInfo?: GameSessionInfo;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameSessionInfo }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [tileSize, setTileSize] = useState(60);
  interface TileInfo {
    type: string;
    x: number;
    y: number;
  }

  const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
  const [showTileDetails, setShowTileDetails] = useState(false);

  // Main UseEffect
  useEffect(() => {
    if (!gameSessionInfo || !gameSessionInfo.gameState.tileGrid) return;
    const sketch = (p: p5) => {
      let desertImg: Image,
        forestImg: Image,
        grasslandImg: Image,
        tundraImg: Image,
        oasisImg: Image;

      //   Preload images
      p.preload = () => {
        desertImg = p.loadImage(desert);
        forestImg = p.loadImage(forest);
        grasslandImg = p.loadImage(grassland);
        tundraImg = p.loadImage(tundra);
        oasisImg = p.loadImage(oasis);
      };

      // Setup canvas
      p.setup = () => {
        p.createCanvas(width, height);
        p.noLoop();
      };

      // Draw everything
      p.draw = () => {
        p.background(255);
        const tileGrid = gameSessionInfo.gameState.tileGrid;

        for (let x = 0; x < 18; x++) {
          for (let y = 0; y < 18; y++) {
            let tileType = tileGrid[x + y * 18]; // Calculate the index correctly

            switch (tileType) {
              case "oasis":
                p.image(
                  oasisImg,
                  x * tileSize,
                  y * tileSize,
                  tileSize,
                  tileSize
                );
                break;
              case "desert":
                p.image(
                  desertImg,
                  x * tileSize,
                  y * tileSize,
                  tileSize,
                  tileSize
                );
                break;
              case "forest":
                p.image(
                  forestImg,
                  x * tileSize,
                  y * tileSize,
                  tileSize,
                  tileSize
                );
                break;
              case "grassland":
                p.image(
                  grasslandImg,
                  x * tileSize,
                  y * tileSize,
                  tileSize,
                  tileSize
                );
                break;
              case "tundra":
                p.image(
                  tundraImg,
                  x * tileSize,
                  y * tileSize,
                  tileSize,
                  tileSize
                );
                break;
              default:
                // Handle unknown tile types if necessary
                break;
            }
          }
        }
      };
      // Inside your sketch function

      p.mousePressed = () => {
        let xIndex = Math.floor(p.mouseX / tileSize);
        let yIndex = Math.floor(p.mouseY / tileSize);
        if (xIndex < 18 && yIndex < 18) {
          const tileIndex = xIndex + yIndex * 18;
          const tileType = gameSessionInfo.gameState.tileGrid[tileIndex];
          // Function to set the state in React component
          onTileSelect(tileType, xIndex, yIndex);
        }
      };
    };

    let myp5: p5 | null = null;
    if (canvasRef.current) {
      myp5 = new p5(sketch, canvasRef.current);
    }
    return () => {
      if (myp5) {
        myp5.remove();
      }
    };
  }, [gameSessionInfo]);

  const onTileSelect = (tileType: string, x: number, y: number) => {
    setSelectedTile({ type: tileType, x, y });
    setShowTileDetails(true);
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
          <h2>Tile Details</h2>
          {selectedTile && (
            <>
              <p>Type: {selectedTile.type}</p>
              <p>
                Coordinates: ({selectedTile.x}, {selectedTile.y})
              </p>
              {/* Display additional details like bonuses here */}
            </>
          )}
          <IonButton onClick={() => setShowTileDetails(false)}>Close</IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default GameBoard;
