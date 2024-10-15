import axios from 'axios';

// Configuração base para o axios
const api = axios.create({
  baseURL: 'https://gamehub-back-6h0k.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
