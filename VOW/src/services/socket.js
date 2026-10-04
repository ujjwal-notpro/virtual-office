import { io } from 'socket.io-client';
import { getStoredToken } from './api';

// Realtime backend URL (uses environment variable if deployed on Vercel)
const REALTIME_URL = import.meta.env.VITE_REALTIME_URL || 'http://localhost:8000';

let socket = null;

// Connect to realtime backend with JWT auth
export const connectSocket = () => {
  if (socket && socket.connected) {
    return socket;
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
  });

  socket.on('disconnect', (reason) => {
    console.log('[VOW Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[VOW Socket] Connection error:', error.message);
  });

  return socket;
};

// Get current socket instance
export const getSocket = () => socket;

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Join a room
export const joinRoom = (roomId) => {
  if (socket && socket.connected) {
    socket.emit('join-room', roomId);
  }
};

// Leave a room
export const leaveRoom = (roomId) => {
  if (socket && socket.connected) {
    socket.emit('leave-room', roomId);
  }
};

export default { connectSocket, getSocket, disconnectSocket, joinRoom, leaveRoom };
