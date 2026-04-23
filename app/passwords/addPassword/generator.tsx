import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {MouseEventHandler, useState} from "react";
import toast from "react-hot-toast";
import {faArrowsRotate, faEyeLowVision, faKey, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import {faCopy, faEye} from "@fortawesome/free-regular-svg-icons";
import AdditionOption from "@/app/passwords/addPassword/additionalOptions";
import CheckBox from "@/app/passwords/addPassword/checkBox";

export default function Generator({password, setPassword}: {password: string, setPassword:  React.Dispatch<React.SetStateAction<string>>}) {
    const [isShow, setShow] = useState(false);
    const [passwordLength, setPasswordLength] = useState(16);
    const [isTextUppercase, setTextUppercase] = useState(true);
    const [isTextLowercase, setTextLowercase] = useState(true);
    const [isNumber, setNumber] = useState(true);
    const [isSpecialSymbol, setSpecialSymbol] = useState(true);
    const [isUnique, setUnique] = useState(false);
    const [isSimilar, setSimilar] = useState(false);

    function generatePassword(length: number) {
        const charsetL = "abcdefghijklmnopqrstuvwxyz";
        const charsetU = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789"
        const specSymbol = "!@#$%^&*()_~"

        let charset = "";
        if (isTextLowercase) {
            charset = charset + charsetL;
        }
        if (isTextUppercase) {
            charset = charset + charsetU;
        }
        if (isNumber) {
            charset = charset + numbers;
        }
        if (isSpecialSymbol) {
            charset = charset + specSymbol;
        }

        let res = '';

        for (let i = 0, n = charset.length; i < length; ++i) {
            const randomChar = charset.charAt(Math.floor(Math.random() * n));
            if (isUnique) {
                if (!res.includes(randomChar)) {
                    res += randomChar
                }
            } else {
                res += randomChar
            }
            // if (isSimilar) {
            // }
        }
        return res;
    }

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
        <>
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
                                    <AdditionOption name="A-Z (Заглавные)" isActive={isTextUppercase} setIsActive={setTextUppercase}/>
                                    <AdditionOption name="A-Z (Строчные)" isActive={isTextLowercase} setIsActive={setTextLowercase}/>
                                    <AdditionOption name="0-9 (Цифры)" isActive={isNumber} setIsActive={setNumber}/>
                                    <AdditionOption name="!#$ (Спец-символы)" isActive={isSpecialSymbol} setIsActive={setSpecialSymbol}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-gray-800 bg-dark-950 hover:border-(--border-input-color) transition-colors">
                                    <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-600 bg-dark-900 text-transparent">
                                        <CheckBox isActive={isSimilar} setIsActive={setSimilar} color="(--secondary-color)"/>
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
                                        <CheckBox isActive={isUnique} setIsActive={setUnique} color="(--secondary-color)"/>
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
                            <button type="button" className="w-full py-3 bg-white/10 hover:bg-dark-700 border border-(--border-input-color) text-(--text-color) rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer" onClick={toggleGenerator}>
                                <FontAwesomeIcon icon={faArrowsRotate} />
                                Сгенерировать новый пароль
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}