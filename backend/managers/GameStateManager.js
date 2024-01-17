class GameStateManager {
    constructor(sessionClient) {
      this.sessionClient = sessionClient;
      this.updateGameState = this.updateGameState.bind(this);
      this.getGameState = this.getGameState.bind(this);
    }
  
    async updateGameState(sessionId, newState) {
      try {
        const sessionData = JSON.parse(await this.sessionClient.get(sessionId));
        if (!sessionData) {
          throw new Error("Session not found");
        }
        console.log("Existing GameState before merge:", sessionData.gameState);
        console.log("NewState to merge:", JSON.stringify(newState));
  
        const updatedGameState = { ...sessionData.gameState, ...newState };
        console.log("Updated GameState after merge:", updatedGameState);
  
        sessionData.gameState = updatedGameState;
        await this.sessionClient.set(sessionId, JSON.stringify(sessionData));
  
        console.log("Emitting updated game state to session:", sessionId);
        io.to(sessionId).emit("updateGameState", updatedGameState);
      } catch (error) {
        console.error("Error updating game state:", error);
      }
    }
  
    async getGameState(sessionId) {
      try {
        const sessionData = await this.sessionClient.get(sessionId);
        if (sessionData) {
          return JSON.parse(sessionData);
        } else {
          // Handle case where session data is not found
          throw new Error("Session data not found for sessionId: " + sessionId);
        }
      } catch (error) {
        console.error("Error retrieving game state:", error);
        throw error; // Re-throw the error for handling in the calling function
      }
    }
  }

  module.exports = GameStateManager;