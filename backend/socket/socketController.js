//SOCKET CONTROLLER

const gameSessionManager = require("../matchmaking/gameSessionManager");
const StateManager = require("../networking/sync/stateManager");
const reconcileClientState = require("../networking/sync/reconciliation");
const compensateForLag = require("../networking/latency/lagCompensation");
const validateGameActions = require("../validation/validateGameActions");
const Player = require("../database/PlayerModel");

// Initialize the state manager
const stateManager = new StateManager();

// This will store unique socket IDs of connected users
const totalConnectedUsers = new Set();

//Single User online status
const userOnlineStatus = new Map(); // Key: ObjectId, Value: socket.id

// Initialize a matchmaking queue
let matchmakingQueue = [];

module.exports = function (socket, io) {
  // Total Connected Users
  totalConnectedUsers.add(socket.id);
  io.emit("totalConnectedUsers", totalConnectedUsers.size);
  socket.on("disconnect", () => {
    totalConnectedUsers.delete(socket.id);
    io.emit("totalConnectedUsers", totalConnectedUsers.size);
  });

  // Single online user status
  // Handle user connection
  socket.on("userOnlineStatus", async (userId) => {
    userOnlineStatus.set(userId, socket.id);
    await Player.findByIdAndUpdate(userId, { online: true }); // Set user online in MongoDB
    checkAndEmitUserStatus(userId, io); // Emit status when a user connects
  });
   // Handle user disconnection
   socket.on("disconnect", async () => {
    let disconnectedUserId = null;
    for (let [userId, socketId] of userOnlineStatus.entries()) {
        if (socketId === socket.id) {
            userOnlineStatus.delete(userId);
            disconnectedUserId = userId;
            break;
        }
    }
    if (disconnectedUserId) {
        await Player.findByIdAndUpdate(disconnectedUserId, { online: false }); // Set user offline in MongoDB
        checkAndEmitUserStatus(disconnectedUserId, io); // Emit status when a user disconnects
    }
});

  socket.on("playerAction", async (data) => {
    if (!validateGameActions(data.action)) {
      return; // Invalid action, ignore or send error response
    }
    try {
      const { sessionId, action, clientState } = data;

      // Process the action to update the game state
      const updatedState = {}; // Result of processing the action

      await gameSessionManager.updateGameState(sessionId, updatedState);

      stateManager.updateState(updatedState);

      reconcileClientState(clientState, updatedState);
    } catch (error) {
      // Handle errors
    }
  });

  socket.on("realTimeAction", (data) => {
    try {
      const { action, latency } = data;
      const compensatedAction = compensateForLag(action, latency);
      // Process the compensated action
    } catch (error) {
      // Handle errors
    }
  });

  socket.on("sendFriendRequest", async (data) => {
    try {
      const { senderId, receiverId } = data;
      // Logic to handle sending friend request
      // This is a placeholder for the actual implementation
      const requestResult = await sendFriendRequest(senderId, receiverId);
      io.to(receiverId).emit("friendRequestReceived", requestResult);
    } catch (error) {
      socket.emit("friendRequestError", error.message);
    }
  });

  socket.on("joinMatchmaking", (data) => {
    console.log("User joining matchmaking:", data.userId);
    // Add the user to the matchmaking queue
    if (!matchmakingQueue.includes(data.userId)) {
      matchmakingQueue.push(data.userId);
      console.log("Current matchmaking queue:", matchmakingQueue);
    }

    // Check if there are enough players for a match
    if (matchmakingQueue.length >= 2) {
      // Here you would typically create a new game session for these players
      console.log("Match ready! Players:", matchmakingQueue.slice(0, 2));

      // For now, let's just remove these players from the queue
      matchmakingQueue = matchmakingQueue.slice(2);
      console.log("Updated matchmaking queue:", matchmakingQueue);
    }
  });
};

// Call to check user online status
function checkAndEmitUserStatus(userId, io) {
    const isOnline = userOnlineStatus.has(userId);
    io.emit("userOnlineStatus", { userId, isOnline }); // Emit to all clients
    // io.to(userId).emit("userOnlineStatus", { isOnline }); // Emit to a specific client (if needed)
}