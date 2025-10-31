import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const request = axios.create({
    baseURL: API_URL, // Replace with your backend URL
    timeout: 6000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default request;
