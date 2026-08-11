"use client";

import {usePasswordStore} from "@/store/passwordStore";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faShieldHalved} from "@fortawesome/free-solid-svg-icons";

export default function UnlockScreen() {
    const {isSetup, setup, unlock} = usePasswordStore();
    const [pwd, setPwd] = useState("");
    const [show, setShow] = useState(false);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            if (isSetup) {
                const ok = await unlock(pwd);
                if (!ok) setErr("Неверный мастер-пароль");
            } else {
                if (pwd.length < 8) {
                    setErr("Минимум 8 символов");
                    return;
                }
                await setup(pwd);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--background-color) p-4">
            <div className="w-full max-w-md">
                {/* Лого / шапка */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-(--accent-color)/10 border border-(--accent-color)/20 flex items-center justify-center mb-4">
                        <FontAwesomeIcon
                            icon={faShieldHalved}
                            className="text-(--accent-color) text-2xl"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-(--text-color) mb-1">
                        {isSetup ? "Сейф заблокирован" : "Добро пожаловать"}
                    </h1>
                    <p className="text-sm text-gray-400 text-center max-w-xs">
                        {isSetup
                            ? "Введите мастер-пароль для доступа к паролям."
                            : "Создайте мастер-пароль. Он единственный ключ к вашему сейфу - восстановить его будет невозможно."}
                    </p>
                </div>

                {/* Форма */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft p-6 flex flex-col gap-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-(--text-color) mb-2">
                            Мастер-пароль
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                            <input
                                type={show ? "text" : "password"}
                                autoFocus
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                placeholder={isSetup ? "Введите пароль" : "Придумайте пароль"}
                                className="w-full pl-11 pr-12 py-3 bg-(--background-color) border border-gray-700 rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors placeholder-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-(--text-color) text-xs transition-colors"
                                tabIndex={-1}
                            >
                                {show ? "Скрыть" : "Показать"}
                            </button>
                        </div>
                    </div>

                    {err && (
                        <p className="text-xs text-red-400">{err}</p>
                    )}

                    {!isSetup && pwd.length > 0 && (
                        <div className="flex gap-1 h-1 rounded-full overflow-hidden bg-dark-800">
                            {[1, 2, 3, 4].map((lvl) => {
                                const s = strengthOf(pwd);
                                return (
                                    <div
                                        key={lvl}
                                        className={`w-1/4 ${lvl <= s ? "bg-(--accent-color)" : "bg-gray-700"}`}
                                    />
                                );
                            })}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || pwd.length === 0}
                        className="w-full py-3 rounded-lg bg-(--accent-color) hover:bg-(--accent-color)/80 disabled:opacity-50 disabled:cursor-not-allowed text-(--text-color) font-medium text-sm shadow-lg shadow-(--accent-color)/20 transition-all"
                    >
                        {loading ? "…" : isSetup ? "Разблокировать" : "Создать сейф"}
                    </button>
                </form>

                {!isSetup && (
                    <p className="text-xs text-gray-500 text-center mt-4 max-w-xs mx-auto">
                        Внимание: мастер-пароль нельзя восстановить. Храните его надёжно.
                    </p>
                )}
            </div>
        </div>
    );
}

/** Локальная оценка силы для индикатора при создании. */
function strengthOf(pwd: string): number {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (pwd.length >= 12) s++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd) || /[^a-zA-Z0-9]/.test(pwd)) s++;
    return Math.min(s, 4);
}