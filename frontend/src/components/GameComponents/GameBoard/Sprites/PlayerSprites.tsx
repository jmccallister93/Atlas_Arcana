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
        const spriteX = player.x * this.tileSize;
        const spriteY = player.y * this.tileSize;
    
        if (this.players.has(player.playerUsername)) {
          const existingSprite = this.players.get(player.playerUsername);
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
    
          this.players.set(player.playerUsername, sprite);
        }
      }
}

export default PlayerSprites;