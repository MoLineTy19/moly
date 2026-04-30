"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Link from "next/link";

export interface RowConfig {
    isSelected: boolean;
    service: string;
    username: string;
    category: string;
    status: number;
    createdAt: number;
}

export interface statusDetails {
    color: string
}

export const statuses: Record<string, statusDetails> = {
    3: {
        color: "(--accent-color)"
    },
    1: {
        color: "red-500"
    }
}

export interface categoryDetails {
    background: string,
    textColor: string,
    borderColor: string,
}

export const categoryList: Record<string, categoryDetails> = {
    "Работа": {
        background: "bg-blue-500/10",
        textColor: "text-blue-400",
        borderColor: "border-blue-500/20"
    }
}


export default function Row({isSelected, username, service, category, status, createdAt}: RowConfig) {
    const categoryDetails = categoryList[category];
    const statusDetails = statuses[status];

    const [isChecked, setIsChecked] = useState(isSelected);

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
                        {service}
                    </span>
                </div>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50 text-(--text-muted) brightness-130">
                <Link href={"/passwords/showPassword"} className="hover:text-(--accent-color) hover:underline transition-colors">
                    {username}
                </Link>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${categoryDetails.textColor} ${categoryDetails.borderColor} ${categoryDetails.background}`}>
                    {category}
                </span>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-${statusDetails.color}/10 text-${statusDetails.color} border border-${statusDetails.color}/20 text-xs`}>
                    {/*<span className="w-1.5 h-1.5 rounded-full text-(--accent-color)"></span>*/}
                    {status}
                </span>
            </td>
            <td className="py-3 px-4 border-l border-(--border-color)/50 text-(--text-muted)">{createdAt}</td>
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