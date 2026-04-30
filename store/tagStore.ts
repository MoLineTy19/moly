import {create} from "zustand";
import {Tag, TagStore} from "@/types";
import {DEFAULT_TAGS} from "@/config";
import {createJSONStorage, persist} from "zustand/middleware";
import {idbStorage} from "@/lib/storage";

const defaultData = DEFAULT_TAGS;

const tagStore = create<TagStore>()(
    persist(
        (set) => ({
            data: defaultData,
            selectedTag: null,
            addTag: (tag: Tag) => set(() => ({
                selectedTag: tag,
            })),
            removeTag: () => set(() => ({
                selectedTag: null,
            })),
            addTagToCatalog: (tag: Omit<Tag, 'id'>) => set((state) => ({
                data: [...state.data, { ...tag, id: state.data.length }]
            })),
        }),
        {
            name: 'tag-storage',
            storage: createJSONStorage(() => idbStorage),
        }
    )
)

export const useTagData = () => tagStore((state) => state.data)
export const useSelectedTag = () => tagStore((state) => state.selectedTag)
export const addTag = (tag: Tag) => tagStore.getState().addTag(tag)
export const removeTag = () => tagStore.getState().removeTag()
export const addTagToCatalog = (tag: Omit<Tag, 'id'>) => tagStore.getState().addTagToCatalog(tag)