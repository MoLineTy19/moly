'use client'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEyeLowVision,
    faPen, faStar as faStarSolid, faTag,
    faTrashCan,
    faTriangleExclamation, faUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCopy, faEye, faStar as faStarOutline, faUser} from "@fortawesome/free-regular-svg-icons";
import React, {useMemo, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {STRENGTH_DETAILS} from "@/config";
import {generateTagColor, FALLBACK_TAG_COLOR} from "@/utils/color";
import toast from "react-hot-toast";
import {useConfigStore} from "@/store/configStore";
import {addPassword, deletePassword, togglePasswordFavorite, usePasswordStore} from "@/store/passwordStore";
import {copyWithAutoClear} from "@/utils/clipboard";
import Link from "next/link";

function getDomain(url: string): string | null {
    try {
        if (!url) return null;
        const u = new URL(url.startsWith('http') ? url : `https://${url}`);
        return u.hostname;
    } catch {
        return null;
    }
}

function SiteIcon({url, title}: { url: string; title: string }) {
    const [failed, setFailed] = useState(false);
    const domain = useMemo(() => getDomain(url), [url]);

    if (domain && !failed) {
        return (
            <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                alt={title}
                onError={() => setFailed(true)}
                className="w-8 h-8 rounded-lg object-contain"
            />
        );
    }
    return (
        <span className="text-2xl font-bold text-(--text-color)">
            {(title?.[0] ?? '?').toUpperCase()}
        </span>
    );
}

export default function ShowPage() {
    const params = useParams();
    const id = params.id;
    const router = useRouter();

    const isDetectedLeak = false;

    // Запись уже расшифрована в сторе (fetchPasswords). Прямой fetch к API
    // отдал бы шифртекст: вся криптография клиентская, сервер не расшифровывает.
    const password = usePasswordStore((s) => s.passwords.find((p) => p.id === Number(id)));
    const isLoading = usePasswordStore((s) => s.isLoading);
    const [isShow, setShow] = useState(false);

    const clipboardClearTimeout = useConfigStore((s) => s.clipboardClearTimeout);

    if (isLoading && !password) {
        return <div className="grow p-8 text-(--text-muted)">Загрузка…</div>;
    }
    if (!password) {
        return <div className="grow p-8 text-(--text-muted)">Пароль не найден</div>;
    }

    const strengthDetails = STRENGTH_DETAILS[password.strengthScore] ?? STRENGTH_DETAILS[0];
    const tagColor = generateTagColor(password.tag?.color ?? FALLBACK_TAG_COLOR);
    const tagTitle = password.tag?.title ?? 'Без тега';
    const domain = getDomain(password.url);

    const formatDate = (ts?: number) => {
        if (!ts) return '-';
        return new Date(ts).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleCopy = async (text: string, label: string) => {
        if (!text || !text.length) {
            toast.error(`Поле ${label} пустое!`);
            return;
        }
        try {
            await copyWithAutoClear(text, clipboardClearTimeout);
            toast.success(clipboardClearTimeout > 0
                ? `Скопировано, очистится через ${clipboardClearTimeout}с`
                : "Скопировано");
        } catch {
            toast.error("Произошла неизвестная ошибка");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Удалить запись безвозвратно?")) return;
        try {
            await deletePassword(password.id);
            toast.success("Удалено");
            router.push("/passwords");
        } catch {
            toast.error("Не удалось удалить запись");
        }
    };

    const handleDuplicate = async () => {
        // Отбрасываем id/createdAt/lastModified: addPassword назначает их заново,
        // иначе дубликат унаследовал бы идентичность и даты оригинала.
        const {id: _id, createdAt: _c, lastModified: _m, ...rest} = password;
        try {
            await addPassword(rest);
            toast.success("Дубликат создан");
        } catch {
            toast.error("Не удалось создать дубликат");
        }
    };

    const handleToggleFavorite = () => {
        // Стор сам оптимистично обновит запись и синхронизирует с БД.
        togglePasswordFavorite(password.id);
    };


    return (
        <div className="grow overflow-y-auto p-8 relative">
            {isDetectedLeak && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faTriangleExclamation}/>
                    </div>
                    <div className="grow">
                        <h3 className="text-red-400 font-semibold text-sm mb-1">Скомпрометированный пароль</h3>
                        <p className="text-(--text-secondary) text-sm">
                            Этот пароль найден в утечке данных. Рекомендуется как можно скорее сменить его.
                        </p>
                    </div>
                    <div
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/30 whitespace-nowrap">
                        Изменить пароль
                    </div>
                </div>
            )}

            {/* Шапка */}
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-5">
                    <div
                        className="w-16 h-16 rounded-2xl bg-(--background-secondary) border border-(--border-color) flex items-center justify-center shadow-soft overflow-hidden">
                        <SiteIcon url={password.url} title={password.title}/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-(--text-color) mb-2 break-words">
                            {password.title}
                        </h1>
                        {domain && (
                            <a
                                href={password.url.startsWith('http') ? password.url : `https://${password.url}`}
                                target="_blank" rel="noreferrer"
                                className="text-(--accent-color) hover:text-(--accent-color)/70 text-sm inline-flex items-center gap-2 transition-colors"
                            >
                                {password.url}
                                <FontAwesomeIcon icon={faUpRightFromSquare}/>
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleToggleFavorite}
                            title={password.favorite ? "Убрать из избранного" : "Добавить в избранное"}
                            aria-label={password.favorite ? "Убрать из избранного" : "Добавить в избранное"}
                            aria-pressed={password.favorite}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                                password.favorite
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40"
                                    : "bg-(--background-secondary) border-(--border-color) text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary)/80"
                            }`}>
                        <FontAwesomeIcon icon={password.favorite ? faStarSolid : faStarOutline}/>
                    </button>
                    <button onClick={handleDuplicate} title="Дублировать"
                            className="w-10 h-10 rounded-lg bg-(--background-secondary) border border-(--border-color) text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary)/80 flex items-center justify-center transition-colors">
                        <FontAwesomeIcon icon={faCopy}/>
                    </button>
                    <button onClick={handleDelete} title="Удалить"
                            className="w-10 h-10 rounded-lg bg-(--background-secondary) border border-(--border-color) text-red-400 hover:text-red-300 hover:bg-red-900/20 hover:border-red-900/50 flex items-center justify-center transition-colors">
                        <FontAwesomeIcon icon={faTrashCan}/>
                    </button>
                    <Link href={`/passwords/edit/${id}`}
                          className="bg-(--accent-color) hover:bg-(--accent-color)/70 text-(--text-color) font-medium py-2.5 px-5 rounded-lg shadow-lg shadow-(--accent-color)/20 transition-all flex items-center gap-2">
                        <FontAwesomeIcon icon={faPen}/>
                        Редактировать
                    </Link>
                </div>
            </div>

            {/* Контент */}
            <div className="flex flex-col lg:flex-row gap-6 max-w-6xl">
                {/* Левая колонка */}
                <div className="grow lg:w-2/3 space-y-6">
                    {/* Учетные данные */}
                    <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl overflow-hidden shadow-soft">
                        <div className="px-6 py-4 border-b border-(--border-color)">
                            <h2 className="text-sm font-medium text-(--text-muted) uppercase tracking-wider">
                                Учетные данные
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Логин */}
                            <div>
                                <label className="block text-xs font-medium text-(--text-muted) mb-2">
                                    Имя пользователя / Email
                                </label>
                                <div className="flex relative">
                                    <input
                                        type="text"
                                        value={password.login}
                                        placeholder="Логин не указан"
                                        readOnly={true}
                                        className="w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none pr-12"
                                    />
                                    <button
                                        onClick={() => handleCopy(password.login, 'логина')}
                                        title="Скопировать логин"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faCopy}/>
                                    </button>
                                </div>
                            </div>

                            {/* Пароль */}
                            <div>
                                <label className="text-xs font-medium text-(--text-muted) mb-2 flex justify-between items-end">
                                    <span>Пароль</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded border"
                                          style={{
                                              color: strengthDetails.color,
                                              backgroundColor: strengthDetails.backgroundColor,
                                              borderColor: strengthDetails.borderColor,
                                          }}>
                                        {strengthDetails.title}
                                    </span>
                                </label>
                                <div className="flex relative group">
                                    <input
                                        type={isShow ? "text" : "password"}
                                        value={password.password}
                                        placeholder="Пароль не задан"
                                        readOnly={true}
                                        className="w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) font-mono focus:outline-none pr-20"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            onClick={() => setShow(v => !v)}
                                            title={isShow ? "Скрыть пароль" : "Показать пароль"}
                                            className="w-8 h-8 rounded-md text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                            <FontAwesomeIcon icon={isShow ? faEyeLowVision : faEye}/>
                                        </button>
                                        <button
                                            onClick={() => handleCopy(password.password, 'пароля')}
                                            title="Скопировать пароль"
                                            className="w-8 h-8 rounded-md text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                                            <FontAwesomeIcon icon={faCopy}/>
                                        </button>
                                    </div>
                                </div>
                                {/* Индикатор силы пароля */}
                                <div className="mt-2 flex gap-1 h-1.5">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-full transition-colors"
                                            style={{
                                                backgroundColor: i < password.strengthScore
                                                    ? strengthDetails.color
                                                    : 'var(--border-color)',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Заметки */}
                    <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl overflow-hidden shadow-soft">
                        <div className="px-6 py-4 border-b border-(--border-color)">
                            <h2 className="text-sm font-medium text-(--text-muted) uppercase tracking-wider">
                                Заметки
                            </h2>
                        </div>
                        <div className="p-6">
                            {password.note ? (
                                <div
                                    className="p-4 bg-(--background-color) border border-(--border-color) rounded-lg text-sm text-(--text-secondary) leading-relaxed font-mono whitespace-pre-wrap break-words">
                                    {password.note}
                                </div>
                            ) : (
                                <div className="p-4 text-sm text-(--text-muted) italic">
                                    Заметок нет
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div className="lg:w-1/3 space-y-6">
                    <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft">
                        <div className="px-6 py-4 border-b border-(--border-color)">
                            <h2 className="text-sm font-medium text-(--text-muted) uppercase tracking-wider">
                                Детали
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Тег */}
                            <div>
                                <h3 className="text-xs font-medium text-(--text-muted) mb-3">
                                    Тег
                                </h3>
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs"
                                    style={{
                                        color: tagColor.color,
                                        backgroundColor: tagColor.backgroundColor,
                                        borderColor: tagColor.borderColor,
                                    }}>
                                    <FontAwesomeIcon icon={faTag}/>
                                    {tagTitle}
                                </span>
                            </div>

                            <hr className="border-(--border-color)"/>

                            {/* Даты */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-(--text-muted)">Создан</span>
                                    <span className="text-sm text-(--text-color)">
                                        {formatDate(password.createdAt)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-(--text-muted)">Изменён</span>
                                    <span className="text-sm text-(--text-color)">
                                        {formatDate(password.lastModified)}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-(--border-color)"/>

                            {/* История изменений */}
                            <div>
                                <h3 className="text-xs font-medium text-(--text-muted) mb-4">История изменений</h3>
                                <div
                                    className="space-y-4 relative before:absolute before:inset-0 before:ml-2.25 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-(--border-color) before:to-transparent">
                                    <div
                                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div
                                            className="flex items-center justify-center w-5 h-5 rounded-full border border-(--border-input-color) bg-(--background-secondary) text-(--text-muted) group-[.is-active]:text-(--accent-color) group-[.is-active]:border-(--accent-color)/30 group-[.is-active]:bg-(--accent-color)/10 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                        </div>
                                        <div
                                            className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-(--border-color) bg-(--background-color) shadow-soft">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-(--text-color)">
                                                    Пароль изменен
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-(--text-muted)">
                                                {formatDate(password.lastModified)}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div
                                            className="flex items-center justify-center w-5 h-5 rounded-full border border-(--border-input-color) bg-(--background-secondary) text-(--text-muted) shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                        </div>
                                        <div
                                            className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-(--border-color) bg-(--background-color) shadow-soft">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-(--text-secondary)">
                                                    Запись создана
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-(--text-muted)">
                                                {formatDate(password.createdAt)}
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