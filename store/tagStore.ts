import {create} from "zustand";
import {TagStore} from "@/types";
import {Tag} from "@/types/components";

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

    addTag: async () => {
        // TODO: реализовать позже
    },

    deleteTag: async () => {
        // TODO: реализовать позже
    },

    editTag: async (tag: Tag) => {
        const id = tag.id;
        const res = await fetch(`/api/tags/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({tag}),
        });
        if (!res.ok) throw new Error('Failed to fetch');
        set((state) => ({
            tags: state.tags.map((value) => value.id === tag.id ? tag : value),
            error: null,
    }))
    },

    reorderTags: async (newOrder: Tag[]) => {
        const ids = newOrder.map(tag => tag.id);
        const res = await fetch('/api/tags/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ids}),
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const updatedTags = await res.json();
        set({ tags: updatedTags });
    }
}))

export const editTag = (tag: Tag) => useTagStore.getState().editTag(tag)
export const addTag = (tag: Tag) => useTagStore.getState().addTag(tag)
export const deleteTag = (id: number) => useTagStore.getState().deleteTag(id)
export const reorderTags = (newOrder: Tag[]) => useTagStore.getState().reorderTags(newOrder)