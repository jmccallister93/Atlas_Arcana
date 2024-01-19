class GameStateManager {
  constructor(sessionClient) {
    this.sessionClient = sessionClient;
    this.updateGameState = this.updateGameState.bind(this);
    this.getGameState = this.getGameState.bind(this);
  }


  async updateGameState(io, sessionId, newState) {
    try {
      const sessionData = await this.sessionClient.get(sessionId);
      if (!sessionData) {
        throw new Error("Session not found");
      }

      const parsedSessionData = JSON.parse(sessionData);

      const updatedGameState = { ...parsedSessionData.gameState, ...newState };

      const serializedData = JSON.stringify(parsedSessionData);
      await this.sessionClient.set(sessionId, serializedData);

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