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
  // Listen to change stream for the Player collection
  const changeStream = Player.watch();
  changeStream.on("change", (change) => {
    console.log("From change strem changetream.on change: " + change.operationType);
    if (
      change.operationType === "update" &&
      change.updateDescription.updatedFields.friendRequests
    ) {
        console.log("Friends list updated for user");
      const updatedUserId = change.documentKey._id;
      // Emit event to the specific user whose friendRequest array changed
      io.to(userOnlineStatus.get(updatedUserId)).emit("updatePendingRequests");
    }
  }).on('error', (error) => {
    console.error('Error in change stream:', error);
  });;

  // Total Connected Users
  totalConnectedUsers.add(socket.id);
  io.emit("totalConnectedUsers", totalConnectedUsers.size);
  socket.on("disconnect", () => {
    totalConnectedUsers.delete(socket.id);
    io.emit("totalConnectedUsers", totalConnectedUsers.size);
  });

  // Handle user connection
  socket.on("updateOnlineStatus", async (userId, status) => {
    console.log("User onlineStatus id: " + userId);
    console.log("User onlineStatus status: " + status);
    userOnlineStatus.set(userId, socket.id);
    await Player.findByIdAndUpdate(userId, { online: status });
    checkAndEmitUserStatus(userId, status, io);
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
    const { senderId, receiverId } = data;
    console.log("Received  in send request senderId: " + senderId);
    console.log("Received  in send request receiverId: " + receiverId);
    try {
      // Assume sendFriendRequest is a function that handles the request logic
      const newRequest = await sendFriendRequest(senderId, receiverId);

      // Get the receiver's socket ID from userOnlineStatus
      const receiverSocketId = userOnlineStatus.get(receiverId);

      // Check if the receiver is online (socket ID is available)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("friendRequestReceived", newRequest);
      } else {
        // Handle the case when the receiver is offline
        console.log("Receiver is offline");
      }
    } catch (error) {
      socket.emit("friendRequestError", error.message);
    }
  });

  // Accept friend request handler
  socket.on("acceptFriendRequest", async (data) => {
    const { userId, friendId } = data;

    try {
      // Assume acceptFriendRequest is a function that updates the friendship status
      await acceptFriendRequest(userId, friendId);

      // Notify the friend that the request has been accepted
      const friendSocketId = userOnlineStatus.get(friendId);
      if (friendSocketId) {
        io.to(friendSocketId).emit("friendRequestAccepted", {
          userId,
          friendId,
        });
      }
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
function checkAndEmitUserStatus(userId, status, io) {
  console.log(`Emitting userOnlineStatus for User ID ${userId}: ${status}`);
  io.emit("userOnlineStatus", { userId, status });
}
