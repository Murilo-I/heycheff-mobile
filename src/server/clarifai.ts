import axios from "axios";

export const clarifai = axios.create({
    baseURL: 'https://api.clarifai.com',
    headers: {
        "Authorization": `Key ${process.env.EXPO_PUBLIC_CLARIFAI_KEY}`
    }
});