const NGROK_SERVER = 'https://0001-2804-7f0-bc02-99ca-d990-4520-718c-a655.ngrok-free.app';
const URL_DEV = `${NGROK_SERVER}/heycheff`;
const URL_MEDIA_DEV = NGROK_SERVER;

const IP_PROD = '179.124.193.12';
const URL_PROD = `http://${IP_PROD}:6015/heycheff`;
const URL_MEDIA_PROD = `http://${IP_PROD}:6015`;

const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev ? URL_DEV : URL_PROD;
export const API_URL_MEDIA = isDev ? URL_MEDIA_DEV : URL_MEDIA_PROD;