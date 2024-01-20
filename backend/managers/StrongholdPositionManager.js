class StrongholdPositionManager {
  constructor(sessionClient) {
    this.sessionClient = sessionClient
    this.strongholdPositions = new Map(); // { playerId: { x: Number, y: Number }, ... }
  }
  // This method will handle both initialization and updating of stronghold positions
  async updateStrongholdPosition(io, sessionId, playerUsername, newPosition) {
    try {
      const sessionData = await this.sessionClient.get(sessionId);
      if (!sessionData) {
        throw new Error("Session not found");
      }

      const parsedSessionData = JSON.parse(sessionData);

      // Ensure gameState and strongholdPositions array exist
      if (!parsedSessionData.gameState) {
        parsedSessionData.gameState = {};
      }
      if (!Array.isArray(parsedSessionData.gameState.strongholdPositions)) {
        parsedSessionData.gameState.strongholdPositions = [];
      }

      // Find the index of the stronghold position for the specific player
      const index = parsedSessionData.gameState.strongholdPositions.findIndex(position => position.playerUsername === playerUsername);

      if (index !== -1) {
        // Update the existing position
        parsedSessionData.gameState.strongholdPositions[index] = { playerUsername, ...newPosition };
      } else {
        // Add a new position
        parsedSessionData.gameState.strongholdPositions.push({ playerUsername, ...newPosition });
      }

      const serializedData = JSON.stringify(parsedSessionData);
      await this.sessionClient.set(sessionId, serializedData);

      io.to(sessionId).emit("updateStrongholdPosition", {
        strongholdPositions: parsedSessionData.gameState.strongholdPositions,
      });
    } catch (error) {
      console.error("Error updating stronghold position:", error);
    }
  }
  getStrongholdPosition(playerUsername) {
    return this.strongholdPositions.get(playerUsername) || null;
  }
}

module.exports = StrongholdPositionManager;
