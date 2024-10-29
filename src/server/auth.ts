import axios from 'axios';

import { jwtStorage } from '@/storage/jwt';
import { API_URL } from '@/util/endpoints';

type TokenDetails = {
    token: string
    type: string
    userId: string
    issuedAt: Date
    expiration: Date
}

const authApi = axios.create({
    baseURL: API_URL,
});

async function authenticate(username: string, password: string) {
    const status = authApi.post<TokenDetails>("/auth", {
        username,
        password
    }).then(resp => {
        jwtStorage.save(resp.data.token, resp.data.expiration.toString());
        return resp.status;
    })
        .catch(error => console.log("Error authenticating: " + error));

    return status;
}

async function register(email: string, username: string, password: string) {
    const status = authApi.post("/user", {
        email,
        username,
        password
    }).then(resp => resp.status)
        .catch(error => console.log("Error creating user: " + error));

    return status;
}

async function authenticateWithClerk(sessionId: string, userEmail: string) {
    const status = authApi.post<TokenDetails>("/auth/clerk", {
        sessionId,
        userEmail
    }).then(resp => {
        jwtStorage.save(resp.data.token, resp.data.expiration.toString());
        return resp.status;
    })
        .catch(error => console.log("Error authenticating: " + error));

    return status;
}

export const authServer = { authenticate, register, authenticateWithClerk }