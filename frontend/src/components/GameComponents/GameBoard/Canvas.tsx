import React, { useRef, useEffect, useState } from "react";
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

import playerToken1 from "./GameTiles/token1.png";
import playerToken2 from "./GameTiles/token2.png";
import playerToken3 from "./GameTiles/token3.png";
import playerToken4 from "./GameTiles/token4.png";

import {
  BuildingPosition,
  PlayerInfo,
  PlayerPosition,
  StrongholdPosition,
  TitanInfo,
  TitanPosition,
} from "../Interfaces";

import "./GameBoard.scss";
import {
  useGameContext,
  useGameStatePart,
} from "../../../context/GameContext/GameContext";
import StrongholdSprites from "./Sprites/StrongholdSprites";
import PlayerSprites from "./Sprites/PlayerSprites";
import TitanSprites from "./Sprites/TitanSprites";
import BuildingSprites from "./Sprites/BuildingSprites";

interface CanvasProps {
  handleTileSelection: (x: number, y: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ handleTileSelection }) => {
  // const { gameState } = useGameContext();

  const playerStats = useGameStatePart(
    (state) => state.players as PlayerInfo[]
  );
  const players = useGameStatePart(
    (state) => state.playerPositions as PlayerPosition[]
  );
  const strongholds = useGameStatePart(
    (state) => state.strongholdPositions as StrongholdPosition[]
  );
  const titans = useGameStatePart(
    (state) => state.titanPositions as TitanPosition[]
  );
  const buildings = useGameStatePart(
    (state) => state.buildingPositions as BuildingPosition[]
  );
  const tileGrid = useGameStatePart((state) => state.tileGrid as string[][]);
  const gameRef = useRef<HTMLDivElement>(null);

  const tileSize = 30;
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  let playerSprites: PlayerSprites;
  let titanSprites: TitanSprites;
  let buildingSprites: BuildingSprites;
  const strongholdSpritesRef = useRef<StrongholdSprites | null>(null);
  const titanSpritesRef = useRef<TitanSprites | null>(null);
  const playerSpritesRef = useRef<PlayerSprites | null>(null);
  const buildingSpritesRef = useRef<BuildingSprites | null>(null);

  const currentPlayer = useGameStatePart((state) => state.currentPlayerTurn);
  const gamePhase = useGameStatePart((state) => state.currentPhase);

  useEffect(() => {}, [gamePhase]);

  // Initialize phaser game
  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
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

      phaserGameRef.current = new Phaser.Game(config);
    }
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  // Updates
  useEffect(() => {
    if (phaserGameRef) {
      if (strongholds) {
        strongholds.forEach((stronghold, index) => {
          // Define the array of keys
          let strongholdKeys = [
            "stronghold1",
            "stronghold2",
            "stronghold3",
            "stronghold4",
          ];

          // Use the index to cycle through the keys
          let keyIndex = index % strongholdKeys.length;
          let strongholdKey = strongholdKeys[keyIndex];

          (strongholdSpritesRef.current as StrongholdSprites).addStronghold(
            stronghold,
            strongholdKey
          );
        });

        if (players) {
          players.forEach((player, index) => {
            // Define the array of keys
            let playerKeys = [
              "playerToken1",
              "playerToken2",
              "playerToken3",
              "playerToken4",
            ];

            // Use the index to cycle through the keys
            let keyIndex = index % playerKeys.length;
            let playerKey = playerKeys[keyIndex];

            (playerSpritesRef.current as PlayerSprites).addPlayer(
              player,
              playerKey
            );
          });
        }
        // if (buildings) {
        //   buildings.forEach((building, index) => {
        //     // Define the array of keys
        //     let buildingKeys = [
        //       // "playerToken1",
        //       // "playerToken2",
        //       // "playerToken3",
        //       // "playerToken4",
        //     ];

        //     // Use the index to cycle through the keys
        //     let keyIndex = index % buildingKeys.length;
        //     let buildingKey = buildingKeys[keyIndex];

        //     (buildingSpritesRef.current as BuildingSprites).addBuilding(
        //       building,
        //       buildingKey
        //     );
        //   });
        // }
      }
    }
  }, [strongholds, players]);

  //Preload
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
    this.load.image("playerToken1", playerToken1);
    this.load.image("playerToken2", playerToken2);
    this.load.image("playerToken3", playerToken3);
    this.load.image("playerToken4", playerToken4);
  }

  //Create
  function create(this: Phaser.Scene) {
    const graphics = this.add.graphics(); // Create a new Graphics object
    strongholdSpritesRef.current = new StrongholdSprites(this);
    titanSpritesRef.current = new TitanSprites(this);
    playerSpritesRef.current = new PlayerSprites(this);

    const tileTypeToColor: { [key: string]: string } = {
      forest: "#095300", // Dark Green
      desert: "#F9DA70", // Sandy Color
      oasis: "#005fcc", // Dark Turquoise
      tundra: "#D9D9D9", // Silver
      grassland: "#00BC53", // Lime Green
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

    const titanNameToImageKey: { [key: string]: string } = {
      "Fire Titan": "fireTitan",
      "Ice Titan": "iceTitan",
      "Stone Titan": "stoneTitan",
      "Storm Titan": "stormTitan",
    };

    // Initialize titans
    if (titans) {
      titans.forEach((titan) => {
        const titanImageKey = titanNameToImageKey[titan.titanName];
        titanSpritesRef.current?.addTitan(titan, titanImageKey);
      });
    }

    // Initialize strongholds
    if (strongholds) {
      strongholds.forEach((stronghold, index) => {
        const strongholdKey = `stronghold${(index % 4) + 1}`;
        (strongholdSpritesRef.current as StrongholdSprites).addStronghold(
          stronghold,
          strongholdKey
        );
      });
    }

    // Initialize players
    if (players) {
      players.forEach((player, index) => {
        const playerKey = `player${(index % 4) + 1}`;
        (playerSpritesRef.current as PlayerSprites).addPlayer(
          player,
          playerKey
        );
      });
    }

    // Initialize buildings
    // if (buildings){
    //   buildings.forEach((building, index)=> {
    //     const buildingKey = `building${(index % 4) + 1}`;
    //     (buildingSpritesRef.current as BuildingSprites).addBuilding(
    //       building,
    //       buildingKey
    //     )
    //   })
    // }


    // Mouse events
    let isDragging = false;
    let dragStartX = this.cameras.main.scrollX;
    let dragStartY = this.cameras.main.scrollY;
    let pointerDownTime = 0;
    const clickThreshold = 200; // Time in milliseconds, e.g., 200ms
    const movementThreshold = 50; // Movement in pixels, e.g., 10px
    // Define initial zoom level
    let zoomLevel = 1;
    let initialDistance = 0;
    let isPointerDown = false;
    const sceneCenterX = (this.game.config.width as number) / 2;
    const sceneCenterY = (this.game.config.height as number) / 2;

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      // Update dragStartX and dragStartY on pointer down
      dragStartX = pointer.x + this.cameras.main.scrollX;
      dragStartY = pointer.y + this.cameras.main.scrollY;
      pointerDownTime = this.time.now;
      isDragging = false;
      isPointerDown = true;
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!isDragging && isPointerDown) {
        if (
          this.time.now - pointerDownTime > clickThreshold ||
          Math.abs(pointer.x - (dragStartX - this.cameras.main.scrollX)) >
            movementThreshold ||
          Math.abs(pointer.y - (dragStartY - this.cameras.main.scrollY)) >
            movementThreshold
        ) {
          isDragging = true;
          // Dragging logic: Adjust camera scroll based on pointer movement
          this.cameras.main.scrollX = dragStartX - pointer.x;
          this.cameras.main.scrollY = dragStartY - pointer.y;
        }
      }
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!isDragging && this.time.now - pointerDownTime < clickThreshold) {
        // Quick click logic: Calculate the correct tile indices based on pointer position
        const xIndex = Math.floor(
          (pointer.x - this.cameras.main.scrollX) / tileSize
        );
        const yIndex = Math.floor(
          (pointer.y - this.cameras.main.scrollY) / tileSize
        );
        handleTileSelection(xIndex, yIndex);
      }
      isDragging = false;
      isPointerDown = false;
    });
    // Add zoom in/out controls
    this.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        gameObjects: Phaser.GameObjects.GameObject[],
        deltaX: number,
        deltaY: number,
        deltaZ: number
      ) => {
        const oldZoom = zoomLevel;

        // Adjust zoom level based on scroll wheel, clamping between 1 and your max zoom level
        zoomLevel += deltaY * -0.001;
        zoomLevel = Phaser.Math.Clamp(zoomLevel, 1, 10);
        this.cameras.main.setZoom(zoomLevel);

        if (zoomLevel === 1) {
          // Center the camera when zoomed out fully
          this.cameras.main.centerOn(sceneCenterX, sceneCenterY);
        } else if (oldZoom !== zoomLevel) {
          // Adjust the camera position to zoom towards the pointer position
          const offsetX = (pointer.x - this.cameras.main.width / 2) / oldZoom;
          const offsetY = (pointer.y - this.cameras.main.height / 2) / oldZoom;
          this.cameras.main.scrollX += offsetX * (1 - 1 / zoomLevel);
          this.cameras.main.scrollY += offsetY * (1 - 1 / zoomLevel);
        }
      }
    );
  }

  return (
    <div className="canvasWrapper">
      <div ref={gameRef}></div>
    </div>
  );
};

export default React.memo(Canvas);
