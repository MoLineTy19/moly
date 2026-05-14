import {Password, PasswordStore} from "@/types";
import {create} from "zustand";

export const usePasswordStore = create<PasswordStore>((set) => ({
    passwords: [],
    passwordCount: 0,
    isLoading: false,
    error: null,

    fetchPasswords: async () => {
        set(  {isLoading: true, error: null} );

        try {
            const res = await fetch('/api/passwords');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            set({ passwords: data, passwordCount: data.length , isLoading: false })
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false})
        }
    },

    addPassword: async (password: Omit<Password, 'id' | 'createdAt' | 'lastModified'>) => {
        set( {error: null} );

        try {
            const res = await fetch('/api/passwords/add', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({password}),
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const result = await res.json();
            const newPassword = result.data;

            set((state) => ({
                passwords: [newPassword, ...state.passwords],
                passwordCount: state.passwordCount + 1,
            }));
        } catch (err) {
            set({ error: (err as Error).message})
        }
    },

    deletePassword: async () => {
        // TODO: реализовать позже
    },
}))


export const addPassword = (password: Omit<Password, 'id' | 'createdAt' | 'lastModified'>) => usePasswordStore.getState().addPassword(password);