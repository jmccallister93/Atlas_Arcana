class PlayerPositionManager {
  constructor(sessionClient) {
    this.sessionClient = sessionClient;
    this.playerPositions = new Map();
  }
  initializePlayerPositions(players) {
    return players.map((player) => {
      const position = { x: 0, y: 0 };
      this.playerPositions.set(player.username, position);
      return { playerUsername: player.username, ...position };
    });
  }

  async updatePlayerPosition(io, sessionId, newPlayerPosition) {
    try {
      // Fetch the current session data
      const sessionData = await this.sessionClient.get(sessionId);
      if (!sessionData) {
        throw new Error("Session not found");
      }

      // Parse the session data
      const parsedSessionData = JSON.parse(sessionData);
      console.log(
        "Current player positions before update:",
        parsedSessionData.playerPositions
      );

      // Check if the player position for the user already exists
      const existingIndex = parsedSessionData.playerPositions?.findIndex(
        (position) =>
          position.playerUsername === newPlayerPosition.playerUsername
      );

      if (existingIndex !== -1) {
        // Update existing position
        parsedSessionData.playerPositions[existingIndex] = newPlayerPosition;
      } else {
        // Add new position
        parsedSessionData.playerPositions.push(newPlayerPosition);
      }

      // Serialize and save the updated session data
      const serializedData = JSON.stringify(parsedSessionData);
      await this.sessionClient.set(sessionId, serializedData);
      console.log(
        "Updated player positions:",
        parsedSessionData.playerPositions
      );
      // Emit the update to all clients in the session
      io.to(sessionId).emit("updatePlayerPosition", {
        playerPositions: parsedSessionData.playerPositions,
      });
    } catch (error) {
      console.error("Error updating player position:", error);
      // Handle any errors that might occur
    }
  }
  getPlayerPosition(playerUsername) {
    // Return player position
    if (this.playerPositions[playerUsername]) {
      return this.playerPositions[playerUsername];
    } else {
      // Handle the case where the playerId is not found
      // You might want to return a default position or handle this as an error
      return null;
    }
  }
}

module.exports = PlayerPositionManager;
