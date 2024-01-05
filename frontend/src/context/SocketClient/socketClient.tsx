import io from "socket.io-client";
import { GameSessionInfo } from "../../components/GameComponents/Interfaces";
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
const sendGameStateUpdate = (sessionId: string, newState: GameSessionInfo) => {
  socket.emit("updateGameState", { sessionId, newState });
};

// Function to listen for game state updates
const onGameStateUpdate = (callback: (newGameState: GameSessionInfo) => void) => {
  socket.on("updateGameState", callback);
};

// Function to stop listening for game state updates
const offGameStateUpdate = (callback: (newGameState: GameSessionInfo) => void) => {
  socket.off("updateGameState", callback);
};

socket.on("receiveTradeRequest", (fromPlayerId: string, tradeOffer: {}) => {
  console.log("Received trade request");
});


export { sendGameStateUpdate, onGameStateUpdate, offGameStateUpdate };
export default socket;
