import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faPlus, faX} from "@fortawesome/free-solid-svg-icons";
import React, {useMemo, useState} from "react";
import {useTagStore} from "@/store/tagStore";
import {Tag} from "@/types/components";
import {generateTagColor} from "@/utils/color";

export default function Tags({selectedTag, setTag, note, setNote}: {
    selectedTag: Tag | null;
    setTag: React.Dispatch<React.SetStateAction<Tag | null>>;
    note: string;
    setNote: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [query, setQuery] = useState("");
    const allTags = useTagStore((state) => state.tags);

    const availableTags = useMemo(() => {
        const q = query.trim().toLowerCase();
        return allTags
            .filter(tag => tag.id !== selectedTag?.id)
            .filter(tag => !q || tag.title.toLowerCase().includes(q));
    }, [allTags, selectedTag, query]);

    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(event.target.value);
    };

    return (
        <div className="bg-(--background-secondary) border border-(--text-muted)/20 rounded-xl shadow-soft overflow-hidden">
            <div className="p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-(--text-color)/80 mb-2">Тег</label>

                    {/* Выбранный тег */}
                    {selectedTag && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            <button type="button"
                                    onClick={() => setTag(null)}
                                    className="px-2.5 py-1 rounded-md border text-xs flex items-center gap-1.5 cursor-pointer transition-colors hover:brightness-125"
                                    style={generateTagColor(selectedTag.color)}>
                                {selectedTag.title}
                                <FontAwesomeIcon icon={faX} size="xs"/>
                            </button>
                        </div>
                    )}

                    {/* Поиск по тегам */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </div>
                        <input type="text" placeholder="Поиск тега..." value={query}
                               onChange={(e) => setQuery(e.target.value)}
                               className="w-full pl-11 pr-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-(--text-muted)"/>
                    </div>

                    {/* Список доступных тегов */}
                    <div className="flex flex-wrap gap-2 mt-3 min-h-6">
                        {availableTags.length === 0 ? (
                            <span className="text-xs text-(--text-muted)">
                                {allTags.length === 0 ? "Нет ни одного тега" : "Ничего не найдено"}
                            </span>
                        ) : availableTags.map((tag) => (
                            <button key={tag.id} type="button"
                                    onClick={() => setTag(tag)}
                                    className="px-2.5 py-1 rounded-md bg-(--hover-overlay) border border-(--border-input-color) text-xs text-(--text-color)/80 flex items-center gap-1.5 cursor-pointer hover:bg-(--background-secondary) transition-colors">
                                <FontAwesomeIcon icon={faPlus} className="text-(--text-muted) text-[10px]"/>
                                <span className="w-2 h-2 rounded-full" style={{backgroundColor: tag.color}}/>
                                {tag.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="password-note" className="block text-sm font-medium text-(--text-color)/80 mb-2">
                        Заметки
                    </label>
                    <textarea id="password-note" rows={3} value={note} onChange={handleNoteChange}
                              placeholder="Дополнительная информация, секретные вопросы и т.д."
                              className="w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-(--text-muted) resize-none"/>
                </div>
            </div>
        </div>
    );
}
