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
import fireTitanToken from "../Titans/Tokens/fire_titan_token.png";
import iceTitanToken from "../Titans/Tokens/ice_titan_token.png";
import stoneTitanToken from "../Titans/Tokens/stone_titan_token.png";
import stormTitanToken from "../Titans/Tokens/storm_titan_token.png";
import { PlayerInfo, TitanInfo } from "../Interfaces";
import { TileCoordinate } from "./GameBoard";

interface BackgroundCanvasProps {
  tileGrid: string[];
  titans: TitanInfo[]; // Replace with the correct type for titans
  players: PlayerInfo[];
  tileSize: number;
  handleTileSelection: (x: number, y: number) => void;
}


const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  tileGrid,
  titans,
  players,
  tileSize,
  handleTileSelection,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [height, setHeight] = useState(720);
  const mouseCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const sketch = (p: p5) => {
      let desertImg: Image,
        forestImg: Image,
        grasslandImg: Image,
        tundraImg: Image,
        oasisImg: Image,
        fireTitanImg: Image,
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

        players.forEach((player, index) => {
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

      // Modified handleClick function
      const handleClick = (e: MouseEvent) => {
        if (
          p.mouseX >= 0 &&
          p.mouseX < p.width &&
          p.mouseY >= 0 &&
          p.mouseY < p.height
        ) {
          const xIndex = Math.floor(p.mouseX / tileSize);
          const yIndex = Math.floor(p.mouseY / tileSize);
          handleTileSelection(xIndex, yIndex);
        }
      };

      if (canvasRef.current) {
        canvasRef.current.addEventListener("click", handleClick);
      }
    };
    let myp5: any;
    if (canvasRef.current) {
      myp5 = new p5(sketch, canvasRef.current);
    }

    return () => {
      if (myp5) {
        myp5.remove(); // This removes the existing sketch
      }
    };
  }, [tileGrid, titans, players, tileSize, handleTileSelection]);

  return <div ref={canvasRef}></div>;
};

export default BackgroundCanvas;
