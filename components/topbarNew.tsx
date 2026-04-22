'use client'

import {faBell} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";
import {Fragment} from "react";

const routeNames: Record<string, string> = {
    "passwords": "Все пароли",
    "addPassword": "Добавить пароль",
    "favorites": "Избранное",
    "categories": "Управление категориями",
    "search": "Поиск и фильтры",
    "security": "Настройки безопасности",
};

export default function TopbarNew() {
    const path = usePathname().split("/").filter((value) => value.trim());

    return (
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 shrink-0 bg-dark-950/80 backdrop-blur-md z-10">
            <div className="text-sm text-gray-400 flex items-center gap-2">
                <span className="hover:text-white cursor-pointer transition-colors">Moly</span>
                <span className="text-gray-600">/</span>
                {path.map((item, index) => (
                    <Fragment key={index}>
                        <span className="hover:text-white cursor-pointer transition-colors"> {routeNames[item]} </span>
                        {index + 1 >= path.length ? null : <span className="text-gray-600">/</span>}
                    </Fragment>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-dark-800 transition-colors relative">
                    <FontAwesomeIcon icon={faBell} style={{color: "var(--accent-color)"}} />
                </button>
            </div>
        </header>
    )
}