import api from "./api";
import { Step } from "./step";
import { Tag } from "./tag";

type Pageable<T> = {
    items: T[]
    count: number
}

export type ReceiptFeed = {
    id: number
    thumb: string
    titulo: string
    tags: Tag[]
    estimatedTime: number
}

type ReceiptModal = {
    userId: string,
    steps: Step[]
}

export type ReceiptRequest = {
    titulo: string,
    tags: Tag[],
    thumb: File
}

const baseUrl = '/receitas'

async function loadFeed(pageNum: number, pageSize: number, userId?: string) {
    try {
        return await api.get<Pageable<ReceiptFeed>>(baseUrl, {
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
        return await api.get<ReceiptModal>(`${baseUrl}/${id}`);
    } catch (error) {
        throw error;
    }
}

async function save(receipt: ReceiptRequest) {
    const formData = new FormData();
    formData.append('titulo', receipt.titulo);
    formData.append('tags', JSON.stringify(receipt.tags));
    formData.append('thumb', receipt.thumb);

    try {
        return await api.post<{ seqId: number }>(baseUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    } catch (error) {
        throw error;
    }
}

async function updateStatus(receiptId: number) {
    try {
        await api.patch(`${baseUrl}/${receiptId}`, {
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

export const receiptServer = { loadFeed, loadModal, save, updateStatus }