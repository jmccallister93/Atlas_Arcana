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

interface GameBoardProps {
  gameSessionInfo?: GameSessionInfo;

}

const GameBoard: React.FC<GameBoardProps> = ({ gameSessionInfo }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [tileSizing, setTileSizing] = useState(60);




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

        const tileSize = tileSizing;
        const tileGrid = gameSessionInfo.gameState.tileGrid;

        for (let x = 0; x < 18; x++) {
          for (let y = 0; y < 18; y++) {
            let tileType = tileGrid[x + y * 18]; // Calculate the index correctly

            switch (tileType) {
              case 'oasis':
                p.image(oasisImg, x * tileSize, y * tileSize, tileSize, tileSize);
                break;
              case 'desert':
                p.image(desertImg, x * tileSize, y * tileSize, tileSize, tileSize);
                break;
              case 'forest':
                p.image(forestImg, x * tileSize, y * tileSize, tileSize, tileSize);
                break;
              case 'grassland':
                p.image(grasslandImg, x * tileSize, y * tileSize, tileSize, tileSize);
                break;
              case 'tundra':
                p.image(tundraImg, x * tileSize, y * tileSize, tileSize, tileSize);
                break;
              default:
                // Handle unknown tile types if necessary
                break;
            }
          }
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



  return (
    <div className="canvasWrapper">
      <div className="canvasContianer">
        <div ref={canvasRef}></div>
      </div>
    </div>
  );
};

export default GameBoard;
