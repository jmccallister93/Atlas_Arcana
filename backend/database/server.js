const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the Express app
const socketController = require('../matchmaking/socketController'); // Adjust the path as necessary

const server = http.createServer(app);
const io = socketIo(server);

// Single connection handler
io.on('connection', (socket) => {
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
