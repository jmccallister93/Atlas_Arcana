import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust the URL to match your server

export default socket;
