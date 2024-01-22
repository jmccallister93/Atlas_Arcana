import { StrongholdPosition } from "../../Interfaces";

class StrongholdSprites {
  scene: Phaser.Scene;
  strongholds: Map<string, Phaser.GameObjects.Sprite>;
  tileSize: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.strongholds = new Map();
    this.tileSize = 30;
  }

  addStronghold(stronghold: StrongholdPosition, spriteKey: string) {
    const spriteX = stronghold.x * this.tileSize;
    const spriteY = stronghold.y * this.tileSize;

    // Check if stronghold already exists, update its position if it does
    if (this.strongholds.has(stronghold.playerUsername)) {
      const existingSprite = this.strongholds.get(stronghold.playerUsername);
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

      this.strongholds.set(stronghold.playerUsername, sprite);
  }
  }
  
}

export default StrongholdSprites;
