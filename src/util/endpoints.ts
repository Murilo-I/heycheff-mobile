import { NetworkInfo } from "react-native-network-info";

const netInfo = async () => {
    return await NetworkInfo.getIPAddress()
        .then(ipAddress => {
            console.log(ipAddress);
            return ipAddress;
        });
}

const IP = '9.86.218.125';

const URL_DEV = `http://${IP}:6015/heycheff`;
const URL_MEDIA_DEV = `http://${IP}:6015`;

const URL_PROD = "http://179.124.193.12:6015/heycheff";
const URL_MEDIA_PROD = "http://179.124.193.12:6015";

const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev ? URL_DEV : URL_PROD;
export const API_URL_MEDIA = isDev ? URL_MEDIA_DEV : URL_MEDIA_PROD;