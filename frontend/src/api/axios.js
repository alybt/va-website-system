import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Or your XAMPP path
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;