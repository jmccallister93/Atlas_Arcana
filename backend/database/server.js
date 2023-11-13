require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the Express app
const socketController = require('../matchmaking/socketController'); // Adjust the path as necessary

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

let onlineUsers = 0;

// Single connection handler
io.on('connection', (socket) => {
  onlineUsers++;
  io.emit("updateOnlineUsers", onlineUsers);

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit("updateOnlineUsers", onlineUsers);
  });

  socketController(socket);

  socket.on('error', (error) => {
    console.error('Socket.io error:', error);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
