import AsyncStorage from "@react-native-async-storage/async-storage";

const JWT_STORAGE_KEY = "@heycheff:jwt";
const EXPIRATION_STORAGE_KEY = "@heycheff:expiration";

async function save(token: string, expiration: string) {
    try {
        await AsyncStorage.setItem(JWT_STORAGE_KEY, token);
        await AsyncStorage.setItem(EXPIRATION_STORAGE_KEY, expiration);
    } catch (error) {
        throw error;
    }
}

async function getToken() {
    try {
        return await AsyncStorage.getItem(JWT_STORAGE_KEY);
    } catch (error) {
        throw error;
    }
}

async function getExpiration() {
    try {
        return await AsyncStorage.getItem(EXPIRATION_STORAGE_KEY);
    } catch (error) {
        throw error;
    }
}

async function removeToken() {
    try {
        await AsyncStorage.removeItem(JWT_STORAGE_KEY);
    } catch (error) {
        throw error;
    }
}

async function removeExpiration() {
    try {
        await AsyncStorage.removeItem(EXPIRATION_STORAGE_KEY);
    } catch (error) {
        throw error;
    }
}

export const jwtStorage = {
    save,
    getToken, 
    getExpiration, 
    removeToken, 
    removeExpiration
};