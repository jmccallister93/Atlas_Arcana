const titanCards = require("../gameCards/titanCards");

class TitanManager {
    constructor(gridSize) {
      this.gridSize = gridSize;
    }
    determineStartingTitans(numberOfPlayers) {
      const selectedTitans = [];
      const numberOfTitansToAllocate =
        this.determineNumberOfTitans(numberOfPlayers);
  
      for (let i = 0; i < numberOfTitansToAllocate; i++) {
        const randomIndex = Math.floor(Math.random() * titanCards.length);
        selectedTitans.push(titanCards[randomIndex]);
        titanCards.splice(randomIndex, 1);
      }
  
      return selectedTitans;
    }
    determineNumberOfTitans(numberOfPlayers) {
      if (numberOfPlayers <= 2) {
        return 2;
      } else if (numberOfPlayers <= 3) {
        return 3;
      } else {
        return 4;
      }
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
            titanPositions.push({ titanName: titan.titanName, x, y });
            positionFound = true;
          }
        }
      }
  
      return titanPositions;
      
    }
  }

module.exports = TitanManager