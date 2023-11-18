import io from "socket.io-client";

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


export default socket;
