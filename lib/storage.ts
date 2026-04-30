import { get, set, del } from 'idb-keyval';

export const idbStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null;
    },

    setItem: async (name: string, value: string | null): Promise<void> => {
        await set(name, value);
    },

    removeItem: async (name: string): Promise<void> => {
        await del(name);
    }
}