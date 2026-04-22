"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faArrowsRotate,
    faEyeLowVision,
    faGlobe,
    faKey, faPlus, faTag,
    faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
import {faCopy, faEye, faUser} from "@fortawesome/free-regular-svg-icons";
import React, { MouseEventHandler, useState} from "react";
import toast from "react-hot-toast";
import AdditionOption from "@/app/passwords/addPassword/additionalOptions";
import CheckBox from "@/app/passwords/addPassword/checkBox";

function generatePassword(length: number) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let res = '';

    for (let i = 0, n = charset.length; i < length; ++i) {
        res += charset.charAt(Math.floor(Math.random() * n));
    }
    return res;
}

export default function AddPage() {
    const [password, setPassword] = useState("");
    const [isShow, setShow] = useState(false);
    const [passwordLength, setPasswordLength] = useState(16);

    const toggleGenerator: MouseEventHandler = (e) => {
        e.preventDefault()
        const newPassword = generatePassword(passwordLength)
        setPassword(newPassword)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleClickShow: MouseEventHandler = (e) => {
        e.preventDefault();
        setShow(!isShow)
    }

    const handleCopy: MouseEventHandler = async (e) => {
        e.preventDefault();

        if (!password || !password.length) {
            toast.error("Поле пароля пустое!")
            return
        }

        try {
            await navigator.clipboard.writeText(password)
            toast.success("Скопировано")
        } catch (err) {
            toast.error("Произошла неизвестная ошибка")
            console.error(err)
        }

    }

    const handleInputLengthPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordLength(parseInt(e.target.value))
    }

    return (
        <div className="grow overflow-y-auto p-8 relative flex justify-center">
            <div className="w-full max-w-3xl pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-(--text-color) mb-2">Создать запись</h1>
                    <p className="text-(--text-muted) brightness-130 text-sm">Добавьте новые учетные данные в ваш безопасный сейф.</p>
                </div>
                <form className="space-y-6">
                    <div className="bg-(--background-secondary) border border-(--text-muted)/20 rounded-xl shadow-soft overflow-hidden">
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-(--text-color)/80 mb-2">
                                    Сайт / Приложение
                                </label>
                                <div className="flex relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                                        <FontAwesomeIcon icon={faGlobe}/>
                                    </div>
                                    <input type="url" placeholder="https://example.com" className="w-full pl-11 pr-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-(--text-color)/80 mb-2">
                                    Название записи
                                </label>
                                <input type="text" placeholder="Например: WoW 3" className="w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600"/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-(--text-color)/80 mb-2">
                                        Логин / Email
                                    </label>
                                    <div className="flex relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </div>
                                        <input type="text" placeholder="user@example.com" className="w-full pl-11 pr-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-(--text-color)/80 mb-2">Категория</label>
                                    <div className="relative">
                                        <select className="w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors appearance-none cursor-pointer">
                                            <option disabled={true}>Выберите категорию</option>
                                            <option value="personal">Личное</option>
                                            <option value="work">Работа</option>
                                            <option value="finance">Финансы</option>
                                            <option value="social">Социальные сети</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none">
                                            <FontAwesomeIcon icon={faAngleDown}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-(--background-secondary) border border-(--text-muted)/20 rounded-xl shadow-soft overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-(--background-color)/20">
                            <h2 className="text-sm font-medium text-(--text-muted) brightness-130 uppercase tracking-wider">Пароль</h2>
                            <button type="button" className="text-(--accent-color) hover:text-(--accent-color)/90 font-medium flex items-center gap-1.5 transition-colors cursor-pointer" onClick={toggleGenerator}>
                                <FontAwesomeIcon icon={faWandMagicSparkles} />
                                Генератор
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <div className="flex relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                                        <FontAwesomeIcon icon={faKey} />
                                    </div>
                                    <input type={isShow ? 'text': 'password'} placeholder="Введите пароль или сгенерируйте" className="w-full pl-11 pr-24 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color)
                                     font-mono focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600" value={password} onChange={handlePasswordChange}/>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button type="button" className="w-8 h-8 rounded-md text-(--text-muted) brightness-130 hover:text-(--text-color) hover:bg-dark-800 flex items-center justify-center transition-colors" onClick={handleClickShow}>
                                            <FontAwesomeIcon icon={isShow ? faEye : faEyeLowVision } />
                                        </button>
                                        <button type="button" className="w-8 h-8 rounded-md text-(--text-muted) brightness-130 hover:text-(--text-color) hover:bg-dark-800 flex items-center justify-center transition-colors" onClick={handleCopy}>
                                            <FontAwesomeIcon icon={faCopy} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-medium text-(--text-muted)">Надежность пароли</span>
                                        <span className="text-xs font-medium text-(--accent-color)">Надежный</span>
                                    </div>
                                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-dark-800">
                                        <div className="w-1/4 bg-(--accent-color)"></div>
                                        <div className="w-1/4 bg-(--accent-color)"></div>
                                        <div className="w-1/4 bg-(--accent-color)"></div>
                                        <div className="w-1/4 bg-gray-500"></div>
                                    </div>
                                </div>
                            </div>
                            <div id="generatorWidget" className="pt-4 border-t border-gray-800">
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-sm font-medium text-(--text-color)/80">Длина пароля</label>
                                            <span className="text-(--accent-color) font-mono text-sm bg-(--accent-color)/10 px-2 py-0.5 rounded border border-(--accent-color)/20" id="lengthDisplay">{passwordLength}</span>
                                        </div>
                                        <input type="range" min={8} max={64} value={passwordLength} className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer custom-range" onChange={handleInputLengthPassword}/>
                                        <div className="flex justify-between text-[10px] text-(--text-muted) mt-1 mb-4">
                                            <span>8</span>
                                            <span>32</span>
                                            <span>64</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-sm font-medium text-(--text-color)/80 mb-3 block">Использовать символы</label>
                                        <div className="flex flex-wrap gap-3">
                                            <AdditionOption name="A-Z (Заглавные)"/>
                                            <AdditionOption name="A-Z (Строчные)"/>
                                            <AdditionOption name="0-9 (Цифры)"/>
                                            <AdditionOption name="!#$ (Спец-символы)"/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-gray-800 bg-dark-950 hover:border-(--border-input-color) transition-colors">
                                                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-600 bg-dark-900 text-transparent">
                                                    <CheckBox/>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-(--text-color)/80 group-hover:text-(--text-color)">
                                                        Исключить похожие
                                                    </div>
                                                    <div className="text-xs text-(--text-muted)">
                                                        (i, l, 1, L, o, 0, O)
                                                    </div>
                                                </div>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-gray-800 bg-dark-950 hover:border-(--border-input-color) transition-colors">
                                            <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-600 bg-dark-900 text-transparent">
                                                <CheckBox/>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-(--text-color)/80 group-hover:text-(--text-color)">
                                                    Только уникальные
                                                </div>
                                                <div className="text-xs text-(--text-muted)">
                                                    Без повторяющихся символов
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <button type="button" className="w-full py-3 bg-dark-800 hover:bg-dark-700 border border-(--border-input-color) text-(--text-color) rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                        <FontAwesomeIcon icon={faArrowsRotate} />
                                        Сгенерировать новый пароль
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                    <span className="px-2.5 py-1 rounded-md bg-dark-800 border border-(--border-input-color) text-xs text-(--text-color)/80 flex items-center gap-1.5 cursor-pointer hover:bg-dark-700 transition-colors">
                                        <FontAwesomeIcon icon={faPlus} className="text-(--text-muted) text-[10px]"/>
                                        dev
                                    </span>
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
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button type="button" className="px-6 py-2.5 rounded-lg border border-(--text-muted)/20 text-(--text-color)/80 hover:text-(--text-color) hover:bg-dark-800 font-medium text-sm transition-colors">
                            Отмена
                        </button>
                        <button type="submit" className="px-8 py-2.5 rounded-lg bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) font-medium text-sm shadow-lg shadow-(--accent-color)/20 transition-all">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}