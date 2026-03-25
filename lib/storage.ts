import AsyncStorage from "@react-native-async-storage/async-storage";

// Typed key name to prevent typos

export const STORAGE_KEY = {
    PROFILE: "profile",
    NOTIFICATIONS: "notifications",
    PROFILE_PHOTO: "profile_Photo",
} as const

// Get a value from storage (auto-parses JSON)

export const get = async <T>(key: string): Promise<T | null> => {
    const value = await AsyncStorage.getItem(key);
    if(value === null) return null;
    return JSON.parse(value) as T;
}

// Set a value in storage (auto-stringifies JSON)

export const set = async <T> (key: string, value: unknown): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

// Remove a value from storage

export const remove = async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
}