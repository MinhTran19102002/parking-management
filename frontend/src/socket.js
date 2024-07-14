import io from 'socket.io-client';

const socket = io('http://localhost:8010', {
  // path: "/my-custom-path/",
  // withCredentials: true, // include credentials when making cross-origin requests
  transports: ['websocket'] // use only WebSocket transport (optional)
  // secure: true,
  // reconnect: true,
  // rejectUnauthorized: false, // only if you are dealing with self-signed certificates
});

export default socket;
