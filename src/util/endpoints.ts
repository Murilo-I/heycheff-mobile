import { NetworkInfo } from "react-native-network-info";

const netInfo = async () => {
    return await NetworkInfo.getIPAddress()
        .then(ipAddress => {
            console.log(ipAddress);
            return ipAddress;
        });
}

const IP_DEV = '192.168.15.3';
const URL_DEV = `http://${IP_DEV}:6015/heycheff`;
const URL_MEDIA_DEV = `http://${IP_DEV}:6015`;

const IP_PROD = '179.124.193.12';
const URL_PROD = `http://${IP_PROD}:6015/heycheff`;
const URL_MEDIA_PROD = `http://${IP_PROD}:6015`;

const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev ? URL_DEV : URL_PROD;
export const API_URL_MEDIA = isDev ? URL_MEDIA_DEV : URL_MEDIA_PROD;