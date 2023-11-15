const gameSessionManager = require("./gameSessionManager");
const StateManager = require("../networking/sync/stateManager");
const reconcileClientState = require("../networking/sync/reconciliation");
const compensateForLag = require("../networking/latency/lagCompensation");
const validateGameActions = require("../validation/validateGameActions");

// Initialize the state manager
const stateManager = new StateManager();

// This will store unique socket IDs of connected users
const connectedUsers = new Set();

module.exports = function (socket, io) {
    // Add the connected socket ID to the set
    connectedUsers.add(socket.id);
    console.log(`User connected. Users online: ${connectedUsers.size}`);

    // Emit the updated user count to all users including the newly connected user
    io.emit("updateOnlineUsers", connectedUsers.size);

    socket.on("disconnect", () => {
        // Remove the disconnected socket ID from the set
        connectedUsers.delete(socket.id);
        console.log(`User disconnected. Users online: ${connectedUsers.size}`);

        // Emit the updated user count to all remaining users
        io.emit("updateOnlineUsers", connectedUsers.size);
    });

    // Additional event handlers...

    socket.on("userStatusChange", ({ username, status }) => {
        // Handle the status change
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
            io.to(receiverId).emit('friendRequestReceived', requestResult);
        } catch (error) {
            socket.emit('friendRequestError', error.message);
        }
    });
};
