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
import { IonButton, IonContent, IonIcon, IonModal } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

import "./GameBoard.scss";

interface GameBoardProps {
  tileGrid?: string[];
}

const GameBoard: React.FC<GameBoardProps> = ({ tileGrid }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [tileSize, setTileSize] = useState(60);
  interface TileInfo {
    type: string;
    x: number;
    y: number;
    image: string;
    monsterBonuses: string;
    buildingBonuses: string;
    // buildings: string[];
    // players: string[];
    // titans: string[];
  }

  const [selectedTile, setSelectedTile] = useState<TileInfo | null>(null);
  const [showTileDetails, setShowTileDetails] = useState(false);

  // Main UseEffect
  useEffect(() => {
    if (!tileGrid) return;
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
        if (showTileDetails) {
          // If the modal is open, don't register new clicks
          return;
        }

        // Check if the click is within the game board boundaries
        if (
          p.mouseX >= 0 &&
          p.mouseX <= width &&
          p.mouseY >= 0 &&
          p.mouseY <= height
        ) {
          let xIndex = Math.floor(p.mouseX / tileSize);
          let yIndex = Math.floor(p.mouseY / tileSize);
          if (xIndex < 18 && yIndex < 18) {
            const tileIndex = xIndex + yIndex * 18;
            const tileType = tileGrid[tileIndex];
            // Function to set the state in React component
            onTileSelect(tileType, xIndex, yIndex);
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
  }, [tileGrid, showTileDetails]);

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
    setSelectedTile({
      type: tileType,
      x,
      y,
      image: imageSrc,
      monsterBonuses: monsterBonuses,
      buildingBonuses: buildingBonuses,
    });
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
          <div className="modalHeader">
            <h2>Tile Details</h2>
            <button
              className="closeButton"
              onClick={() => setShowTileDetails(false)}
            >
              <IonIcon icon={closeOutline} />
            </button>
          </div>
          {selectedTile && (
            <>
              <img
                src={selectedTile.image}
                alt={selectedTile.type}
                style={{ maxWidth: "45%" }}
              />
              <p>
                <b>Type:</b> {selectedTile.type}
              </p>

              <p>
                <b>Coordinates:</b> (X: {selectedTile.x}, Y: {selectedTile.y})
              </p>
              <p>
                <b>Building Bonuses:</b> {selectedTile.buildingBonuses}
              </p>
              <p>
                <b>Monster Bonuses:</b> {selectedTile.monsterBonuses}
              </p>
            </>
          )}
          <IonButton onClick={() => setShowTileDetails(false)}>Close</IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default GameBoard;
