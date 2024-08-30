import { API_URL_MEDIA } from "@/constants/endpoints";
import { jwtStorage } from "@/storage/jwt";

function fetchMedia(url: string) {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${jwtStorage.getToken()}`);
    return fetch(`${API_URL_MEDIA}${url}`, { headers });
}

async function getBlobMedia(url: string) {
    const resp = await fetchMedia(url);
    return await resp.blob();
}

async function displayMedia(url: string) {
    return URL.createObjectURL(await getBlobMedia(url));
}

async function displayMediaType(url: string) {
    const blob = await getBlobMedia(url);
    return [URL.createObjectURL(blob), blob.type];
}

export const mediaServer = { getBlobMedia, displayMedia, displayMediaType }