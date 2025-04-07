import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})