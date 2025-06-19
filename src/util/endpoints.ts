const NGROK_SERVER = 'https://36d4-2804-1b1-fac3-8dfb-a9c4-7d93-5757-945a.ngrok-free.app';
const URL_DEV = `${NGROK_SERVER}/heycheff`;
const URL_MEDIA_DEV = NGROK_SERVER;

const BASE_URL = 'https://heycheff-api-h5bcceg3c8acgraz.westus-01.azurewebsites.net';
const URL_PROD = `${BASE_URL}/heycheff`;
const URL_MEDIA_PROD = `${URL_PROD}/media?path=`;

const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev ? URL_DEV : URL_PROD;
export const API_URL_MEDIA = isDev ? URL_MEDIA_DEV : URL_MEDIA_PROD;