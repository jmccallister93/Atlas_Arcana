//SERVER

require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the Express app
const socketController = require('../matchmaking/socketController'); // Adjust the path as necessary

const server = http.createServer(app);

let onlineUsersCount = 0;

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

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

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
