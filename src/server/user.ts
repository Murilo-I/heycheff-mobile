
import api from "./api";

export type UserInfo = {
    username: string,
    followers: number,
    followersIds: [],
    following: number,
    receiptsCount: number
}

export type FollowResponse = {
    following: []
}

const baseUrl = "/user";

async function findById(userId: string) {
    return api.get<UserInfo>(`${baseUrl}/${userId}`)
        .then(resp => resp.data)
        .catch(error => {
            console.log("Failed to get user by id -> " + error);
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

async function follow(userId: string, userToFollowId: string) {
    return api.post<FollowResponse>(baseUrl + "/follow", {
        userId,
        userToFollowId
    }).then(resp => resp.data)
        .catch(error => {
            console.log("Error trying to follow user: " + error);
            throw error;
        });
}

export const userServer = { findById, register, follow }