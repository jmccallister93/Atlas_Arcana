//SOCKET CONTROLLER
const { v4: uuidv4 } = require("uuid");
const StateManager = require("../networking/sync/stateManager");
const Player = require("../database/PlayerModel");
const GameSessionManager = require("../managers/GameSessionManager");
const GameStateManager = require("../managers/GameStateManager");
const TradeManager = require("../managers/TradeManager");
const CardManager = require("../managers/CardManager");
const PlayerPositionManager = require("../managers/PlayerPositionManager");
const StrongholdPositionManager = require("../managers/StrongholdPositionManager");
const TitanPositionManager = require("../managers/TitanPositionManager");
const BuildingPositionManager = require("../managers/BuildingPositionManager");

// Initialize the state manager
const stateManager = new StateManager();

const gameSessionManager = new GameSessionManager();
const gameStateManager = new GameStateManager(gameSessionManager.sessionClient);
const tradeManager = new TradeManager(gameSessionManager.sessionClient);
const cardManager = new CardManager(gameSessionManager.sessionClient);
const playerPositionManager = new PlayerPositionManager(
  gameSessionManager.sessionClient
);
const strongholdPositionManager = new StrongholdPositionManager(
  gameSessionManager.sessionClient
);
const titanPositionManager = new TitanPositionManager(
  gameSessionManager.sessionClient
);
const buildingPositionManager = new BuildingPositionManager(
  gameSessionManager.sessionClient
);

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
    try {
    //   console.log("New state from socketcontroller:", newState);
      // Process the new state (e.g., validate, apply game logic)
      await gameStateManager.updateGameState(io, sessionId, newState);
      // Retrieve the updated state
      const updatedState = await gameStateManager.getGameState(sessionId);
      // Broadcast the updated state to all players in the session
      io.to(sessionId).emit("updateGameState", updatedState.gameState); // Emit the gameState part
    } catch (error) {
      console.error("Error updating game state:", error);
      // Optionally, emit  an error message back to the client
      socket.emit("gameStateUpdateError", {
        message: "Failed to update game state.",
      });
    }
  });

  // Listen for player position updates from clients
  socket.on("updatePlayerPosition", async ({ sessionId, newPlayerPosition }) => {
    console.log("Received new player position:", newPlayerPosition);
    try {
        await playerPositionManager.updatePlayerPosition(
            io, sessionId, newPlayerPosition
        );
    } catch (error) {
        console.error("Error updating game state:", error);
        socket.emit("positionUpdateError", {
            message: "Failed to update position.",
        });
    }
});
  // Listen for stronghold position updates from clients
  socket.on("updateStrongholdPosition", async ({ sessionId, newStrongholdPosition }) => {
    console.log("Received new stronghold position:", newStrongholdPosition);
    try {
        await strongholdPositionManager.updateStrongholdPosition(
            io, sessionId, newStrongholdPosition
        );
    } catch (error) {
        console.error("Error updating game state:", error);
        socket.emit("positionUpdateError", {
            message: "Failed to update position.",
        });
    }
});

  // Listen for building position updates from clients
  socket.on("updateBuildingPosition", async ({ sessionId, newBuildingPosition }) => {
    console.log("Received new building position:", newBuildingPosition);
    try {
        await buildingPositionManager.updateBuildingPosition(
            io, sessionId, newBuildingPosition
        );
    } catch (error) {
        console.error("Error updating game state:", error);
        socket.emit("positionUpdateError", {
            message: "Failed to update position.",
        });
    }
});
    // Listen for titan position updates from clients
    socket.on("updateTitanPosition", async ({ sessionId, newTitanPosition }) => {
      console.log("Received new titan position:", newTitanPosition);
      try {
          await titanPositionManager.updateTitanPosition(
              io, sessionId, newTitanPosition
          );
      } catch (error) {
          console.error("Error updating game state:", error);
          socket.emit("positionUpdateError", {
              message: "Failed to update position.",
          });
      }
  });


  // Current Player Turn
  socket.on("updateCurrentPlayerTurn", async ({ sessionId, partialUpdate }) => {
    try {
      // Retrieve the current game state for the session
      const gameState = await gameStateManager.getGameState(sessionId);

      // Update the currentPlayerTurn
      gameState.currentPlayerTurn = partialUpdate.currentPlayerTurn;

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
      const gameState = await gameStateManager.getGameState(sessionId);

      // Update the currentPhase
      gameState.currentPhase = partialUpdate.currentPhase;

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
  // Draw Phase
  //Allocate Resources
  socket.on("allocateResources", async ({ sessionId, player }) => {
    console.log("From allocateResources player:", player);
    try {
      const allocateResources = await cardManager.allocateResources(
        player,
        sessionId
      );
      socket.emit("resourcesAllocated", allocateResources);
    } catch (error) {
      console.error("Error in allocateResources:", error);
      socket.emit("errorAllocatingResources", error.message);
    }
  });
  // Draw cards
  socket.on("drawEquipmentCard", async ({ sessionId, playerId }) => {
    try {
      // Call the drawPhaseCardDraw function and update the game state
      const cardDrawn = await cardManager.drawPhaseCardDraw(
        playerId,
        sessionId
      );
      // Emit back the result to the specific player
      socket.emit("equipmentCardDrawn", cardDrawn);
    } catch (error) {
      console.error("Error in drawCard:", error);
      socket.emit("errorDrawingCard", error.message);
    }
  });

  //Trade phase
  socket.on("sendTradeRequest", async ({ fromPlayerId, toPlayerId }) => {
    try {
      if (toPlayerId) {
        // console.log("Sending trade request to player:", toPlayerId);
        io.to(toPlayerId.socketId).emit("receiveTradeRequest", {
          fromPlayerId,
        });
      }
    } catch (error) {
      console.error("Error in sendTradeRequest:", error);
      socket.emit("errorSendingTradeRequest", error.message);
    }
  });

  socket.on(
    "respondToTradeRequest",
    async ({ fromPlayerId, toPlayerId, response }) => {
      if (response === "accepted") {
        const tradeSessionId = uuidv4();
        const fromSocket = io.sockets.sockets.get(fromPlayerId.socketId);
        const toSocket = io.sockets.sockets.get(toPlayerId.socketId);

        // Emit to both players to open the trade window
        io.to(fromPlayerId.socketId).emit("openTradeWindow", {
          otherPlayerId: toPlayerId,
          tradeSessionId: tradeSessionId,
        });
        io.to(toPlayerId.socketId).emit("openTradeWindow", {
          otherPlayerId: fromPlayerId,
          tradeSessionId: tradeSessionId,
        });

        if (fromSocket) {
          fromSocket.join(tradeSessionId);
        } else {
          console.error(
            `Socket with ID ${fromPlayerId.socketId} does not exist.`
          );
        }

        if (toSocket) {
          toSocket.join(tradeSessionId);
        } else {
          console.error(
            `Socket with ID ${toPlayerId.socketId} does not exist.`
          );
        }
      } else {
        // Notify both players that the trade request was declined
        const fromSocket = io.sockets.sockets.get(fromPlayerId.socketId);
        const toSocket = io.sockets.sockets.get(toPlayerId.socketId);
        if (fromSocket) {
          fromSocket.emit("tradeRequestDeclined", {
            message: "Trade request declined",
            declinedBy: toPlayerId,
          });
        } else {
          console.error(
            `Socket with ID ${fromPlayerId.socketId} does not exist.`
          );
        }

        if (toSocket) {
          toSocket.emit("tradeRequestDeclined", {
            message: "Trade request declined",
            declinedBy: toPlayerId,
          });
        } else {
          console.error(
            `Socket with ID ${toPlayerId.socketId} does not exist.`
          );
        }
      }
    }
  );

  socket.on("tradeWindowClosed", async ({ tradeSessionId, playerId }) => {
    try {
      // Notify all sockets in the trade session that the trade window has been closed
      socket.to(tradeSessionId).emit("tradeWindowClosedByOther", {
        closedByPlayerId: playerId,
      });
    } catch (error) {
      console.error("Error handling tradeWindowClosed event:", error);
    }
  });

  socket.on("addToTrade", async ({ sessionId, playerId, tradeState }) => {
    try {
      // Retrieve the current trade state for the session
      const currentTradeState = await tradeManager.getTradeState(sessionId);

      // Merge the incoming tradeState with the existing trade state
      const updatedTradeState = {
        ...currentTradeState,
        [playerId.username]: tradeState[playerId.username], // Update only the relevant player's trade offer
      };

      // Persist this updated state
      await tradeManager.addToTrade(sessionId, updatedTradeState);

      // Emit back the updated trade state to all players in the session
      io.to(sessionId).emit("tradeAdded", updatedTradeState);
    } catch (error) {
      console.error("Error in addToTrade:", error);
      socket.emit("errorAddingToTrade", error.message);
    }
  });

  socket.on(
    "tradeOfferAccepted",
    async ({ tradeSessionId, sessionId, playerId }) => {
      const currentTradeState = await tradeManager.getTradeState(
        tradeSessionId
      );
      if (await tradeManager.pendingTradeAcceptance(tradeSessionId, playerId)) {
        // Finalize trade if both players have accepted

        const updatedSessionData = await tradeManager.finalizeTrade(
          tradeSessionId,
          sessionId
        );

        // Emit event to notify players about trade finalization
        io.in(sessionId).emit("tradeFinalized", {
          tradeSessionId: tradeSessionId,
          sessionId: sessionId,
          status: "accepted",
          currentTradeState: currentTradeState,
        });
        // Additionally, emit the updated game state
        if (updatedSessionData) {
          io.in(sessionId).emit("updateGameState", updatedSessionData);
        }
      }
    }
  );

  socket.on(
    "tradeOfferDeclined",
    async ({ tradeSessionId, sessionId, playerId }) => {
      try {
        // Emit an event to close the trade window for all players in the session
        io.in(sessionId).emit("closeTradeWindow", {
          tradeSessionId: tradeSessionId,
          sessionId: sessionId,
          message: "Trade declined. Closing trade window.",
        });
      } catch (error) {
        console.error("Error handling tradeOfferDeclined event:", error);
      }
    }
  );
  // socket.on("restAccepted", async({sessionId, playerId}) => {
  //  await gameSessionManager.restAccepted(sessionId, playerId)
  //  socket.emit("healthRestored", )
  // })
};

// Call to check user online status
function checkAndEmitUserStatus(userId, status, io) {
  io.emit("userOnlineStatus", { userId, status });
}
