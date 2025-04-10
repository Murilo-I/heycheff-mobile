import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { router } from "expo-router";

import { jwtStorage } from '@/storage/jwt';
import { API_URL } from '@/util/endpoints';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async config => {
    const jwt = await jwtStorage.getToken();
    config.headers.Authorization = `Bearer ${jwt}`;
    return config;
});

api.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry403: boolean };

    if (error.response?.status === 403) {
        if (!originalRequest._retry403) {
            originalRequest._retry403 = true;
            return api(originalRequest);
        }
        router.navigate('/start/login');
    }

    return Promise.reject(error);
});

export default api;