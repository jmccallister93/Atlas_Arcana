class GameBoardManager {
    constructor() {
      this.gridSize = 24; // Define the size of the grid
      this.tileTypes = [
        { type: "oasis", probability: 0.05 },
        { type: "desert", probability: 0.25 },
        { type: "forest", probability: 0.5 },
        { type: "grassland", probability: 0.75 },
        { type: "tundra", probability: 1.0 },
      ];
    }
    createTileGrid() {
      let tileGrid = new Array(this.gridSize)
        .fill(null)
        .map(() => new Array(this.gridSize).fill(null));
  
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          let randomNum = Math.random();
          let tileType = this.tileTypes.find(
            (tile) => randomNum <= tile.probability
          ).type;
          tileGrid[i][j] = tileType;
        }
      }
  
      return tileGrid;
    }
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    isPositionValid(titanPositions, row, col) {
      for (const pos of titanPositions) {
        if (Math.abs(pos.row - row) <= 6 && Math.abs(pos.col - col) <= 6) {
          return false; // Too close to another titan
        }
      }
      return true;
    }
  }

  module.exports = GameBoardManager;