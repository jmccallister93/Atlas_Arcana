require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the Express app
const socketController = require('../matchmaking/socketController'); // Adjust the path as necessary

const server = http.createServer(app);
const io = socketIo(server);

let onlineUsers = 0;

// Single connection handler
io.on('connection', (socket) => {
  onlineUsers++;
  console.log(`A user connected. Users online: ${onlineUsers}`);

  socket.on('disconnect', () => {
    onlineUsers--;
    console.log(`User disconnected. Users online: ${onlineUsers}`);
  });
  
  console.log('A user connected');

  // Handle game-related events with your socket controller
  socketController(socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
