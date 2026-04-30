"use client"

import React, { MouseEventHandler, useState} from "react";
import toast from "react-hot-toast";
import Generator from "@/app/passwords/addPassword/generator";
import MetaData from "@/app/passwords/addPassword/metaData";
import Tags from "@/app/passwords/addPassword/tags";
import {PasswordAdd} from "@/store/passwordStore";
import Link from "next/link";
import {Password, Tag} from "@/types";
import {useTagData} from "@/store/tagStore";



export default function AddPage() {
    const storageTags = useTagData()

    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [login, setLogin] = useState("");
    const [category, setCategory] = useState(1);
    const [password, setPassword] = useState("");
    const [reliability, setReliability] = useState(0);
    const [selectedTag, setTag] = useState<Tag>(storageTags[0]);
    const [note, setNote] = useState("");

    const handleClickConfirmSave: MouseEventHandler = (e) => {
        e.preventDefault();

        const data: Omit<Password, 'id' | 'createdAt' | 'lastModified' > = {
            title: title,
            login: login,
            password: password,
            strengthScore: reliability,
            url: url,
            tag: selectedTag,
            note: note,
        }

        if (!url || !title || !login) {
            toast.error("Заполните поля помеченные *")
            return
        }

        if (!password) {
            toast.error("Необходимо придумать самое важное (пароль)")
            return;
        }

        PasswordAdd(data)
        toast.success("Даннные добавлены")
    }

    return (
        <div className="grow overflow-y-auto p-8 relative flex justify-center">
            <div className="w-full max-w-3xl pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-(--text-color) mb-2">Создать запись</h1>
                    <p className="text-(--text-muted) brightness-130 text-sm">Добавьте новые учетные данные в ваш безопасный сейф.</p>
                </div>
                <form className="space-y-6">
                    <MetaData url={url} setUrl={setUrl} title={title} setTitle={setTitle} login={login} setLogin={setLogin} category={category} setCategory={setCategory}/>
                    <Generator password={password} setPassword={setPassword} reliability={reliability} setReliability={setReliability}/>
                    <Tags selectedTag={selectedTag} setTag={setTag} note={note} setNote={setNote}/>
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href={'/passwords'}>
                            <button type="button" className="px-6 py-2.5 rounded-lg border border-(--text-muted)/20 text-(--text-color)/80 hover:text-(--text-color) hover:bg-dark-800 font-medium text-sm transition-colors cursor-pointer" >
                                Отмена
                            </button>
                        </Link>
                        <button type="submit" className="px-8 py-2.5 rounded-lg bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) font-medium text-sm shadow-lg shadow-(--accent-color)/20 transition-all cursor-pointer" onClick={handleClickConfirmSave}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}