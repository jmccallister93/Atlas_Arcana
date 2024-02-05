import { BuildingPosition,  } from "../../Interfaces";

class BuildingSprites {
    scene: Phaser.Scene;
    buildings: Map<string, Phaser.GameObjects.Sprite>;
    tileSize: number

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.buildings = new Map();
        this.tileSize = 30
    }


    addBuilding(building: BuildingPosition, spriteKey: string) {
        const spriteX = building.x * this.tileSize;
        const spriteY = building.y * this.tileSize;
    
        // Check if stronghold already exists, update its position if it does
        if (this.buildings.has(building.playerUsername)) {
          const existingSprite = this.buildings.get(building.playerUsername);
          if (existingSprite) {
            existingSprite.x = spriteX;
            existingSprite.y = spriteY;
          }
        } else {
          const sprite = this.scene.add.sprite(spriteX, spriteY, spriteKey);
          sprite.setOrigin(0, 0); // Set origin to top-left
    
          // Assuming you have the original dimensions of the sprite
          const originalWidth = sprite.displayWidth;
          const originalHeight = sprite.displayHeight;
    
          // Calculate scale factors
          const scaleX = this.tileSize / originalWidth;
          const scaleY = this.tileSize / originalHeight;
    
          // Apply scale to sprite
          sprite.setScale(scaleX, scaleY);
    
          this.buildings.set(building.playerUsername, sprite);
        }
      }
}

export default BuildingSprites;