import { API_URL_MEDIA } from "@/util/endpoints";
import { jwtStorage } from "@/storage/jwt";

function fetchMedia(url: string) {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${jwtStorage.getToken()}`);
    return fetch(`${API_URL_MEDIA}${url}`, { headers });
}

async function getBlobMedia(url: string) {
    const resp = await fetchMedia(url);
    const blob = await resp.blob();
    return blob;
}

async function displayMedia(url: string) {
    const blob = await getBlobMedia(url);
    const urlBlob = URL.createObjectURL(blob)
    return urlBlob;
}

async function displayMediaType(url: string) {
    const blob = await getBlobMedia(url);
    return [URL.createObjectURL(blob), blob.type];
}

export const mediaServer = { getBlobMedia, displayMedia, displayMediaType }