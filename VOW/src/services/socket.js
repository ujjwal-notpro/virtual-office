import { io } from 'socket.io-client';
import { getStoredToken } from './api';

const REALTIME_URL = import.meta.env.VITE_REALTIME_URL || 'https://virtual-office-2.onrender.com';

let socket = null;
const joinedRooms = new Set();

export const connectSocket = () => {
  if (socket) {
    if (!socket.connected) socket.connect();
    return socket;
  }

  if (!REALTIME_URL) {
    console.warn('[VOW Socket] REALTIME_URL not set');
    return null;
  }

  const token = getStoredToken();

  socket = io(REALTIME_URL, {
    auth: {
      token: token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[VOW Socket] Connected to realtime backend:', socket.id);
    joinedRooms.forEach((roomId) => socket.emit('join-room', roomId));
  });

  socket.on('disconnect', (reason) => {
    console.log('[VOW Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.warn('[VOW Socket] Realtime connection warning:', error.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  joinedRooms.clear();
};

export const joinRoom = (roomId) => {
  if (!roomId) return;
  joinedRooms.add(roomId);
  const s = getSocket();
  if (s?.connected) {
    s.emit('join-room', roomId);
  }
};

export const leaveRoom = (roomId) => {
  if (!roomId) return;
  joinedRooms.delete(roomId);
  const s = getSocket();
  if (s?.connected) {
    s.emit('leave-room', roomId);
  }
};

export default { connectSocket, getSocket, disconnectSocket, joinRoom, leaveRoom };
