"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis, faEyeLowVision} from "@fortawesome/free-solid-svg-icons";
import React, {MouseEventHandler, useState} from "react";
import Link from "next/link";
import {faCopy, faEye} from "@fortawesome/free-regular-svg-icons";
import toast from "react-hot-toast";
import {STRENGTH_LEVELS} from "@/config";
import {Password, statusDetails} from "@/types";
import {generateTagColor} from "@/utils/color";


export const statuses: Record<number, statusDetails> = {
    4: {
        color: "(--accent-color)"
    },
    1: {
        color: "red-500"
    }
}

type RowItem = Password & { isSelected?: boolean };

export default function Row({ item }: { item: RowItem }) {
    const createdDate = new Date(item.createdAt);

    const [isShow, setShow] = useState(false);
    const [isChecked, setIsChecked] = useState(item.isSelected);

    const statusDetails = statuses[item.strengthScore];
    const baseColor = generateTagColor(item.tag.color)


    const handleClickShow: MouseEventHandler = () => {
        setShow(!isShow)
    }

    const handleCopy: MouseEventHandler = async (e) => {
        e.preventDefault();

        if (!item.password || !item.password.length) {
            toast.error("Поле пароля пустое!")
            return
        }

        try {
            await navigator.clipboard.writeText(item.password)
            toast.success("Скопировано")
        } catch (err) {
            toast.error("Произошла неизвестная ошибка")
            console.error(err)
        }
    }

    return (
        <tr className="table-row-hover border-b border-(--text-muted)/20 transition-colors group cursor-pointer">
            <td className="py-3 px-4 text-center">
                <label className="relative flex  items-center justify-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="custom-checkbox opacity-0 absolute h-4 w-4 z-10 border-text-(--text-muted)/80"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <div className={`h-4 w-4 rounded flex items-center  border justify-center transition-colors 
        ${isChecked ? 'bg-(--accent-color) border-(--accent-color)' : 'bg-(--background-color) border-(--text-muted)/80 group-hover:border-(--text-muted)'}`}>
                        {isChecked && <span className="text-white text-xs">✓</span>}
                    </div>
                </label>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    {/*Здесь иконки*/}
                    <span className="font-medium text-white">
                        {item.title}
                    </span>
                </div>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50 text-(--text-muted) brightness-130">
                <Link href={`/passwords/showPassword/${item.id}`} className="hover:text-(--accent-color) hover:underline transition-colors">
                    {item.login}
                </Link>
            </td>
            <td className="py-3 pl-4 pr-1 border-l border-(--border-color)/50">
                <div className="flex relative">
                    <div className="bg-(--background-color) rounded pl-2 py-1">
                        <input type={isShow ? "text" : "password"} disabled={true} value={item.password} />
                    </div>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                        <button type="button" className="w-8 h-8 rounded-md text-(--text-muted) brightness-130 hover:text-(--text-color) hover:bg-(--background-color) flex items-center justify-center transition-colors" onClick={(handleClickShow)}>
                            <FontAwesomeIcon icon={isShow ? faEye : faEyeLowVision } />
                        </button>
                        <button type="button" className="w-8 h-8 rounded-md text-(--text-muted) brightness-130 hover:text-(--text-color) hover:bg-(--background-color) flex items-center justify-center transition-colors" onClick={handleCopy}>
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs`} style={{color: baseColor.color, borderColor: baseColor.color}}>
                    {item.tag.title}
                </span>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-${statusDetails.color}/10 text-${statusDetails.color} border border-${statusDetails.color}/20 text-xs`}>
                    {STRENGTH_LEVELS[item.strengthScore]}
                </span>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50 text-(--text-muted)">{createdDate.toLocaleString('ru-RU')}</td>
            <td className="py-3 px-4 text-right">
                <Link href="/passwords/editPassword">
                    <button className="text-(--text-muted) hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </button>
                </Link>
            </td>
        </tr>
    )
}