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
        const sprite = this.scene.add.sprite(building.x, building.y, spriteKey);
        this.buildings.set(building.buildingName, sprite);
    }
}

export default BuildingSprites;