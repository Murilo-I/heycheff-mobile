import { userId } from "@/storage/userId";
import api from "./api";
import { Step } from "./step";
import { Tag } from "./tag";

type Pageable<T> = {
    items: T[]
    count: number
}

export type RecipeFeed = {
    id: number
    thumb: string
    titulo: string
    tags: Tag[]
    estimatedTime: number
}

export type RecipeModal = {
    userId: string,
    steps: Step[]
}

export type RecipeRequest = {
    titulo: string,
    tags: Tag[],
    file: { uri: string, name: string, type: string }
}

export const baseUrl = '/receitas';

async function loadFeed(pageNum: number, pageSize: number, userId?: string) {
    try {
        return await api.get<Pageable<RecipeFeed>>(baseUrl, {
            params: {
                pageNum,
                pageSize,
                userId
            }
        });
    } catch (error) {
        throw error;
    }
}

async function loadModal(id: number) {
    try {
        return await api.get<RecipeModal>(`${baseUrl}/${id}`);
    } catch (error) {
        throw error;
    }
}

async function save(recipe: RecipeRequest) {
    const formData = new FormData();
    formData.append('titulo', recipe.titulo);
    formData.append('tags', JSON.stringify(recipe.tags));
    formData.append('thumb', recipe.file as any);
    const uid = await userId.get();
    formData.append('userId', uid ? uid : '');

    try {
        return await api.post<{ seqId: number }>(baseUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: (data, headers) => {
                return data;
            }
        });
    } catch (error) {
        throw error;
    }
}

async function updateStatus(recipeId: number) {
    try {
        await api.patch(`${baseUrl}/${recipeId}`, {
            status: true
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        throw error;
    }
}

export const recipeServer = { loadFeed, loadModal, save, updateStatus }