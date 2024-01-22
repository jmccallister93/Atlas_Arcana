import { PlayerPosition } from "../../Interfaces";

class PlayerSprites {
    scene: Phaser.Scene;
    players: Map<string, Phaser.GameObjects.Sprite>;
    tileSize: number

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.players = new Map();
        this.tileSize = 30
    }

    addPlayer(player: PlayerPosition, spriteKey: string) {
        const sprite = this.scene.add.sprite(player.x, player.y, spriteKey);
        this.players.set(player.playerUsername, sprite);
    }
}

export default PlayerSprites;