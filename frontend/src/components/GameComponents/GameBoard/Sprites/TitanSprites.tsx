import { TitanPosition } from "../../Interfaces";

class TitanSprites {
  scene: Phaser.Scene;
  titans: Map<string, Phaser.GameObjects.Sprite>;
  tileSize: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.titans = new Map();
    this.tileSize = 30;
  }

  addTitan(titan: TitanPosition, spriteKey: string) {
    console.log("From addtitan titan:", titan)
    console.log("From addtitan spriteKey:", spriteKey)
    // Calculate position based on tileSize
    const spriteX = titan.x * this.tileSize;
    const spriteY = titan.y * this.tileSize;

    const sprite = this.scene.add.sprite(spriteX, spriteY, spriteKey);
    sprite.setOrigin(0, 0); // Set origin to top-left

    // Scale sprite
    const originalWidth = sprite.displayWidth;
    const originalHeight = sprite.displayHeight;
    const scaleX = this.tileSize / originalWidth;
    const scaleY = this.tileSize / originalHeight;
    sprite.setScale(scaleX, scaleY);

    this.titans.set(titan.titanName, sprite);
  }

  updateTitan(titan: TitanPosition) {
    const sprite = this.titans.get(titan.titanName);
    if (sprite) {
      // Update position based on tileSize
      sprite.x = titan.x * this.tileSize;
      sprite.y = titan.y * this.tileSize;

      // If titan size can change, update scale here as well
      // (assuming you have a way to determine if the size changed)
    }
  }
}

export default TitanSprites;
