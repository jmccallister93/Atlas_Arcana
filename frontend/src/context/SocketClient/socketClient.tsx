import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Adjust the URL to match your server

socket.on("connect", () => {
  console.log("Socket connected successfully");
});
socket.on("updateOnlineUsers", (usersCount) => {
  console.log("Received users count from socketClient:", usersCount);
});

export default socket;
