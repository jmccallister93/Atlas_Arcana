//SOCKET CONTROLLER

const StateManager = require("../networking/sync/stateManager");
const Player = require("../database/PlayerModel");
const gameSessionManager = require("../matchmaking/gameSessionManager");

// Initialize the state manager
const stateManager = new StateManager();

// This will store unique socket IDs of connected users
const totalConnectedUsers = new Set();

//Single User online status
const userOnlineStatus = new Map(); // Key: ObjectId, Value: socket.id

module.exports = function (socket, io) {
  // Listen to change stream for the Player collection
  const changeStream = Player.watch();
  changeStream
    .on("change", (change) => {
      if (
        change.operationType === "update" &&
        change.updateDescription.updatedFields.friendRequests
      ) {
        const updatedUserId = change.documentKey._id.toString();

        // Emit event to the specific user whose friendRequest array changed
        const userSocketId = userOnlineStatus.get(updatedUserId);
        io.to(userSocketId).emit("updatePendingRequests");
      }
      if (
        change.operationType === "update" &&
        change.updateDescription.updatedFields.friendsList
      ) {
        const updatedUserId = change.documentKey._id.toString();
        const userSocketId = userOnlineStatus.get(updatedUserId);
        io.to(userSocketId).emit("updateFriendsList");
      }
      if (
        change.operationType === "update" &&
        change.updateDescription.updatedFields.online
      ) {
        const updatedUserId = change.documentKey._id.toString();
        const userSocketId = userOnlineStatus.get(updatedUserId);
      }
    })
    .on("error", (error) => {
      console.error("Error in change stream:", error);
    });

  // Total Connected Users
  totalConnectedUsers.add(socket.id);
  io.emit("totalConnectedUsers", totalConnectedUsers.size);
  socket.on("disconnect", () => {
    console.log("User disconnected, removing socket ID:", socket.id);
    totalConnectedUsers.delete(socket.id);
    io.emit("totalConnectedUsers", totalConnectedUsers.size);
  });

  // Handle user connection
  socket.on("updateOnlineStatus", async (userId, status) => {
    userOnlineStatus.set(userId.toString(), socket.id);
    console.log("Storing socket ID for user:", userId, "Socket ID:", socket.id);
    await Player.findByIdAndUpdate(userId, { online: status });
    checkAndEmitUserStatus(userId, status, io);

    // Find the user's friends
    const user = await Player.findById(userId).populate("friendsList");
    console.log("Current userOnlineStatus map:", userOnlineStatus);
    user.friendsList.forEach((friend) => {
      console.log("Looking up socket ID for friend:", friend._id.toString());
      const friendSocketId = userOnlineStatus.get(friend._id.toString());
      if (friendSocketId) {
        io.to(friendSocketId).emit("friendOnlineStatusUpdate", {
          userId,
          status,
        });
      }
    });
  });

  //   Friend request
  socket.on("sendFriendRequest", async (data) => {
    const { senderId, receiverId } = data;
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

  // Listen for game state updates from clients
  socket.on("updateGameState", async ({ sessionId, newState }) => {
    console.log(
      "From socket controller updateGameState sessionId: " + sessionId
    );
    console.log(
      "From socket controller updateGameState newstate: " +
        JSON.stringify(newState)
    );
    try {
      // Process the new state (e.g., validate, apply game logic)
      await gameSessionManager.updateGameState(io, sessionId, newState);
      // Retrieve the updated state
      const updatedState = await gameSessionManager.getGameState(sessionId);
      // Broadcast the updated state to all players in the session
      console.log("Broadcasting updated state to session:", sessionId);
      //AAAAAAAAAAAAAAAAAAAAAAAAAAAAA 
      io.to(sessionId)
      .emit("updateGameState", updatedState.gameState); // Emit the gameState part
    } catch (error) {
      console.error("Error updating game state:", error);
      // Optionally, emit  an error message back to the client
      socket.emit("gameStateUpdateError", {
        message: "Failed to update game state.",
      });
    }
  });

  // Current Player Turn
  socket.on("updateCurrentPlayerTurn", async ({ sessionId, partialUpdate }) => {
    try {
      // Retrieve the current game state for the session
      const gameState = await gameSessionManager.getGameState(sessionId);
  
      // Update the currentPlayerTurn
      gameState.currentPlayerTurn = partialUpdate.currentPlayerTurn;
  
      // Save or process the updated game state as needed
      // (This step depends on how your gameSessionManager handles state updates)
  
      // Broadcast the updated state to all players in the session
      io.to(sessionId).emit("updateGameState", gameState);
    } catch (error) {
      console.error("Error updating current player turn:", error);
      // Optionally, emit an error message back to the client
      socket.emit("gameStateUpdateError", {
        message: "Failed to update current player turn.",
      });
    }
  });

    // Current Phase
    socket.on("updateCurrentPhase", async ({ sessionId, partialUpdate }) => {
      try {
        // Retrieve the current game state for the session
        const gameState = await gameSessionManager.getGameState(sessionId);
    
        // Update the currentPhase
        gameState.currentPhase = partialUpdate.currentPhase;
    
        // Save or process the updated game state as needed
        // (This step depends on how your gameSessionManager handles state updates)
    
        // Broadcast the updated state to all players in the session
        io.to(sessionId).emit("updateGameState", gameState);
      } catch (error) {
        console.error("Error updating current phase:", error);
        // Optionally, emit an error message back to the client
        socket.emit("gameStateUpdateError", {
          message: "Failed to update current phase.",
        });
      }
    });

  //Game Phases
  //Draw phase
  socket.on('drawCard', async ({ sessionId, playerId }) => {
    try {
        // Call the drawPhaseCardDraw function and update the game state
        const cardDrawn = await gameSessionManager.drawPhaseCardDraw(playerId, sessionId);
        // Emit back the result to the specific player
        socket.emit('cardDrawn', cardDrawn);
  
        // // Optionally, retrieve the updated game state
        // const updatedGameState = await gameSessionManager.getGameState(sessionId);
        // // Broadcast the updated state to all players in the session
        // io.to(sessionId).emit('updateGameState', updatedGameState);
       
    } catch (error) {
        console.error('Error in drawCard:', error);
        socket.emit('errorDrawingCard', error.message);
    }
  });
};

// Call to check user online status
function checkAndEmitUserStatus(userId, status, io) {
  io.emit("userOnlineStatus", { userId, status });
}
