const KITE_SERVER = 'https://heycheff.pagekite.me';
const URL_DEV = `${KITE_SERVER}/heycheff`;
const URL_MEDIA_DEV = KITE_SERVER;

const BASE_URL = process.env.BASE_URL;
const URL_PROD = `${BASE_URL}/heycheff`;
const URL_MEDIA_PROD = `${URL_PROD}/media?path=`;

const isDev = process.env.NODE_ENV !== 'development';

export const API_URL = isDev ? URL_DEV : URL_PROD;
export const API_URL_MEDIA = isDev ? URL_MEDIA_DEV : URL_MEDIA_PROD;