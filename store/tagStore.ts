import {create} from "zustand";
import {TagStore} from "@/types";
import {Tag} from "@/types/components";
import {usePasswordStore} from "@/store/passwordStore";

export const useTagStore = create<TagStore>((set) => ({
    tags: [],
    isLoading: false,
    error: null,

    fetchTags: async () => {
        set( {isLoading: true, error: null});

        try {
            const res = await fetch('/api/tags');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            set({ tags: data, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    addTag: async (tag) => {
        const res = await fetch('/api/tags', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tag}),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || 'Failed to create tag');
        }
        const data = await res.json();
        set((state) => ({tags: [...state.tags, data.data], error: null}));
    },


    deleteTag: async (id) => {
        const res = await fetch(`/api/tags/${id}`, {method: "DELETE"});
        if (!res.ok) throw new Error('Failed to delete tag');
        set((state) => ({tags: state.tags.filter((value) => value.id !== id), error: null}));
        await usePasswordStore.getState().fetchPasswords();
    },

    editTag: async (tag: Tag) => {
        const id = tag.id;
        const res = await fetch(`/api/tags/${id}`, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tag}),
        });
        if (!res.ok) throw new Error('Failed to fetch');
        set((state) => ({
            tags: state.tags.map((value) => value.id === tag.id ? tag : value),
            error: null,
        }));
    },


    reorderTags: async (newOrder: Tag[]) => {
        const ids = newOrder.map(tag => tag.id);
        const res = await fetch('/api/tags/reorder', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ids}),
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const updatedTags = await res.json();
        set({tags: updatedTags});
    },
}))

export const editTag = (tag: Tag) => useTagStore.getState().editTag(tag);
export const addTag = (tag: Omit<Tag, 'id' | 'countUses' | 'position'>) => useTagStore.getState().addTag(tag);
export const deleteTag = (id: number) => useTagStore.getState().deleteTag(id);
export const reorderTags = (newOrder: Tag[]) => useTagStore.getState().reorderTags(newOrder);