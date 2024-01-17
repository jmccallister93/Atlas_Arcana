class PositionManager {
    constructor(gridSize) {
      this.gridSize = gridSize;
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