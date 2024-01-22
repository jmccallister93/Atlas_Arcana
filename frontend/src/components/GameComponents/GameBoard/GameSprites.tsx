import { BuildingPosition, PlayerPosition, StrongholdPosition, TitanPosition } from "../Interfaces";

class GameSprites {
    scene: Phaser.Scene;
    strongholds: Map<string, Phaser.GameObjects.Sprite>;
    players: Map<string, Phaser.GameObjects.Sprite>;
    titans: Map<string, Phaser.GameObjects.Sprite>;
    buildings: Map<string, Phaser.GameObjects.Sprite>;
    tileSize: number

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.strongholds = new Map();
        this.players = new Map();
        this.titans = new Map();
        this.buildings = new Map();
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

    addPlayer(player: PlayerPosition, spriteKey: string) {
        const sprite = this.scene.add.sprite(player.x, player.y, spriteKey);
        this.players.set(player.playerUsername, sprite);
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

    addBuilding(building: BuildingPosition, spriteKey: string) {
        const sprite = this.scene.add.sprite(building.x, building.y, spriteKey);
        this.buildings.set(building.buildingName, sprite);
    }

    // Methods to update the position or properties of sprites
    // ...

    // Additional methods as needed
    // ...
}

export default GameSprites;