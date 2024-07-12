import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_DOMAIN_WS, {
  path: '/api',
  withCredentials: true, // include credentials when making cross-origin requests
  transports: ['websocket', 'polling'] // use only WebSocket transport (optional)
});

export default socket;
