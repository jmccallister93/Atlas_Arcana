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
    if (
      change.operationType === "update" &&
      change.updateDescription.updatedFields.friendRequests
    ) {
        const updatedUserId = change.documentKey._id.toString();

      // Emit event to the specific user whose friendRequest array changed
      const userSocketId = userOnlineStatus.get(updatedUserId);
      console.log(`Emitting 'updatePendingRequests' to user with ID: ${updatedUserId} and socket ID: ${userSocketId}`);
      io.to(userSocketId).emit("updatePendingRequests");
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
    console.log("Received updateOnlineStatus: User ID:", userId, "Socket ID:", socket.id);
    userOnlineStatus.set(userId.toString(), socket.id);
    await Player.findByIdAndUpdate(userId, { online: status });
    checkAndEmitUserStatus(userId, status, io);
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

};

// Call to check user online status
function checkAndEmitUserStatus(userId, status, io) {
  console.log(`Emitting userOnlineStatus for User ID ${userId}: ${status}`);
  io.emit("userOnlineStatus", { userId, status });
}
