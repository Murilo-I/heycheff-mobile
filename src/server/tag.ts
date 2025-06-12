import api from "./api"

export type Tag = {
    id: number
    tag: string
}

const baseUrl = '/tags'

async function findAll() {
    try {
        return api.get<Tag[]>(baseUrl).then(resp => resp.data);
    } catch (error) {
        throw error;
    }
}

export const tagServer = { findAll }