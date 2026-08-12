"use client"

import {faKey, faTag, faTrashCan, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MetaData from "../../addPassword/components/metaData";
import {faCopy, faEye} from "@fortawesome/free-regular-svg-icons";
import Tags from "../../addPassword/components/tags";
import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {useTagStore} from "@/store/tagStore";
import {Password} from "@/types";
import {Tag} from "@/types/components";
import {calculatePasswordStrength} from "@/utils/passwordStrength";
import {editPassword, deletePassword, usePasswordStore} from "@/store/passwordStore";
import toast from "react-hot-toast";
import {STRENGTH_DETAILS} from "@/config";
import {useRouter} from "next/navigation";

/**
 * Страница с изменением записей связанных с паролем
 */
export default function EditPassword() {
    const allTag = useTagStore((state) => state.tags);

    const params = useParams();
    const id = params.id;
    const router = useRouter();

    // Запись уже расшифрована в сторе. Прямой fetch к API отдал бы шифртекст,
    // а editPassword шифрует повторно, поэтому получилось бы двойное шифрование.
    const password = usePasswordStore((s) => s.passwords.find((p) => p.id === Number(id)));
    const isLoading = usePasswordStore((s) => s.isLoading);

    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [login, setLogin] = useState("");
    const [pwdValue, setPwdValue] = useState<string>("");
    const [reliability, setReliability] = useState(0);
    const [selectedTag, setTag] = useState<Tag | null>(null);
    const [note, setNote] = useState("");
    const [initialized, setInitialized] = useState(false);

    // Заполняем форму расшифрованными данными один раз, когда запись появилась.
    useEffect(() => {
        if (password && !initialized) {
            setPwdValue(password.password);
            setTitle(password.title);
            setLogin(password.login);
            setUrl(password.url);
            setNote(password.note ?? "");
            setTag(password.tag);
            setReliability(password.strengthScore);
            setInitialized(true);
        }
    }, [password, initialized]);

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPwdValue(newPassword)
        setReliability(calculatePasswordStrength(newPassword))
    }

    if (isLoading && !password) {
        return <div className="grow p-8 text-(--text-muted)">Загрузка…</div>;
    }
    if (!password) {
        return <div className="grow p-8 text-(--text-muted)">Пароль не найден</div>;
    }

    const handleClickSave = async () => {
        const updated: Password = {
            ...password,
            password: pwdValue,
            title,
            login,
            note,
            tag: selectedTag,
            strengthScore: reliability,
            url,
        };

        try {
            await editPassword(updated);
            toast.success("Изменено");
        } catch {
            toast.error("Не удалось сохранить изменения");
        }
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
                            <p className="text-(--text-secondary) text-sm">
                                Обновите данные записи «{password.title}».
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button"
                                    onClick={async () => {
                                        if (!confirm("Удалить запись безвозвратно?")) return;
                                        try {
                                            await deletePassword(password.id);
                                            toast.success("Удалено");
                                            router.push("/passwords");
                                        } catch {
                                            toast.error("Не удалось удалить запись");
                                        }
                                    }}
                                    className="px-4 py-2 rounded-lg border border-(--border-input-color) text-(--text-secondary) hover:text-red-400 hover:border-red-500/50 font-medium text-sm transition-colors flex items-center gap-2">
                                <FontAwesomeIcon icon={faTrashCan} />
                                Удалить
                            </button>
                        </div>
                    </div>
                    <form className="space-y-6">
                        <MetaData url={url} setUrl={setUrl} title={title} setTitle={setTitle} login={login} setLogin={setLogin}/>
                        <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft overflow-hidden relative">
                            <div className="px-6 py-4 border-b border-(--border-color) flex justify-between items-center bg-(--background-secondary)/30">
                                <h2 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">
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
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                                            <FontAwesomeIcon icon={faKey} />
                                        </div>
                                        <input className="w-full pl-11 pr-24 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) font-mono focus:outline-none focus:border-(--accent-color) transition-colors placeholder-(--text-muted)" value={pwdValue} onChange={handleChangeInput}/>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            <button type="button" className="w-8 h-8 rounded-md text-(--text-secondary) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <div className="w-8 h-8 rounded-md text-(--text-secondary) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                                <FontAwesomeIcon icon={faCopy} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs font-medium text-(--text-muted)">
                                                Надежность пароля
                                            </span>
                                            <span className={`text-xs font-medium`} style={{color: STRENGTH_DETAILS[reliability].color}}>{STRENGTH_DETAILS[reliability].title}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Tags selectedTag={selectedTag} setTag={setTag} note={note} setNote={setNote} />
                        <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft overflow-hidden">
                            <div className="px-6 py-4 border-b border-(--border-color) flex justify-between items-center">
                                <h2 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">
                                    Журнал изменений
                                </h2>
                                <span className="text-xs text-(--text-muted)">
                                        Последние 3 действия
                                    </span>
                            </div>
                            <div className="p-4 md:p-6">
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.75 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-(--border-color)">
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-(--border-input-color) bg-(--background-secondary) text-(--text-secondary) shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <FontAwesomeIcon icon={faKey} />
                                        </div>
                                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-xs">
                                            <div className="text-(--text-secondary) font-medium">
                                                Пароль обновлен
                                            </div>
                                            <div className="text-(--text-muted) mt-0.5">
                                                2 дня назад • 14:30
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-(--border-input-color) bg-(--background-secondary) text-(--text-secondary) shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <FontAwesomeIcon icon={faTag}/>
                                        </div>
                                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] text-xs md:text-right">
                                            <div className="text-(--text-secondary) font-medium">
                                                Добавлен тег google
                                            </div>
                                            <div className="text-(--text-muted) mt-0.5">
                                                1 месяц назад
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-(--border-color)">
                            <button type="button" className="px-6 py-2.5 rounded-lg border border-(--border-input-color) text-(--text-secondary) hover:text-(--text-color) hover:bg-(--background-color) font-medium text-sm transition-colors">
                                Отмена
                            </button>
                            <button type="button" className="px-8 py-2.5 rounded-lg bg-(--accent-color) hover:bg-(--accent-color)/70 text-(--text-color) font-medium text-sm shadow-lg shadow-(--accent-color)/20 transition-all" onClick={() => handleClickSave()}>
                                Сохранить изменения
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}