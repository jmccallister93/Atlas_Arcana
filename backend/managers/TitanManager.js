const titanCards = require("../gameCards/titanCards");

class TitanManager {
    constructor(titanCards) {
      this.titanCards = titanCards;
    }
    determineStartingTitans(numberOfPlayers) {
      const selectedTitans = [];
      const numberOfTitansToAllocate =
        this.determineNumberOfTitans(numberOfPlayers);
  
      for (let i = 0; i < numberOfTitansToAllocate; i++) {
        const randomIndex = Math.floor(Math.random() * this.titanCards.length);
        selectedTitans.push(this.titanCards[randomIndex]);
        this.titanCards.splice(randomIndex, 1);
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
  }

module.exports = TitanManager