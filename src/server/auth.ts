import axios from 'axios';

import { jwtStorage } from '@/storage/jwt';
import { userId } from '@/storage/userId';
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
        putStorage(resp.data);
        return resp.status;
    })
        .catch(error => console.log("Error authenticating: " + error));

    return status;
}

async function authenticateWithClerk(sessionId: string, userEmail: string) {
    const status = authApi.post<TokenDetails>("/auth/clerk", {
        sessionId,
        userEmail
    }).then(resp => {
        putStorage(resp.data);
        return resp.status;
    })
        .catch(error => console.log("Error authenticating: " + error));

    return status;
}

async function putStorage(tokenDetails: TokenDetails) {
    jwtStorage.save(tokenDetails.token, tokenDetails.expiration.toString());
    userId.save(tokenDetails.userId);
}

export const authServer = { authenticate, authenticateWithClerk }