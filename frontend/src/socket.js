import io from 'socket.io-client';

const socket = io('https://parking-api-h07g.onrender.com/', {
  withCredentials: true, // include credentials when making cross-origin requests
  transports: ['websocket'] // use only WebSocket transport (optional)
});

export default socket;