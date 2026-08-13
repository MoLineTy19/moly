import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import React, {useState} from "react";
import {faCopy, faEye, faStar as faStarOutline} from "@fortawesome/free-regular-svg-icons";
import {STRENGTH_DETAILS} from "@/config";
import { useConfigStore } from "@/store/configStore";
import {generateTagColor, FALLBACK_TAG_COLOR} from "@/utils/color";
import {Password} from "@/types";
import toast from "react-hot-toast";
import {copyWithAutoClear} from "@/utils/clipboard";
import {faEyeLowVision, faStar as faStarSolid} from "@fortawesome/free-solid-svg-icons";
import {togglePasswordFavorite} from "@/store/passwordStore";
import Link from "next/link";
import SecurityBadges from "./securityBadges";

function getDomain(url: string): string | null {
    try {
        if (!url) return null;
        // Дописываем https://: без протокола new URL выбросит ошибку.
        const u = new URL(url.startsWith('http') ? url : `https://${url}`);
        return u.hostname;
    } catch {
        return null;
    }
}


export default function BoardCard({item}: { item: Password }) {
    const [show, setShow] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const clipboardClearTimeout = useConfigStore((s) => s.clipboardClearTimeout);

    const domain = getDomain(item.url);
    const tagColor = generateTagColor(item.tag?.color ?? FALLBACK_TAG_COLOR);
    const strength = STRENGTH_DETAILS[item.strengthScore] ?? STRENGTH_DETAILS[0];

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!item.password) {
            toast.error("Поле пароля пустое");
            return;
        }
        try {
            await copyWithAutoClear(item.password, clipboardClearTimeout);
            toast.success(clipboardClearTimeout > 0 ? `Скопировано, очистится через ${clipboardClearTimeout}с` : "Скопировано");
        } catch {
            toast.error("Произошла неизвестная ошибка");
        }
    };

    const toggleShow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(v => !v);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        togglePasswordFavorite(item.id);
    };

    // Число точек маски фиксируем в диапазоне 8..14, чтобы по нему нельзя было вычислить длину пароля.
    const dots = Math.max(8, Math.min(item.password?.length ?? 8, 14));


    return (
        <Link href={`/passwords/${item.id}`}
              className="group relative border border-(--border-color) rounded-xl overflow-hidden flex flex-col bg-(--background-secondary) hover:border-(--border-input-color) transition-colors p-5">
            <button
                onClick={handleToggleFavorite}
                title={item.favorite ? "Убрать из избранного" : "Добавить в избранное"}
                aria-label={item.favorite ? "Убрать из избранного" : "Добавить в избранное"}
                aria-pressed={item.favorite}
                className={`absolute top-3 right-3 w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                    item.favorite
                        ? "text-amber-400 hover:text-amber-300 opacity-100"
                        : "text-(--text-muted) hover:text-(--text-color) opacity-0 group-hover:opacity-100 focus:opacity-100"
                }`}
            >
                <FontAwesomeIcon icon={item.favorite ? faStarSolid : faStarOutline}/>
            </button>
            <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-lg bg-(--background-color) border border-(--border-color) flex items-center justify-center overflow-hidden shrink-0">
                    {domain && !imgFailed ? (
                        <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" aria-hidden
                             onError={() => setImgFailed(true)} className="w-6 h-6"/>
                    ) : (
                        <span className="text-lg font-bold text-(--text-color)">
                            {(item.title?.[0] ?? '?').toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="grow min-w-0">
                    <h3 className="text-base font-semibold text-(--text-color) truncate">{item.title}</h3>
                    <div className="text-(--text-muted) text-xs truncate">{item.login || 'нет логина'}</div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs"
                      style={{color: tagColor.color, backgroundColor: tagColor.backgroundColor, borderColor: tagColor.borderColor}}>
                    {item.tag?.title ?? 'Без тега'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md border"
                      style={{color: strength.color, backgroundColor: strength.backgroundColor, borderColor: strength.borderColor}}>
                    {strength.title}
                </span>
            </div>

            <SecurityBadges id={item.id} compact showLabels className="mb-3"/>

            <div className="mt-auto flex items-center gap-1 bg-(--background-color) border border-(--border-color) rounded-lg pl-3 py-1.5 pr-1">
                <code className="grow text-sm font-mono text-(--text-color) truncate">
                    {show ? (item.password || '') : '•'.repeat(dots)}
                </code>
                <button onClick={toggleShow} title={show ? "Скрыть" : "Показать"} aria-label={show ? "Скрыть пароль" : "Показать пароль"}
                        className="w-8 h-8 rounded-md text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                    <FontAwesomeIcon icon={show ? faEyeLowVision : faEye}/>
                </button>
                <button onClick={handleCopy} title="Скопировать пароль" aria-label="Скопировать пароль"
                        className="w-8 h-8 rounded-md text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                    <FontAwesomeIcon icon={faCopy}/>
                </button>
            </div>
        </Link>
    );
}