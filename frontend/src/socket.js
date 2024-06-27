import io from 'socket.io-client';

const socket = io('http://localhost:8010/', {
  withCredentials: true, // include credentials when making cross-origin requests
  transports: ['websocket'] // use only WebSocket transport (optional)
});

export default socket;