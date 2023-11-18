//SERVER

require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");
const app = require("./expressApp"); // Import the Express app
const socketController = require("../socket/socketController");
const matchmakingService = require("../matchmaking/matchmakingService");

const server = http.createServer(app);

// Base socket setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Online total users count socket
let onlineUsersCount = 0;
io.on("connection", (socket) => {
  onlineUsersCount++;
  io.emit("updateOnlineUsers", onlineUsersCount);

  socket.on("disconnect", () => {
    onlineUsersCount--;
    io.emit("updateOnlineUsers", onlineUsersCount);
  });

  socketController(socket, io); // Pass 'io' to manage broadcasts/emits

  socket.on("error", (error) => {
    console.error("Socket.io error:", error);
  });

  socket.on("requestOnlineUsersCount", () => {
    socket.emit("updateOnlineUsers", onlineUsersCount);
  });

  // Example of setting the player ID and socket ID mapping
  socket.on("registerPlayer", (playerId) => {
    console.log("***** Registerplayer fired");
    connectedUsers.set(playerId, socket.id);
  });
  socket.on("joinMatchmaking", (data) => {
    console.log("User joining matchmaking from server.js:", data.userId);
    matchmakingService.addToQueue(data.userId);
  });
});

// Online Single user by ObjectId
const connectedUsers = new Map(); // Key: ObjectId, Value: socket.id

// Start matchmaking process
matchmakingService.startMatchmaking(connectedUsers, io); // Ensure your matchmakingService is adapted to handle 'io'

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
