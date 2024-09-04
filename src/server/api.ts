import axios, { AxiosError } from 'axios';
import { router } from "expo-router";

import { API_URL } from '@/constants/endpoints';
import { jwtStorage } from '@/storage/jwt';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(config => {
    const jwt = jwtStorage.getToken();
    config.headers.Authorization = `Bearer ${jwt}`;
    return config;
});

api.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
        router.navigate('/screen/login');
    }

    return Promise.reject(error);
});

export default api;