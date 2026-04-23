import {create} from "zustand";


export interface PasswordStructure {
    name: string;
    login: string;
    category: string;
    password: string;
    status: string;
    updatedAt: string;
}

interface IPasswordState {
    data: Array<PasswordStructure>;
    addPassword: (password: PasswordStructure) => void;
    removePassword: (password: PasswordStructure) => void;
}

const usePasswordStore = create<IPasswordState>()((set) => ({
    data: [{name: 'Valorant', status: 'Надежный', login: '123@gmail.com', password: '123', category: 'Личное', updatedAt: "12 января 2025"}],
    addPassword: (password) => set((state) => ({
        data: [...state.data, password],
    })),
    removePassword: (password) => set((state) => ({
        data: state.data.filter((i) => i !== password),
    }))
}))

export const useCountPassword = () => usePasswordStore((state) => state.data.length)
export const useData = () => usePasswordStore((state) => state.data)
export const addPassword = (password: PasswordStructure) => usePasswordStore.getState().addPassword(password)
export const removePassword = (password: PasswordStructure) => usePasswordStore.getState().removePassword(password)