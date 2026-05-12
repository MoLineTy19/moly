"use client"

import {faKey, faTag, faTrashCan, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MetaData from "@/app/passwords/addPassword/metaData";
import {faCopy, faEye} from "@fortawesome/free-regular-svg-icons";
import Tags from "@/app/passwords/addPassword/tags";
import React, {useState} from "react";
import {STRENGTH_COLORS, STRENGTH_LEVELS} from "@/config";
import {calculatePasswordStrength} from "@/utils/passwordStrength";
import {Tag} from "@/types/components";
import {useTagStore} from "@/store/tagStore";

/**
 * Страница с изменением записей связанных с паролем
 */
export default function EditPassword() {
    const allTag = useTagStore((state) => state.tags);

    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [login, setLogin] = useState("");
    const [category, setCategory] = useState(1);
    const [password, setPassword] = useState("123123212121");
    const [reliability, setReliability] = useState(0);
    const [selectedTags, setTag] = useState<Tag>(allTag[0]);
    const [note, setNote] = useState("");

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword)
        setReliability(calculatePasswordStrength(newPassword))
    }

    return (
        <>
            <div className="grow overflow-y-auto p-8 relative flex justify-center">
                <div className="w-full max-w-3xl pb-20">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-(--text-color) mb-2">
                                Редактирование записи
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Обновите учетные данные для Google Личный.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-(--text-color) hover:bg-(--background-secondary) font-medium text-sm transition-colors flex items-center gap-2">
                                <FontAwesomeIcon icon={faTrashCan} />
                                Удалить
                            </button>
                        </div>
                    </div>
                    <form className="space-y-6">
                        <MetaData url={url} setUrl={setUrl} title={title} setTitle={setTitle} login={login} setLogin={setLogin} category={category} setCategory={setCategory}/>
                        <div className="bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft overflow-hidden relative">
                            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-(--background-secondary)/30">
                                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    Пароль
                                </h2>
                                <button type="button" className="text-xs text-(--accent-color) hover:text-(--accent-color)/70 font-medium flex items-center gap-1.5 transition-colors">
                                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                                    Заменить пароль
                                </button>
                            </div>
                            <div className="p-4 md:p-6 space-y-6">
                                <div>
                                    <div className="flex relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <FontAwesomeIcon icon={faKey} />
                                        </div>
                                        <input className="w-full pl-11 pr-24 py-3 bg-(--background-color) border border-gray-700 rounded-lg text-sm text-(--text-color) font-mono focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600" value={password} onChange={handleChangeInput}/>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            <button type="button" className="w-8 h-8 rounded-md text-gray-400 hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <div className="w-8 h-8 rounded-md text-gray-400 hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                                <FontAwesomeIcon icon={faCopy} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs font-medium text-gray-500">
                                                Надежность пароля
                                            </span>
                                            <span className={`text-xs font-medium`} style={{color: STRENGTH_COLORS[reliability]}}>{STRENGTH_LEVELS[reliability]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Tags selectedTag={selectedTags} setTag={setTag} note={note} setNote={setNote} />
                        <div className="bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    Журнал изменений
                                </h2>
                                <span className="text-xs text-gray-500">
                                        Последние 3 действия
                                    </span>
                            </div>
                            <div className="p-4 md:p-6">
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.75 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-800">
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-700 bg-(--background-secondary) text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <FontAwesomeIcon icon={faKey} />
                                        </div>
                                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-xs">
                                            <div className="text-gray-300 font-medium">
                                                Пароль обновлен
                                            </div>
                                            <div className="text-gray-500 mt-0.5">
                                                2 дня назад • 14:30
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-700 bg-(--background-secondary) text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <FontAwesomeIcon icon={faTag}/>
                                        </div>
                                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-xs md:text-right">
                                            <div className="text-gray-300 font-medium">
                                                Добавлен тег google
                                            </div>
                                            <div className="text-gray-500 mt-0.5">
                                                1 месяц назад
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-800">
                            <button type="button" className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:text-(--text-color) hover:bg-(--background-color) font-medium text-sm transition-colors">
                                Отмена
                            </button>
                            <button type="button" className="px-8 py-2.5 rounded-lg bg-(--accent-color) hover:bg-(--accent-color)/70 text-(--text-color) font-medium text-sm shadow-lg shadow-(--accent-color)/20 transition-all">
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}