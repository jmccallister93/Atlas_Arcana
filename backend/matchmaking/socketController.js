const gameSessionManager = require("./gameSessionManager");
const StateManager = require("../networking/sync/stateManager");
const reconcileClientState = require("../networking/sync/reconciliation");
const compensateForLag = require("../networking/latency/lagCompensation");
const validateGameActions = require("../validation/validateGameActions");

// Initialize the state manager
const stateManager = new StateManager();

let onlineUsers = 0;

// This will store unique socket IDs of connected users
const connectedUsers = new Set();

module.exports = function (socket, io) {
  // Add the connected socket ID to the set
  connectedUsers.add(socket.id);
  console.log(`User connected. Users online: ${connectedUsers.size}`);

  // Emit the updated user count
  socket.broadcast.emit("updateOnlineUsers", connectedUsers.size);

  // User connected
  socket.on("connect", () => {
    onlineUsers++;
    socket.broadcast.emit("updateOnlineUsers", onlineUsers);
    console.log(`User connected. Users online: ${onlineUsers}`);
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    console.log(`User disconnected. Users online: ${connectedUsers.size}`);
    io.emit("updateOnlineUsers", connectedUsers.size); // emit to all clients
  });

  socket.on("reconnect", () => {
    console.log("User reconnected");
    // Handle reconnection (e.g., restore state, resume game, etc.)
  });

  // Status change
  socket.on("userStatusChange", ({ username, status }) => {
    // Handle the status change, update Redis or any other storage mechanism
    // And emit the updated user list to clients
  });

  // Game Play
  // Handle a player move or action
  socket.on("playerAction", async (data) => {
    if (!validateGameActions(data.action)) {
      return; // Invalid action, ignore or send error response
    }
    try {
      const { sessionId, action, clientState } = data;

      // Process the action to update the game state
      const updatedState = {}; // Result of processing the action

      // Update the state in the game session manager
      await gameSessionManager.updateGameState(sessionId, updatedState);

      // Synchronize state across clients
      stateManager.updateState(updatedState);

      // Optionally reconcile client state if discrepancies are found
      reconcileClientState(clientState, updatedState);
    } catch (error) {
      // Handle errors
    }
  });
  socket.on("realTimeAction", (data) => {
    try {
      const { action, latency } = data;

      // Compensate the action for lag
      const compensatedAction = compensateForLag(action, latency);

      // Process the compensated action
      // ...
    } catch (error) {
      // Handle errors
    }
  });
};
