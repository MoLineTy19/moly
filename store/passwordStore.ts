import {createJSONStorage, persist} from "zustand/middleware";
import {create} from "zustand";
import {idbStorage} from "@/lib/storage";
import {Password} from "@/types";

interface PasswordState {
    entries: Password[],
    addEntry: (data: Omit<Password, 'id' | 'createdAt' | 'lastModified'>) => void;
    removeEntry: (id: string) => void;
}

const usePasswordStore = create<PasswordState>()(
    persist(
        (set, get) => ({
            entries: [],
            addEntry: (data: Omit<Password, 'id' | 'createdAt' | 'lastModified'>) => {
                const newEntry: Password = {
                    ...data,
                    id: crypto.randomUUID(),
                    createdAt: Date.now(),
                    lastModified: Date.now(),
                };
                set((state) => ({ entries: [newEntry, ...state.entries]}))
            },
            removeEntry: (id: string) => {
                set((state) => ({ entries: state.entries.filter(e => e.id !== id)}))
            }
        }),
        {
            name: 'password-storage',
            storage: createJSONStorage(() => idbStorage)
        }
    )
)

export const PasswordData = () => usePasswordStore((state) => state.entries);
export const PasswordCount = () => usePasswordStore((state) => state.entries.length);
export const PasswordAdd = (passwordData: Omit<Password, 'id' | 'createdAt' | 'lastModified'>) => usePasswordStore.getState().addEntry(passwordData);
export const PasswordRemove = (passwordId: string) => usePasswordStore.getState().removeEntry(passwordId)