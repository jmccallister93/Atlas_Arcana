import io from "socket.io-client";

// Initiate connection to socket server
const socket = io("http://localhost:3001"); 

// Connect
socket.on("connect", () => {});

// Total online users
socket.on("totalConnectedUsers", (usersCount) => {});

// Function to register user with the socket server
function registerWithSocketServer(userId: string | null) {
  socket.emit('registerUser', userId);
}
// Listening for online status
socket.on('userOnlineStatus', (data: { userId: string, isOnline: boolean }) => {
  console.log(`User ${data.userId} is online: ${data.isOnline}`);
  // if (data.userId === /* ObjectId of interest */) {
  //   console.log(`User ${data.userId} is online: ${data.isOnline}`);
  // }
});

// Call this function with the ObjectId after user logs in or app component mounts
registerWithSocketServer('ObjectId_of_the_user');

// Matchmaking found
socket.on("matchFound", (matchDetails) => {
    console.log("Match found:", matchDetails);
    const event = new CustomEvent("match-found", { detail: matchDetails });
    window.dispatchEvent(event);
  });

  export { registerWithSocketServer }; // Export the function to use it in components
export default socket;
