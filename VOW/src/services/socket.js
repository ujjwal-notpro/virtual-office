import { io } from 'socket.io-client';
import { getStoredToken } from './api';

const REALTIME_URL = import.meta.env.VITE_REALTIME_URL || (
  import.meta.env.DEV ? 'http://localhost:8000' : null
);

let socket = null;
const joinedRooms = new Set();

export const connectSocket = () => {
  if (socket) {
    if (!socket.connected) socket.connect();
    return socket;
  }

  if (!REALTIME_URL) {
    console.error(
      '[VOW Socket] Missing VITE_REALTIME_URL. Set it to the public URL of the realtime backend before deploying.'
    );
    return null;
  }

  const token = getStoredToken();

  socket = io(REALTIME_URL, {
    auth: {
      token: token,
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[VOW Socket] Connected:', socket.id);
    joinedRooms.forEach((roomId) => socket.emit('join-room', roomId));
  });

  socket.on('disconnect', (reason) => {
    console.log('[VOW Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[VOW Socket] Connection error:', error.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  joinedRooms.clear();
};

export const joinRoom = (roomId) => {
  joinedRooms.add(roomId);
  if (socket?.connected) {
    socket.emit('join-room', roomId);
  }
};

export const leaveRoom = (roomId) => {
  joinedRooms.delete(roomId);
  if (socket?.connected) {
    socket.emit('leave-room', roomId);
  }
};

export default { connectSocket, getSocket, disconnectSocket, joinRoom, leaveRoom };
