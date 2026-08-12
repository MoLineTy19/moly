"use client"

import React, { MouseEventHandler, useState} from "react";
import toast from "react-hot-toast";
import Generator from "./components/generator";
import MetaData from "./components/metaData";
import Tags from "./components/tags";
import Link from "next/link";
import {Password} from "@/types";
import {Tag} from "@/types/components";
import {useTagStore} from "@/store/tagStore";
import {addPassword} from "@/store/passwordStore";


/**
 * Страница с добавлением пароля
 */
export default function AddPage() {
    const tags = useTagStore((state) => state.tags);

    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [reliability, setReliability] = useState(0);
    const [selectedTag, setTag] = useState<Tag | null>(null);
    const [note, setNote] = useState("");

    const handleClickConfirmSave: MouseEventHandler = async (e) => {
        e.preventDefault();

        const data: Omit<Password, 'id' | 'createdAt' | 'lastModified'> = {
            title: title,
            login: login,
            password: password,
            strengthScore: reliability,
            url: url,
            tag: selectedTag,
            note: note,
            favorite: false,
        }

        if (!url || !title || !login) {
            toast.error("Заполните поля, помеченные *")
            return
        }

        if (!password) {
            toast.error("Укажите пароль")
            return;
        }

        try {
            await addPassword(data);
            toast.success("Данные добавлены");
        } catch {
            toast.error("Не удалось сохранить запись");
        }
    }

    return (
        <div className="grow overflow-y-auto p-8 relative flex justify-center">
            <div className="w-full max-w-3xl pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-(--text-color) mb-2">Создать запись</h1>
                    <p className="text-(--text-muted) brightness-130 text-sm">Добавьте учётные данные в сейф.</p>
                </div>
                <form className="space-y-6">
                    <MetaData url={url} setUrl={setUrl} title={title} setTitle={setTitle} login={login} setLogin={setLogin}/>
                    <Generator password={password} setPassword={setPassword} reliability={reliability} setReliability={setReliability}/>
                    <Tags selectedTag={selectedTag} setTag={setTag} note={note} setNote={setNote}/>
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href={'/passwords'}>
                            <button type="button" className="px-6 py-2.5 rounded-lg border border-(--text-muted)/20 text-(--text-color)/80 hover:text-(--text-color) hover:bg-dark-800 font-medium text-sm transition-colors" >
                                Отмена
                            </button>
                        </Link>
                        <button type="submit" className="px-8 py-2.5 rounded-lg bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) font-medium text-sm shadow-lg shadow-(--accent-color)/20 transition-all" onClick={handleClickConfirmSave}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}