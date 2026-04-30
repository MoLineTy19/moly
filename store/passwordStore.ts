import {createJSONStorage, persist} from "zustand/middleware";
import {create} from "zustand";
import {idbStorage} from "@/lib/storage";

export interface PasswordEntry {
    id?: string;
    service: string;
    username: string;
    password: string;
    category: string;
    status: number;
    url?: string;
    tags?: string[];
    notes?: string;
    createdAt?: number;
}

interface PasswordState {
    entries: PasswordEntry[],
    addEntry: (data: PasswordEntry) => void;
    removeEntry: (id: string) => void;
}

const usePasswordStore = create<PasswordState>()(
    persist(
        (set, get) => ({
            entries: [],
            addEntry: (data: PasswordEntry) => {
                const newEntry: PasswordEntry = {
                    id: crypto.randomUUID(),
                    service: data.service,
                    username: data.username,
                    password: data.password,
                    category: data.category,
                    url: data.url,
                    status: data.status,
                    tags: data.tags,
                    notes: data.notes,
                    createdAt: Date.now(),
                };
                set((state) => ({ entries: [newEntry, ...state.entries]}))
            },
            removeEntry: (id: string) => {
                set((state) => ({ entries: state.entries.filter(e => e.id !== id)}))
            }
        }),
        {
            name: 'test-password',
            storage: createJSONStorage(() => idbStorage)
        }
    )
)

export const PasswordData = () => usePasswordStore((state) => state.entries);
export const PasswordCount = () => usePasswordStore((state) => state.entries.length);
export const PasswordAdd = (passwordData: PasswordEntry) => usePasswordStore.getState().addEntry(passwordData);
export const PasswordRemove = (passwordId: string) => usePasswordStore.getState().removeEntry(passwordId)