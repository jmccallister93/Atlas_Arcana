import io from "socket.io-client";
import { GameState } from "../GameState/GameState";
// Initiate connection to socket server
const socket = io("http://localhost:3001"); 

// Connect
socket.on("connect", () => {});

// Handle online status updates of friends
socket.on("friendOnlineStatusUpdate", ({ userId, status }) => {
  console.log(`Friend's status updated - User ID: ${userId}, Status: ${status}`);
  // Update the UI or state accordingly
});

// Total online users
socket.on("totalConnectedUsers", (usersCount) => {});

// Send friend request
socket.on("sendFriendRequest",  (senderId, receiverId) => {} );

// Function to send game state updates
const sendGameStateUpdate = (sessionId: string, newState: GameState) => {
  socket.emit("updateGameState", { sessionId, newState });
};

// Function to listen for game state updates
const onGameStateUpdate = (callback: (newGameState: GameState) => void) => {
  socket.on("updateGameState", callback);
};

// Function to stop listening for game state updates
const offGameStateUpdate = (callback: (newGameState: GameState) => void) => {
  socket.off("updateGameState", callback);
};


export { sendGameStateUpdate, onGameStateUpdate, offGameStateUpdate };
export default socket;
