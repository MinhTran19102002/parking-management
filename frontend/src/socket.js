import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_DOMAIN_WS, {
  // path: "/my-custom-path/",
  // withCredentials: true, // include credentials when making cross-origin requests
  transports: ['websocket'] // use only WebSocket transport (optional)
});

export default socket;
