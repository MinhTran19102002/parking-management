import io from 'socket.io-client';

const socket = io('http://localhost:8010/api', {
  // path: '/api',
  withCredentials: true, // include credentials when making cross-origin requests
  transports: ['websocket'] // use only WebSocket transport (optional)
});

export default socket;