
import api from "./api";

export type UserInfo = {
    username: string,
    followers: number,
    following: number,
    receiptsCount: number
}

const baseUrl = "/user";

async function findById(userId: string) {
    return api.get<UserInfo>(`${baseUrl}/${userId}`)
        .then(resp => resp.data)
        .catch(error => {
            console.log('failed to get user by id -> ' + error);
            throw error;
        });
}

async function register(email: string, username: string, password: string) {
    const status = api.post(baseUrl, {
        email,
        username,
        password
    }).then(resp => resp.status)
        .catch(error => console.log("Error creating user: " + error));

    return status;
}

export const userServer = { findById, register }