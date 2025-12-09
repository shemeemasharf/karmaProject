import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7225/api', // your .NET backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
