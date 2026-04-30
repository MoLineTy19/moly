import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTag, faX} from "@fortawesome/free-solid-svg-icons";
import React, {Fragment, useState} from "react";
import {Tag} from "@/types";
import {addTagToCatalog, useTagData} from "@/store/tagStore";

export default function Tags({selectedTag, setTag, note, setNote} : {selectedTag: Tag, setTag: React.Dispatch<React.SetStateAction<Tag>>, note: string, setNote: React.Dispatch<React.SetStateAction<string>>}) {
    const [input, setInput] = useState("");
    const allTags = useTagData()

    const handleInputTag = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value)
    }

    const handleKeyDownInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const trimmed = input.trim();
            const exists = allTags.some(tag => tag.title === trimmed)

            if (!exists) {
                const newTag: Tag = {
                    id: allTags.length,
                    title: trimmed,
                    color: "#ffffff",
                    icon: "❤️"
                }
                addTagToCatalog(newTag);
                setTag(newTag)
            }
            setInput('')
        }
    }

    const removeTag = () => {
        setTag(allTags[0])
    }

    const addTag = (tag: Tag) => {
        setTag(tag)
    }

    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(event.target.value)
    }

    return (
        <>
            <div className="bg-(--background-secondary) border border-(--text-muted)/20 rounded-xl shadow-soft overflow-hidden">
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-(--text-color)/80 mb-2">Теги</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {
                                selectedTag && (
                                    <div className="px-2.5 py-1 rounded-md bg-dark-800 border border-(--accent-color) text-xs text-(--text-color)/80 flex items-center gap-1.5 cursor-pointer hover:bg-(--accent-color)/60 transition-colors" onClick={removeTag}>
                                        {selectedTag.title}
                                        <FontAwesomeIcon icon={faX} size="xs"/>
                                    </div>
                                )
                            }
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                                <FontAwesomeIcon icon={faTag} className="mr-2"/>
                            </div>
                            <input type="text" placeholder="Введите тег и нажмите Enter" className="w-full pl-11 pr-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600" onChange={handleInputTag} onKeyDown={handleKeyDownInput} value={input}/>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {allTags
                                .filter(tag => !selectedTag || selectedTag.id !== tag.id)
                                .map((tag) => (
                                <Fragment key={tag.id}>
                                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-(--border-input-color) text-xs text-(--text-color)/80 flex items-center gap-1.5 cursor-pointer hover:bg-(--background-secondary) transition-colors" onClick={() => addTag(tag)}>
                                        <FontAwesomeIcon icon={faPlus} className="text-(--text-muted) text-[10px]"/>
                                        {tag.title}
                                    </span>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-(--text-color)/80 mb-2">
                            <textarea rows={3} placeholder="Дополнительная информация, секретные вопросы и т.д." className="w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600 resize-none" value={note} onChange={handleNoteChange}>
                            </textarea>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}