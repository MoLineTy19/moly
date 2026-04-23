import {create} from "zustand";

export interface TagStructure {
    title: string;
}

interface ITagState {
    data: Array<TagStructure>;
    selectedTag: Array<TagStructure>;
    addTag: (title: TagStructure) => void;
    removeTag: (title: TagStructure) => void;
}

const useTagStore = create<ITagState>()((set) => ({
    data: [{title: 'Личное'}, {title: 'Работа'}, {title: 'Работа'}],
    selectedTag: [],
    addTag: (title) => set((state) => ({
        selectedTag: [...state.selectedTag, title],
    })),
    removeTag: (title) => set((state) => ({
        selectedTag: state.selectedTag.filter((i) => i !== title),
    }))
}))

export const useTagData = () => useTagStore((state) => state.data)
export const useSelectedTag = () => useTagStore((state) => state.selectedTag)
export const addTag = (title: TagStructure) => useTagStore.getState().addTag(title)
export const removeTag = (title: TagStructure) => useTagStore.getState().removeTag(title)
