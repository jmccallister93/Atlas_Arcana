class MovementSprites {
    scene: Phaser.Scene;
    graphics: Phaser.GameObjects.Graphics;
    movementTiles: Phaser.GameObjects.Sprite[];
    tileSize: number;
    gamePhase: string;
    currentPlayerPosition: { x: number; y: number };

    constructor(scene: Phaser.Scene, tileSize: number) {
        this.scene = scene;
        this.graphics = this.scene.add.graphics();
        this.movementTiles = [];
        this.tileSize = tileSize;
        this.gamePhase = ""; // This will be updated based on the game state
        this.currentPlayerPosition = { x: 0, y: 0 }; // This will be updated based on the game state
    }

    updateMovementOptions(gamePhase: string, currentPlayerPosition: { x: number; y: number }) {
        // Update current state
        this.gamePhase = gamePhase;
        this.currentPlayerPosition = currentPlayerPosition;

        // Clear previous drawings
        this.graphics.clear();

        if (this.gamePhase === "Map") {
            const surroundingTiles = [
                { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
                { dx: -1, dy: 0 }, /* currentPlayer */ { dx: 1, dy: 0 },
                { dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }
            ];

            surroundingTiles.forEach(({ dx, dy }) => {
                const tileX = (this.currentPlayerPosition.x + dx) * this.tileSize;
                const tileY = (this.currentPlayerPosition.y + dy) * this.tileSize;

                // Draw semi-transparent blue square for each surrounding tile
                this.graphics.fillStyle(0x0000ff, 0.5); // Semi-transparent blue
                this.graphics.fillRect(tileX, tileY, this.tileSize, this.tileSize);
            });
        }
    }
    // Call this method to clear all movement options, for example, when changing phases or players
    clearMovementOptions() {
        this.movementTiles.forEach(tile => tile.setVisible(false));
    }
}
