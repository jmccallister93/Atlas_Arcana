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
    const sprite = this.scene.add.sprite(titan.x, titan.y, spriteKey);
    this.titans.set(titan.titanName, sprite);
  }

  updateTitan(titan: TitanPosition) {
    const sprite = this.titans.get(titan.titanName);
    if (sprite) {
      sprite.x = titan.x;
      sprite.y = titan.y;
      // Update other properties as needed
    }
  }
}

export default TitanSprites;
