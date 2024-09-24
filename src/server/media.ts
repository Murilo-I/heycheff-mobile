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

type ImageSize = {
    url: string,
    width: number,
    height: number
}

async function displayMediaSize(url: string): Promise<ImageSize> {
    const blob = await getBlobMedia(url);
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            resolve({
                url: img.src,
                width: img.width,
                height: img.height
            });
        }

        img.onerror = error => {
            reject(error);
        }

        img.src = URL.createObjectURL(blob);
    });
}

export const mediaServer = { getBlobMedia, displayMedia, displayMediaType, displayMediaSize }