import axios from 'axios';

import { clearSession, getToken } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Token expirado ou inválido: derruba a sessão e volta para o logon.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearSession();
      window.location.assign('/');
    }

    return Promise.reject(error);
  },
);

export default api;
