import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3000/api' : null
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (!API_BASE_URL) {
    return Promise.reject(new Error(
      'Missing VITE_API_URL. Configure the public API URL in Vercel before deploying.'
    ));
  }
  const token = localStorage.getItem('vow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const registerUser = async ({ name, email, phone, password, role }) => {
  const response = await api.post('/users', { name, email, phone, password, role });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const sendOTP = async ({ email, password, method }) => {
  const response = await api.post('/auth/send-otp', { email, password, method });
  return response.data;
};

export const verifyOTP = async ({ userId, otp }) => {
  const response = await api.post('/auth/verify-otp', { userId, otp });
  return response.data;
};


export const saveAuth = (token, user) => {
  localStorage.setItem('vow_token', token);
  localStorage.setItem('vow_user', JSON.stringify(user));
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('vow_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem('vow_token');
};

export const clearAuth = () => {
  localStorage.removeItem('vow_token');
  localStorage.removeItem('vow_user');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('vow_token');
};

export default api;
