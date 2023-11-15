//SERVER

require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the Express app
const socketController = require('../matchmaking/socketController'); 
const matchmakingService = require('../matchmaking/matchmakingService');

const server = http.createServer(app);

let onlineUsersCount = 0;

// Base socket setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Online users socket
io.on('connection', (socket) => {
  onlineUsersCount++;
  io.emit('updateOnlineUsers', onlineUsersCount);

  socket.on('disconnect', () => {
    onlineUsersCount--;
    io.emit('updateOnlineUsers', onlineUsersCount);
  });
  socketController(socket, io); // Pass 'io' to manage broadcasts/emits

  socket.on('error', (error) => {
    console.error('Socket.io error:', error);
  });
  socket.on('requestOnlineUsersCount', () => {
    socket.emit('updateOnlineUsers', onlineUsersCount);
  });
});

// Match making socket
io.on('connection', (socket) => {
  console.log('New client connected');
  require('../matchmaking/socketController')(socket, io);
  // Additional socket event listeners...
});
// Start matchmaking process
matchmakingService.startMatchmaking();

io.on('connection', (socket) => {
  socket.on('joinMatchmaking', (data) => {
    console.log('User joining matchmaking from server.js:', data.userId);
    // Add matchmaking logic here
  });

  // ... other event handlers ...
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
