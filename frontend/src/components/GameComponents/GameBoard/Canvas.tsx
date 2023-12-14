import React, { useRef, useEffect } from "react";
import Phaser from "phaser";
import p5, { Image } from "p5";
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
import { PlayerInfo, TitanInfo } from "../Interfaces";

import "./GameBoard.scss";

interface CanvasProps {
  tileGrid: string[][];
  titans: TitanInfo[];
  players: PlayerInfo[];
  handleTileSelection: (x: number, y: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  tileGrid,
  titans,
  players,
  handleTileSelection,
}) => {
  // console.log("Canvas Rendered")
  const gameRef = useRef<HTMLDivElement>(null);
  const tileSize = 30
  let game: Phaser.Game;

  useEffect(() => {
    if (gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 720,
        height: 720,
        parent: gameRef.current,
        scene: {
          preload: preload,
          create: create,
        },
      };

      game = new Phaser.Game(config);

      function preload(this: Phaser.Scene) {
        this.load.image("desert", desert);
        this.load.image("forest", forest);
        this.load.image("grassland", grassland);
        this.load.image("tundra", tundra);
        this.load.image("oasis", oasis);
        this.load.image("fireTitan", fireTitanToken);
        this.load.image("iceTitan", iceTitanToken);
        this.load.image("stoneTitan", stoneTitanToken);
        this.load.image("stormTitan", stormTitanToken);
        this.load.image("stronghold1", stronghold1);
        this.load.image("stronghold2", stronghold2);
        this.load.image("stronghold3", stronghold3);
        this.load.image("stronghold4", stronghold4);
      }

      function create(this: Phaser.Scene) {
        const graphics = this.add.graphics(); // Create a new Graphics object

        const tileTypeToColor: { [key: string]: string } = {
          forest: "#095300", // Dark Green
          desert: "#F9DA70", // Sandy Color
          oasis: "#005fcc", // Dark Turquoise
          tundra: "#D9D9D9", // Silver
          grassland: "#00BC53", // Lime Green
        };

        interface TitanImageKeys {
            [key: string]: string;
          }
          
          const titanNameToImageKey: { [key: string]: string } = {
            "Fire Titan": "fireTitan",
            "Ice Titan": "iceTitan",
            "Stone Titan": "stoneTitan",
            "Storm Titan": "stormTitan",
          };

        // Tile Grid
        tileGrid.forEach((row: string[], rowIndex: number) => {
          row.forEach((tileType: string, colIndex: number) => {
            const color = Phaser.Display.Color.HexStringToColor(
              tileTypeToColor[tileType] || "#FFFFFF"
            );
            graphics.fillStyle(color.color, 1); // Set the fill color for the tile
            graphics.fillRect(
              rowIndex * tileSize,
              colIndex * tileSize,
              tileSize,
              tileSize
            ); // Draw the filled rectangle

            graphics.lineStyle(2, 0x000000, 1); // Set the line style for the border
            graphics.strokeRect(
                rowIndex * tileSize,
                colIndex * tileSize,
              tileSize,
              tileSize
            ); // Draw the border
          });
        });

        // Titans
        titans.forEach(titan => {
            const titanImageKey = titanNameToImageKey[titan.titanName];
            if (titanImageKey) {
              
              this.add.sprite(
                titan.row * tileSize,
                titan.col * tileSize,
                titanImageKey
              ).setDisplaySize(tileSize, tileSize).setOrigin(0,0);
            }
          });
        // Strongholds
        players.forEach((player, index) => {
          if (player.strongHold) {
            const strongholdKey = `stronghold${(index % 4) + 1}`; // Cycle through stronghold images
            this.add
              .sprite(
                player.strongHold.col * tileSize,
                player.strongHold.row * tileSize,
                strongholdKey
              )
              .setDisplaySize(tileSize, tileSize).setOrigin(0,0); // Add the stronghold sprite
          }
        });

        // Mouse click
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            // Calculate the correct tile indices based on pointer position
            const xIndex = Math.floor((pointer.x - this.cameras.main.scrollX) / tileSize);
            const yIndex = Math.floor((pointer.y - this.cameras.main.scrollY) / tileSize);
          
            handleTileSelection(xIndex, yIndex);
          });
          
      }
    }
    return () => {
      game.destroy(true);
    };
  }, [tileGrid, tileSize, handleTileSelection]);

  return <div className="canvasWrapper"><div ref={gameRef} ></div></div>;
};

export default Canvas;
