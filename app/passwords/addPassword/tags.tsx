import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTag} from "@fortawesome/free-solid-svg-icons";
import React, {Fragment} from "react";
import {useTagData} from "@/store/use-tag-store";

export default function Tags() {
    const tag = useTagData()


    return (
        <>
            <div className="bg-(--background-secondary) border border-(--text-muted)/20 rounded-xl shadow-soft overflow-hidden">
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-(--text-color)/80 mb-2">Теги</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                                <FontAwesomeIcon icon={faTag} className="mr-2"/>
                            </div>
                            <input type="text" placeholder="Введите тег и нажмите Enter" className="w-full pl-11 pr-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600"/>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {tag.map((tag, index) => (
                                <Fragment key={index}>
                                    <span className="px-2.5 py-1 rounded-md bg-dark-800 border border-(--border-input-color) text-xs text-(--text-color)/80 flex items-center gap-1.5 cursor-pointer hover:bg-dark-700 transition-colors">
                                        <FontAwesomeIcon icon={faPlus} className="text-(--text-muted) text-[10px]"/>
                                        {tag.title}
                                    </span>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-(--text-color)/80 mb-2">
                            <textarea rows={3} placeholder="Дополнительная информация, секретные вопросы и т.д." className="w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600 resize-none">

                            </textarea>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}