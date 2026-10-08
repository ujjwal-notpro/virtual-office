import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://virtual-office-3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async ({ name, email, phone, password, role = 'employee' }) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (name || '').trim();

  try {
    const response = await api.post('/users', {
      name: cleanName,
      email: cleanEmail,
      phone: phone ? String(phone).trim() : '',
      password: password,
      role: role || 'employee',
    });

    const data = response?.data;
    const registeredUser = data?.user || data;

    try {
      const loginRes = await api.post('/auth/login', { email: cleanEmail, password });
      if (loginRes?.data?.token) {
        saveAuth(loginRes.data.token, loginRes.data.user || registeredUser);
        return {
          token: loginRes.data.token,
          user: loginRes.data.user || registeredUser,
          message: data?.message || 'User created successfully',
        };
      }
    } catch (loginErr) {
      console.warn('Auto-login after register warning:', loginErr.message);
    }

    return { user: registeredUser, message: data?.message || 'User created successfully' };
  } catch (error) {
    let msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED' ? 'Server timeout. Please try again.' : null) ||
      error.message ||
      'Registration failed. Please check your details.';

    if (typeof msg === 'string' && msg.includes('E11000 duplicate key error')) {
      msg = 'An account is already registered with this email. Please sign in instead.';
    }
    throw new Error(msg);
  }
};

export const loginUser = async ({ email, password }) => {
  const cleanEmail = (email || '').trim().toLowerCase();

  try {
    const response = await api.post('/auth/login', {
      email: cleanEmail,
      password: password,
    });

    if (response?.data && response.data.token) {
      return response.data;
    }
    throw new Error(response?.data?.message || 'Login failed: Invalid server response.');
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED' ? 'Server timeout. Please try again.' : null) ||
      error.message ||
      'Invalid email or password.';
    throw new Error(msg);
  }
};

export const saveAuth = (token, user) => {
  if (token) localStorage.setItem('vow_token', token);
  if (user) localStorage.setItem('vow_user', JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('vow_auth_change', { detail: { token, user } }));
};

export const loginAndSave = async ({ email, password }) => {
  const res = await loginUser({ email, password });
  const token = res?.token;
  const user = res?.user;
  if (!token) {
    throw new Error(res?.message || 'Login failed: Server did not return a session token.');
  }
  saveAuth(token, user);
  return { token, user };
};

export const socialLogin = (provider = 'Google') => {
  const name = `${provider} User`;
  const email = `user@${provider.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  const user = {
    _id: 'usr_soc_' + Date.now(),
    name,
    email,
    role: 'employee',
    avatar: '',
  };
  const token = 'vow_tok_soc_' + btoa(email) + '_' + Date.now();
  saveAuth(token, user);
  return { token, user };
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
  window.dispatchEvent(new CustomEvent('vow_auth_change', { detail: { token: null, user: null } }));
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('vow_token');
};

export default api;
