import * as SecureStore from 'expo-secure-store';

const key = "heycheff.userId";

async function get() {
    try {
        return SecureStore.getItem(key) || undefined;
    } catch (error) {
        throw error;
    }
}

async function save(id: string) {
    try {
        return SecureStore.setItemAsync(key, id);
    } catch (error) {
        throw error;
    }
}

export const userId = { get, save }