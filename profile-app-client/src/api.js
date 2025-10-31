import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
