import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: apiBase,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
