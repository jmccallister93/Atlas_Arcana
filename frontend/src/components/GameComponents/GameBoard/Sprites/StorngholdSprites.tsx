import { StrongholdPosition } from "../../Interfaces";

class StrongholdSprites {
    scene: Phaser.Scene;
    strongholds: Map<string, Phaser.GameObjects.Sprite>;
    tileSize: number

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.strongholds = new Map();
        this.tileSize = 30
    }

    addStronghold(stronghold: StrongholdPosition, spriteKey: string) {
        const sprite = this.scene.add.sprite(stronghold.x, stronghold.y, spriteKey);
        this.strongholds.set(stronghold.playerUsername, sprite);
    }

    updateStronghold(stronghold: StrongholdPosition) {
        const sprite = this.strongholds.get(stronghold.playerUsername);
        if (sprite) {
          sprite.x = stronghold.x * this.tileSize;
          sprite.y = stronghold.y * this.tileSize;
        }
      }
}

export default StrongholdSprites;