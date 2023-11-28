import React, { useRef, useEffect, useState } from "react";
import p5, { Renderer, Image } from "p5";

import desert from "../../../assets/images/GameTiles/desertTile.png";
import forest from "../../../assets/images/GameTiles/forestTile.png";
import grassland from "../../../assets/images/GameTiles/grasslandTile.png";
import tundra from "../../../assets/images/GameTiles/tundraTile.png";
import oasis from "../../../assets/images/GameTiles/oasisTile.png";

const GameBoard: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState(Math.random() * 1000);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [tileSizing, setTileSizing] = useState(60);


  // Set ReRender
  const rerender = () => {
    setSeed(Math.random() * 1000);
  };

  // Main UseEffect
  useEffect(() => {
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
        for (let x = 0; x * tileSize < width; x++) {
          for (let y = 0; y * tileSize < height; y++) {
            const randVal = p.random();

            if (randVal < 0.05) {
              p.image(oasisImg, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (randVal < 0.25) {
              p.image(
                desertImg,
                x * tileSize,
                y * tileSize,
                tileSize,
                tileSize
              );
            } else if (randVal < 0.5) {
              p.image(grasslandImg, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (randVal < 0.75) {
              p.image(
                tundraImg,
                x * tileSize,
                y * tileSize,
                tileSize,
                tileSize
              );
            } else if (randVal < 1) {
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
    }
  }, [seed, width, height, tileSizing]);

  return (
    <div className="canvasWrapper">
      <div className="canvasContianer">
        <div ref={canvasRef}></div>
      </div>
    </div>
  );
};

export default GameBoard;
