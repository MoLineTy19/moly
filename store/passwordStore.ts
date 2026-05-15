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

    editPassword: async (editedPassword: Omit<Password, 'lastModified'>) => {
        set( {error: null} );

        try {
            const res = await fetch(`/api/passwords/${editedPassword.id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify((editedPassword)),
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const updated = await res.json();
            set((state) => ({
                passwords: state.passwords.map((p) =>
                    p.id === updated.data.id ? updated.data : p
                ),
                error: null
            }));
        } catch (err) {
            set({ error: (err as Error).message })
        }
    }
}))


export const addPassword = (password: Omit<Password, 'id' | 'createdAt' | 'lastModified'>) => usePasswordStore.getState().addPassword(password);
export const editPassword = (password: Password) => usePasswordStore.getState().editPassword(password);