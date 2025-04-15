// src/utils/request.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // URL backend của bạn

const request = axios.create({
    baseURL: API_URL, // Thay bằng URL backend của bạn
    timeout: 6000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default request;
