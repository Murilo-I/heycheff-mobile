import { NetworkInfo } from "react-native-network-info";

const netInfo = async () => {
    return await NetworkInfo.getIPAddress()
        .then(ipAddress => {
            console.log(ipAddress);
            return ipAddress;
        });
}

const NGROK_SERVER = 'https://38ba-2804-1b1-fac1-7993-6139-5a69-a54b-6822.ngrok-free.app';
const URL_DEV = `${NGROK_SERVER}/heycheff`;
const URL_MEDIA_DEV = NGROK_SERVER;

const IP_PROD = '179.124.193.12';
const URL_PROD = `http://${IP_PROD}:6015/heycheff`;
const URL_MEDIA_PROD = `http://${IP_PROD}:6015`;

const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev ? URL_DEV : URL_PROD;
export const API_URL_MEDIA = isDev ? URL_MEDIA_DEV : URL_MEDIA_PROD;