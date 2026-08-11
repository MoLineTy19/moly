"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis, faEyeLowVision} from "@fortawesome/free-solid-svg-icons";
import {faCopy, faEye} from "@fortawesome/free-regular-svg-icons";
import React, {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {Password} from "@/types";
import {generateTagColor} from "@/utils/color";
import {STRENGTH_DETAILS} from "@/config";
import {useConfigStore} from "@/store/configStore";
import {copyWithAutoClear} from "@/utils/clipboard";

function getDomain(url: string): string | null {
    try {
        if (!url) return null;
        const u = new URL(url.startsWith('http') ? url : `https://${url}`);
        return u.hostname;
    } catch {
        return null;
    }
}

function ListRow({item}: { item: Password }) {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const clipboardClearTimeout = useConfigStore((s) => s.clipboardClearTimeout);

    const domain = getDomain(item.url);
    const tagColor = generateTagColor(item.tag?.color ?? '#6a7280');
    const strength = STRENGTH_DETAILS[item.strengthScore] ?? STRENGTH_DETAILS[0];

    const stop = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleCopy = async (e: React.MouseEvent) => {
        stop(e);
        if (!item.password) {
            toast.error("Поле пароля пустое!");
            return;
        }
        try {
            await copyWithAutoClear(item.password, clipboardClearTimeout);
            toast.success(clipboardClearTimeout > 0 ? `Скопировано, очистится через ${clipboardClearTimeout}с` : "Скопировано");
        } catch {
            toast.error("Произошла неизвестная ошибка");
        }
    };

    return (
        <Link href={`/passwords/${item.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-(--background-color) border border-(--border-color) flex items-center justify-center overflow-hidden shrink-0">
                {domain && !imgFailed ? (
                    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" aria-hidden
                         onError={() => setImgFailed(true)} className="w-5 h-5"/>
                ) : (
                    <span className="text-sm font-bold text-(--text-color)">
                        {(item.title?.[0] ?? '?').toUpperCase()}
                    </span>
                )}
            </div>

            <div className="grow min-w-0">
                <div className="text-sm font-medium text-(--text-color) truncate">{item.title}</div>
                <div className="text-xs text-(--text-muted) truncate">{item.login || 'нет логина'}</div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs"
                  style={{color: tagColor.color, backgroundColor: tagColor.backgroundColor, borderColor: tagColor.borderColor}}>
                {item.tag?.title ?? 'Без тега'}
            </span>
            <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded border"
                  style={{color: strength.color, backgroundColor: strength.backgroundColor, borderColor: strength.borderColor}}>
                {strength.title}
            </span>
            <code className="hidden lg:block text-xs font-mono text-(--text-muted) w-28 truncate">
                {show ? item.password : '•'.repeat(10)}
            </code>

            <div className="flex items-center gap-1">
                <button onClick={(e) => { stop(e); setShow(v => !v); }} title={show ? "Скрыть" : "Показать"}
                        className="w-8 h-8 rounded-md text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                    <FontAwesomeIcon icon={show ? faEyeLowVision : faEye}/>
                </button>
                <button onClick={handleCopy} title="Скопировать пароль"
                        className="w-8 h-8 rounded-md text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                    <FontAwesomeIcon icon={faCopy}/>
                </button>
                <button onClick={(e) => { stop(e); router.push(`/passwords/edit/${item.id}`); }} title="Редактировать"
                        className="w-8 h-8 rounded-md text-(--text-muted) hover:text-(--text-color) hover:bg-(--background-secondary) flex items-center justify-center transition-colors">
                    <FontAwesomeIcon icon={faEllipsis}/>
                </button>
            </div>
        </Link>
    );
}

export default function ListView({passwords}: { passwords: Password[] }) {
    if (!passwords?.length) return null;
    return (
        <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl overflow-hidden shadow-soft divide-y divide-(--border-color)">
            {passwords.map(item => <ListRow key={item.id} item={item}/>)}
        </div>
    );
}