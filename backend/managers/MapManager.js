class MapManager {
    constructor() {
        // Initialize properties for map management
        this.gridSize = 24; // Example grid size
        this.tileGrid = [];
        this.playerPositions = {};
        this.titanPositions = {};
    }

    // Method to create the tile grid
    createTileGrid() {
        const tileTypes = [
            { type: "oasis", probability: 0.05 },
            { type: "desert", probability: 0.25 },
            { type: "forest", probability: 0.5 },
            { type: "grassland", probability: 0.75 },
            { type: "tundra", probability: 1.0 },
        ];

        for (let i = 0; i < this.gridSize; i++) {
            this.tileGrid[i] = [];
            for (let j = 0; j < this.gridSize; j++) {
                let randomNum = Math.random();
                let tileType = tileTypes.find(tile => randomNum <= tile.probability).type;
                this.tileGrid[i][j] = tileType;
            }
        }
    }

    // Method to update player position on the map
    updatePlayerPosition(playerId, coordinates) {
        this.playerPositions[playerId] = coordinates;
    }

    // Method to place Titans on the grid
    placeTitansOnGrid(titans)    {
        titans.forEach(titan => {
            let positionFound = false;
            while (!positionFound) {
                let row = this.getRandomInt(3, this.gridSize - 4);
                let col = this.getRandomInt(3, this.gridSize - 4);

                if (this.isPositionValid(row, col)) {
                    this.titanPositions[titan.titanName] = { row, col };
                    positionFound = true;
                }
            }
        });
    }
        // Helper method to get a random integer within a range
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }