import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Adjust the URL to match your server/

socket.on("connect", () => {
  
});
socket.on("updateOnlineUsers", (usersCount) => {
 
});

export default socket;
