'use client'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircleNotch,
    faPen, faTag,
    faTrashCan,
    faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCopy, faEye, faUser} from "@fortawesome/free-regular-svg-icons";
import React, {useEffect, useState} from "react";
import {Password} from "@/types";
import {useParams} from "next/navigation";

export default function ShowPage() {
    const params = useParams();
    const id = params.id;

    const [password, setPassword] = useState<Password | null>(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/passwords/${id}`)
                .then(res => res.json())
                .then(data => setPassword(data.data));
        }
    }, [id]);

    if (!password) {
        return <div className="grow p-8">Пароль не найден</div>;
    }

    return (
        <div className="grow overflow-y-auto p-8 relative">
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                </div>
                <div className="grow">
                    <h3 className="text-red-400 font-semibold text-sm mb-1">Скомпрометированный пароль</h3>
                    <p className="text-gray-300 text-sm">Этот пароль был обнаружен в недавней утечке данных. Рекомендуется немедленно изменить его для обеспечения безопасности вашего аккаунта.</p>
                </div>
                <div className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/30 whitespace-nowrap">
                    Изменить пароль
                </div>
            </div>
            <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-(--background-secondary) border border-gray-700 flex items-center justify-center text-3xl text-(--text-color) shadow-soft">
                        <FontAwesomeIcon icon={faGithub} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-(--text-color) mb-2">
                            {password.title}
                        </h1>
                        <a href={"https://github.com"} target="_blank" className="text-green-500 hover:text-green-400 text-sm flex items-center gap-2 transition-colors">
                            {password.url}
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-lg bg-(--background-secondary) border border-gray-700 text-gray-400 hover:text-(--text-color) hover:bg-(--background-secondary)/80 flex items-center justify-center transition-colors" title="Дублировать">
                        <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-(--background-secondary) border border-gray-700 text-red-400 hover:text-red-300 hover:bg-red-900/20 hover:border-red-900/50 flex items-center justify-center transition-colors" title="Удалить">
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                    <button className="bg-green-600 hover:bg-green-500 text-(--text-color) font-medium py-2.5 px-5 rounded-lg shadow-lg shadow-(--accent-color)/20 transition-all flex items-center gap-2">
                        <FontAwesomeIcon icon={faPen} />
                        Редактировать
                    </button>
                </div>
            </div>
            <div className="flex gap-6 max-w-6xl">
                <div className="grow w-2/3 space-y-6">
                    <div className="bg-(--background-secondary) border border-gray-800 rounded-xl overflow-hidden shadow-soft">
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-(--background-secondary)">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Учетные данные
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">
                                    Имя пользователя / Email
                                </label>
                                <div className="flex relative">
                                    <input type="text" value={password.login} className="w-full px-4 py-3 bg-(--background-color) border border-gray-700 rounded-lg text-sm text-(--text-color) focus:outline-none pr-12" readOnly={true}/>
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md text-gray-400 hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faCopy} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-2 flex justify-between items-end">
                                    Пароль
                                    <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                        Слабый пароль
                                    </span>
                                </label>
                                <div className="flex relative group">
                                    <input type="password" value={password.password} className="w-full px-4 py-3 bg-(--background-color) border border-gray-700 rounded-lg text-sm text-(--text-color) font-mono focus:outline-none pr-20" disabled={true}/>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button className="w-8 h-8 rounded-md text-gray-400 hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className="w-8 h-8 rounded-md text-gray-400 hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors relative">
                                            <FontAwesomeIcon icon={faCopy} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 flex gap-1 h-1.5 rounded-full overflow-hidden bg-(--background-secondary)">
                                    <div className="w-1/4 bg-(--accent-color)"></div>
                                    <div className="w-1/4 bg-(--accent-color)"></div>
                                    <div className="w-1/4 bg-(--accent-color)"></div>
                                    <div className="w-1/4 bg-gray-500"></div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-2 flex justify-between items-center">
                                    Двухфакторная аутентификация (TOTP)
                                    <div className="flex items-center gap-2 text-xs text-(--accent-color)">
                                        <FontAwesomeIcon icon={faCircleNotch} />
                                        14 сек
                                    </div>
                                </label>
                                <div className="flex relative">
                                    <input type="text" defaultValue="812 123" className="w-full px-4 py-3 bg-(--background-color) border border-gray-700 rounded-lg text-lg tracking-widest text-(--accent-color) font-mono font-semibold focus:outline-none pr-12"/>
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md text-gray-400 hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faCopy} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-(--background-secondary) border border-gray-800 rounded-xl overflow-hidden shadow-soft'>
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-(--background-secondary)">
                            <h2 className='text-sm font-medium text-gray-400 uppercase tracking-wider'>
                                Заметки
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="p-4 bg-(--background-color) border border-gray-800 rounded-lg text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">
                                {password.note}
                            </div>
                        </div>
                    </div>

                </div>
                <div className='w-1/3 space-y-6'>
                    <div className='bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft'>
                        <div className="px-6 py-4 border-b border-gray-800">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Детали
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-xs font-medium text-gray-500 mb-3">
                                    Категория
                                </h3>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 bg-(--background-color)">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <span className="text-sm text-(--text-color) font-medium">
                                        Личное
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-medium text-gray-500 mb-3">
                                    Теги
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 rounded-md bg-(--background-secondary) border border-gray-700 text-xs text-gray-300 flex items-center gap-1.5">
                                        <FontAwesomeIcon icon={faTag} />
                                        dev
                                    </span>
                                </div>
                            </div>
                            <hr className="border-gray-800"/>
                            <div>
                                <h3 className="text-xs font-medium text-gray-500 mb-4">История изменений</h3>
                                <div className=' space-y-4 relative before:absolute before:inset-0 before:ml-2.25 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-gray-800 before:to-transparent'>
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-700 bg-(--background-secondary) text-gray-500 group-[.is-active]:text-(--accent-color) group-[.is-active]:border-(--accent-color)/30 group-[.is-active]:bg-(--accent-color)/10 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current">

                                            </div>
                                        </div>
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-gray-800 bg-(--background-color) shadow-soft">
                                            <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-(--text-color)">
                                            Пароль изменен
                                        </span>
                                            </div>
                                            <div className="text-[10px] text-gray-500">
                                                Сегодня, 14:30
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-700 bg-(--background-secondary) text-gray-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                        </div>
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-gray-800 bg-(--background-color) shadow-soft">
                                            <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs font-medium text-gray-300">
                                            Добавлен TOTP
                                        </span>
                                            </div>
                                            <div className="text-[10px] text-gray-500">
                                                12 Окт 2023
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}