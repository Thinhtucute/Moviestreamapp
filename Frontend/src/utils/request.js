// src/utils/request.js
import axios from 'axios';

const request = axios.create({
    baseURL: 'http://localhost:8080', // Thay bằng URL backend của bạn
    timeout: 6000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default request;
