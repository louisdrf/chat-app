import axios from 'axios';

const config = axios.create({
    baseURL: 'http://localhost:3001/', 
    timeout: 3000,
    headers: { 'Content-Type': 'application/json' },
});

export default config;
