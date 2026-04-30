"use client"

import React, { MouseEventHandler, useState} from "react";
import toast from "react-hot-toast";
import Generator from "@/app/passwords/addPassword/generator";
import MetaData from "@/app/passwords/addPassword/metaData";
import Tags from "@/app/passwords/addPassword/tags";
import {PasswordAdd, PasswordEntry} from "@/store/passwordStore";
import Link from "next/link";



export default function AddPage() {
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [login, setLogin] = useState("");
    const [category, setCategory] = useState("");
    const [password, setPassword] = useState("");
    const [reliability, setReliability] = useState(3);
    const [selectedTags, setTag] = useState<Array<string>>([]);
    const [note, setNote] = useState("");

    const handleClickConfirmSave: MouseEventHandler = (e) => {
        e.preventDefault();

        const data: PasswordEntry = {
            service: name,
            username: login,
            password: password,
            category: category,
            status: reliability,
        }

        if (!url || !name || !login) {
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
                    <MetaData url={url} setUrl={setUrl} name={name} setName={setName} login={login} setLogin={setLogin} category={category} setCategory={setCategory}/>
                    <Generator password={password} setPassword={setPassword}/>
                    <Tags selectedTags={selectedTags} setTag={setTag} note={note} setNote={setNote}/>
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