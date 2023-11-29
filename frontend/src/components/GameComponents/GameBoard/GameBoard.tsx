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

  console.log("From Game board seed:", seed);
  // Update seed when gameSessionInfo changes
  useEffect(() => {
    if (gameSessionInfo?.gameState.gameBoardSeed !== undefined) {
      setSeed(gameSessionInfo.gameState.gameBoardSeed);
    }
  }, [gameSessionInfo]);

  // Main UseEffect
  useEffect(() => {
    if (seed === null) return;
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
        p.noiseSeed(seed);
      };

      // Draw everything
      p.draw = () => {
        p.background(255);

        const tileSize = tileSizing;

        let sequenceIndex = 0; // Index to track the current position in the random sequence
        const randomSequence = gameSessionInfo?.gameState.randomSequence ?? [];
        const sequenceLength = randomSequence.length;
        console.log(randomSequence)
        for (let x = 0; x * tileSize < width; x++) {
          for (let y = 0; y * tileSize < height; y++) {
            if (sequenceIndex >= sequenceLength) {
              sequenceIndex = 0; // Reset the index if it goes beyond the array length
            }

            const noiseValue = randomSequence[sequenceIndex++];

            if (noiseValue < 0.05) {
              p.image(oasisImg, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (noiseValue < 0.25) {
              p.image(
                desertImg,
                x * tileSize,
                y * tileSize,
                tileSize,
                tileSize
              );
            } else if (noiseValue < 0.5) {
              p.image(
                grasslandImg,
                x * tileSize,
                y * tileSize,
                tileSize,
                tileSize
              );
            } else if (noiseValue < 0.75) {
              p.image(
                tundraImg,
                x * tileSize,
                y * tileSize,
                tileSize,
                tileSize
              );
            } else if (noiseValue < 1) {
              p.image(
                forestImg,
                x * tileSize,
                y * tileSize,
                tileSize,
                tileSize
              );
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
  }, [seed]);

  return (
    <div className="canvasWrapper">
      <div className="canvasContianer">
        <div ref={canvasRef}></div>
      </div>
    </div>
  );
};

export default GameBoard;
