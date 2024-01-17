class PositionManager {
    constructor(gridSize) {
      this.gridSize = gridSize;
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
    placeTitansOnGrid(titans) {
      const titanPositions = [];
  
      for (const titan of titans) {
        let positionFound = false;
        while (!positionFound) {
          let row = this.getRandomInt(3, this.gridSize - 4);
          let col = this.getRandomInt(3, this.gridSize - 4);
  
          if (this.isPositionValid(titanPositions, row, col)) {
            titanPositions.push({ ...titan, row, col });
            positionFound = true;
          }
        }
      }
  
      return titanPositions;
      
    }
  }

  module.exports = PositionManager;