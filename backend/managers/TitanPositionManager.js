class TitanPositionManager {
  constructor(sessionClient) {
    this.sessionClient = sessionClient;
    this.titanPositions = new Map();
  }
  initializeTitanPositions(titansWithPositions) {
    titansWithPositions.forEach((titan) => {
      this.titanPositions.set(titan.name, { x: titan.x, y: titan.y });
    });
  }
    // This method will handle both initialization and updating of Titan positions
    async updateTitanPosition(io, sessionId, newTitanPosition) {
      try {
          // Fetch the current session data
          const sessionData = await this.sessionClient.get(sessionId);
          if (!sessionData) {
              throw new Error("Session not found");
          }
  
          // Parse the session data
          const parsedSessionData = JSON.parse(sessionData);
          console.log("Current Titan positions before update:", parsedSessionData.titanPositions);
  
          // CHECK HERE WHEN MOVING TITANS IF ISSUE

          // Check if the Titan position for the user already exists
          const existingIndex = parsedSessionData.titanPositions.findIndex(
              position => position.titanName === newTitanPosition.playerUsername
          );
  
          if (existingIndex !== -1) {
              // Update existing position
              parsedSessionData.titanPositions[existingIndex] = newTitanPosition;
          } else {
              // Add new position
              parsedSessionData.titanPositions.push(newTitanPosition);
          }
  
          // Serialize and save the updated session data
          const serializedData = JSON.stringify(parsedSessionData);
          await this.sessionClient.set(sessionId, serializedData);
          console.log("Updated Titan positions:", parsedSessionData.titanPositions);
          // Emit the update to all clients in the session
          io.to(sessionId).emit("updateTitanPosition", {
              TitanPositions: parsedSessionData.titanPositions,
          });
      } catch (error) {
          console.error("Error updating Titan position:", error);
          // Handle any errors that might occur
      }
  }

  getTitanPositions() {
    let positions = [];
    this.titanPositions.forEach((position, titanName) => {
      positions.push({ titanName, ...position });
    });
    return positions;
  }
}

module.exports = TitanPositionManager;
