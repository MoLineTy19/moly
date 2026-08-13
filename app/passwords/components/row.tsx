"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis, faEyeLowVision} from "@fortawesome/free-solid-svg-icons";
import React, {MouseEventHandler, useState} from "react";
import Link from "next/link";
import {faCopy, faEye} from "@fortawesome/free-regular-svg-icons";
import toast from "react-hot-toast";
import {Password} from "@/types";
import {generateTagColor, FALLBACK_TAG_COLOR} from "@/utils/color";
import {STRENGTH_DETAILS} from "@/config";
import {useConfigStore} from "@/store/configStore";
import {copyWithAutoClear} from "@/utils/clipboard";
import SecurityBadges from "./securityBadges";

export default function Row({item, selected, onToggle}: { item: Password; selected: boolean; onToggle: (id: number) => void }) {
    const createdDate = new Date(item.createdAt);

    const [isShow, setShow] = useState(false);

    const baseColor = generateTagColor(item.tag?.color ?? FALLBACK_TAG_COLOR);
    const passwordStatusDetails = STRENGTH_DETAILS[item.strengthScore] ?? STRENGTH_DETAILS[0];

    const formattedDate = createdDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const handleClickShow: MouseEventHandler = () => {
        setShow(!isShow)
    }

    const clipboardClearTimeout = useConfigStore((s) => s.clipboardClearTimeout);

    const handleCopy: MouseEventHandler = async (e) => {
        e.preventDefault();

        if (!item.password || !item.password.length) {
            toast.error("Поле пароля пустое")
            return
        }

        try {
            await copyWithAutoClear(item.password, clipboardClearTimeout)
            toast.success(clipboardClearTimeout > 0
                ? `Скопировано, очистится через ${clipboardClearTimeout}с`
                : "Скопировано")
        } catch (err) {
            toast.error("Произошла неизвестная ошибка")
            console.error(err)
        }
    }


    return (
        <tr className="table-row-hover border-b border-(--text-muted)/20 transition-colors group cursor-pointer"
            style={{backgroundColor: item.strengthScore <= 2 ? 'rgba(255, 0, 0, 0.02)' : '' /* слабые пароли подсвечиваются бледно-красным */}}>
            <td className="py-3 px-4 text-center">
                <label className="relative flex  items-center justify-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="opacity-0 absolute h-4 w-4 z-10"
                        checked={selected}
                        onChange={() => onToggle(item.id)}
                    />
                    <div className={`h-4 w-4 rounded flex items-center  border justify-center transition-colors
        ${selected ? 'bg-(--accent-color) border-(--accent-color)' : 'bg-(--background-color) border-(--text-muted)/80 group-hover:border-(--text-muted)'}`}>
                        {selected && <span className="text-(--text-color) text-xs">✓</span>}
                    </div>
                </label>
            </td>
            <td className="py-3 px-4">
                <Link href={`/passwords/${item.id}`}>
                    <div className="flex items-center gap-3">
                        {/*Здесь иконки*/}
                        <span className="font-medium text-(--text-color)">
                        {item.title}
                    </span>
                    </div>
                </Link>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50 text-(--text-muted) brightness-130">
                <Link href={`/passwords/${item.id}`}>
                    <span className="hover:text-(--accent-color) hover:underline transition-colors">
                        {item.login}
                    </span>
                </Link>
            </td>
            <td className="py-3 pl-4 pr-1 border-l border-(--border-color)/50">
                <div className="flex relative">
                    <div className="bg-(--background-color) rounded pl-2 py-1">
                        <input type={isShow ? "text" : "password"} disabled={true}
                               value={isShow ? item.password : "*".repeat(16)}/>
                    </div>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                        <button type="button" aria-label={isShow ? "Скрыть пароль" : "Показать пароль"}
                                className="w-8 h-8 rounded-md text-(--text-muted) brightness-130 hover:text-(--text-color) hover:bg-(--background-color) flex items-center justify-center transition-colors"
                                onClick={(handleClickShow)}>
                            <FontAwesomeIcon icon={isShow ? faEye : faEyeLowVision}/>
                        </button>
                        <button type="button" aria-label="Скопировать пароль"
                                className="w-8 h-8 rounded-md text-(--text-muted) brightness-130 hover:text-(--text-color) hover:bg-(--background-color) flex items-center justify-center transition-colors"
                                onClick={handleCopy}>
                            <FontAwesomeIcon icon={faCopy}/>
                        </button>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs"
                      style={{
                          color: baseColor.color,
                          backgroundColor: baseColor.backgroundColor,
                          borderColor: baseColor.borderColor,
                      }}>
                    {item.tag?.title ?? 'Без тега'}
                </span>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50">
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs w-fit"
                          style={{
                              color: passwordStatusDetails.color,
                              backgroundColor: passwordStatusDetails.backgroundColor,
                              borderColor: passwordStatusDetails.borderColor,
                          }}>
                        {passwordStatusDetails.title}
                    </span>
                    <SecurityBadges id={item.id} compact showLabels={false}/>
                </div>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50 text-(--text-muted)">{formattedDate}</td>
            <td className="py-3 px-4 text-right">
                <Link href={`/passwords/edit/${item.id}`}>
                    <button aria-label="Редактировать"
                        className="text-(--text-muted) hover:text-(--text-color) opacity-0 group-hover:opacity-100 transition-all">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </button>
                </Link>
            </td>
        </tr>
    )
}