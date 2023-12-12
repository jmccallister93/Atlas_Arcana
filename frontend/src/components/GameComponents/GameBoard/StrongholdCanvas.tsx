import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { PlayerInfo } from "../Interfaces";
import stronghold1 from "./GameTiles/stronghold1.png";
import stronghold2 from "./GameTiles/stronghold2.png";
import stronghold3 from "./GameTiles/stronghold3.png";
import stronghold4 from "./GameTiles/stronghold4.png";

interface StrongholdCanvasProps {
  players: PlayerInfo[];
  tileSize: number;
  onStrongholdPlaced: (x: number, y: number) => void;
}

const StrongholdCanvas: React.FC<StrongholdCanvasProps> = ({
  players,
  tileSize,
  onStrongholdPlaced
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let strongholdImages: p5.Image[] = [];

      p.preload = () => {
        strongholdImages.push(p.loadImage(stronghold1));
        strongholdImages.push(p.loadImage(stronghold2));
        strongholdImages.push(p.loadImage(stronghold3));
        strongholdImages.push(p.loadImage(stronghold4));
      };

      p.setup = () => {
        const canvas = p.createCanvas(720, 720); // Adjust size as needed
        p.noLoop();
        if (canvasRef.current) {
          canvas.parent(canvasRef.current);
        }
      };

      p.draw = () => {
        p.clear(0, 0, 0, 0);
        players.forEach((player, index) => {
            if (player.strongHold) {
              const strongholdImg = strongholdImages[index % strongholdImages.length];
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

      // Add mouse click event listener if needed
      p.mouseClicked = () => {
        if (p.mouseX >= 0 && p.mouseX < p.width && p.mouseY >= 0 && p.mouseY < p.height) {
          const x = Math.floor(p.mouseX / tileSize);
          const y = Math.floor(p.mouseY / tileSize);
          onStrongholdPlaced(x, y); // Callback for placing a stronghold
        }
      };
    };

    let myp5 = new p5(sketch);

    return () => {
      myp5.remove();
    };
  }, [players, tileSize, onStrongholdPlaced]);

  return <div ref={canvasRef} className="strongholdCanvas"></div>;
};

export default StrongholdCanvas;
