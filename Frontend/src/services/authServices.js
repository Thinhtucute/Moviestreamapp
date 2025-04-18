import axios from 'axios';
import { data } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const login = async (credential) => {
    const response = await axios.post(`${API_URL}/auth/token`, credential);
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/users/add`, userData);
    console.log(response.data);
    return response.data;
};

export const introspect = async (token) => {
    const response = await axios.post(`${API_URL}/auth/introspect`, { token });
    return response.data;
};

export const refreshToken = async (token) => {
    const response = await axios.post(`${API_URL}/auth/refresh`, { token });
    return response.data;
};

export const logout = async (token) => {
    const response = await axios.post(
        `${API_URL}/auth/logout`,
        { token }, // Gửi token trong body
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};
