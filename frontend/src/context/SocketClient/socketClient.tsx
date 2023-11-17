import io from "socket.io-client";

// Initiate connection to socket server
const socket = io("http://localhost:3001"); 

// Connect
socket.on("connect", () => {});

// Total online users
socket.on("totalConnectedUsers", (usersCount) => {});

// Send friend request
socket.on("sendFriendRequest",  (senderId, receiverId) => {
  console.log("Received  in send request senderId: " + senderId)
    console.log("Received  in send request receiverId: " + receiverId)
} );

// Matchmaking found
socket.on("matchFound", (matchDetails) => {
    console.log("Match found:", matchDetails);
    const event = new CustomEvent("match-found", { detail: matchDetails });
    window.dispatchEvent(event);
  });


export default socket;
