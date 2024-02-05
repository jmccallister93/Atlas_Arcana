class BuildingPositionManager {
    constructor(sessionClient) {
        this.sessionClient = sessionClient;
      this.buildingPositions = new Map(); 
    }
 // This method will handle both initialization and updating of Building positions
 async updateBuildingPosition(io, sessionId, newBuildingPosition) {
  try {
      // Fetch the current session data
      const sessionData = await this.sessionClient.get(sessionId);
      if (!sessionData) {
          throw new Error("Session not found");
      }

      // Parse the session data
      const parsedSessionData = JSON.parse(sessionData);
      console.log("Current Building positions before update:", parsedSessionData.buildingPositions);

      // Check if the Building position for the user already exists
      const existingIndex = parsedSessionData.buildingPositions.findIndex(
          position => position.playerUsername === newBuildingPosition.playerUsername
      );

      if (existingIndex !== -1) {
          // Update existing position
          parsedSessionData.buildingPositions[existingIndex] = newBuildingPosition;
      } else {
          // Add new position
          parsedSessionData.buildingPositions.push(newBuildingPosition);
      }

      // Serialize and save the updated session data
      const serializedData = JSON.stringify(parsedSessionData);
      await this.sessionClient.set(sessionId, serializedData);
      console.log("Updated Building positions:", parsedSessionData.buildingPositions);
      // Emit the update to all clients in the session
      io.to(sessionId).emit("updateBuildingPosition", {
          BuildingPositions: parsedSessionData.buildingPositions,
      });
  } catch (error) {
      console.error("Error updating Building position:", error);
      // Handle any errors that might occur
  }
}

getBuildingPosition(playerUsername) {
  return this.BuildingPositions.get(playerUsername) || null;
}
  
  }
  
  module.exports = BuildingPositionManager;
  