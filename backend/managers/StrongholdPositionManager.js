class StrongholdPositionManager {
  constructor(sessionClient) {
    this.sessionClient = sessionClient
    this.strongholdPositions = new Map(); // { playerId: { x: Number, y: Number }, ... }
  }
  // This method will handle both initialization and updating of stronghold positions
  async updateStrongholdPosition(io, sessionId, newStrongholdPosition) {
    try {
        // Fetch the current session data
        const sessionData = await this.sessionClient.get(sessionId);
        if (!sessionData) {
            throw new Error("Session not found");
        }

        // Parse the session data
        const parsedSessionData = JSON.parse(sessionData);
        console.log("Current stronghold positions before update:", parsedSessionData.strongholdPositions);

        // Check if the stronghold position for the user already exists
        const existingIndex = parsedSessionData.strongholdPositions.findIndex(
            position => position.playerUsername === newStrongholdPosition.playerUsername
        );

        if (existingIndex !== -1) {
            // Update existing position
            parsedSessionData.strongholdPositions[existingIndex] = newStrongholdPosition;
        } else {
            // Add new position
            parsedSessionData.strongholdPositions.push(newStrongholdPosition);
        }

        // Serialize and save the updated session data
        const serializedData = JSON.stringify(parsedSessionData);
        await this.sessionClient.set(sessionId, serializedData);
        console.log("Updated stronghold positions:", parsedSessionData.strongholdPositions);
        // Emit the update to all clients in the session
        io.to(sessionId).emit("updateStrongholdPosition", {
            strongholdPositions: parsedSessionData.strongholdPositions,
        });
    } catch (error) {
        console.error("Error updating stronghold position:", error);
        // Handle any errors that might occur
    }
}
  
  getStrongholdPosition(playerUsername) {
    return this.strongholdPositions.get(playerUsername) || null;
  }
}

module.exports = StrongholdPositionManager;
