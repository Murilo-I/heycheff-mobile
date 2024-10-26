import * as SecureStore from 'expo-secure-store';

const JWT_STORAGE_KEY = "heycheff.jwt";
const EXPIRATION_STORAGE_KEY = "heycheff.expiration";

async function save(token: string, expiration: string) {
    try {
        await SecureStore.setItemAsync(JWT_STORAGE_KEY, token);
        await SecureStore.setItemAsync(EXPIRATION_STORAGE_KEY, expiration);
    } catch (error) {
        throw error;
    }
}

async function getToken() {
    try {
        return await SecureStore.getItemAsync(JWT_STORAGE_KEY);
    } catch (error) {
        throw error;
    }
}

async function getExpiration() {
    try {
        return await SecureStore.getItemAsync(EXPIRATION_STORAGE_KEY);
    } catch (error) {
        throw error;
    }
}

async function removeToken() {
    try {
        await SecureStore.deleteItemAsync(JWT_STORAGE_KEY);
    } catch (error) {
        throw error;
    }
}

async function removeExpiration() {
    try {
        await SecureStore.deleteItemAsync(EXPIRATION_STORAGE_KEY);
    } catch (error) {
        throw error;
    }
}

async function removeAll() {
    removeToken();
    removeExpiration();
}

export const jwtStorage = {
    save,
    getToken, 
    getExpiration, 
    removeAll
};