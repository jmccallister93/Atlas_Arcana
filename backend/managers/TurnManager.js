class TurnManager {
    constructor() {
      this.turnOrder = [];
    }
    determineTurnOrder(players) {
      for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
      }
      this.turnOrder = players;
    }
  
    getCurrentPlayerTurn() {
      return this.turnOrder.length > 0 ? this.turnOrder[0].username : null;
    }
  }

module.exports = TurnManager;
