class TitanPlacementManager {
    constructor(gridSize) {
      this.gridSize = gridSize;
    }
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    isPositionValid(titanPositions, x, y) {
      for (const pos of titanPositions) {
        if (Math.abs(pos.x - x) <= 6 && Math.abs(pos.y - y) <= 6) {
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
          let x = this.getRandomInt(3, this.gridSize - 4);
          let y = this.getRandomInt(3, this.gridSize - 4);
  
          if (this.isPositionValid(titanPositions, x, y)) {
            titanPositions.push({ ...titan, x, y });
            positionFound = true;
          }
        }
      }
  
      return titanPositions;
      
    }
  }

  module.exports = TitanPlacementManager;