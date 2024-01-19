class StrongholdPositionManager {
    constructor() {
      this.strongholdPositions = new Map(); // { playerId: { x: Number, y: Number }, ... }
    }
    initializeStrongholdPositions(players) {
      return players.map(player => {
        const position = { x: 0, y: 0 };
        this.strongholdPositions.set(player.username, position);
        return { playerUsername: player.username, ...position };
      });
    }
  
    updateStrongholdPosition(playerUsername, newPosition) {
      // Update player position
      this.stronghold[playerUsername] = newPosition;
      // Emit event or trigger callback if necessary
    }
    getStrongholdPosition(playerUsername) {
      // Return player position
      if (this.stronghold[playerUsername]) {
          return this.stronghold[playerUsername];
        } else {
          // Handle the case where the playerId is not found
          // You might want to return a default position or handle this as an error
          return null;
        }
    }
  
  }

  module.exports = StrongholdPositionManager