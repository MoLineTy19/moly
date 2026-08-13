'use client'

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";
import {Fragment} from "react";
import {faBell} from "@fortawesome/free-regular-svg-icons";

const routeNames: Record<string, string> = {
    "passwords": "Все пароли",
    "addPassword": "Добавить пароль",
    "favorites": "Избранное",
    "categories": "Управление тегами",
    "search": "Поиск и фильтры",
    "security": "Настройки безопасности",
};

/**
 * Компонент верхней панели
 */
export default function Topbar() {
    const path = usePathname().split("/").filter((value) => value.trim());

    return (
        <header className="h-16 border-b border-(--border-color) flex items-center justify-between px-8 shrink-0 bg-(--background-color)/80 backdrop-blur-md z-10">
            <div className="text-sm text-(--text-secondary) flex items-center gap-2">
                <span className="hover:text-(--text-color) cursor-pointer transition-colors">Moly</span>
                <span className="text-(--text-muted)">/</span>
                {path.map((item, index) => (
                    <Fragment key={index}>
                        <span className="hover:text-(--text-color) cursor-pointer transition-colors"> {routeNames[item]} </span>
                        {index + 1 >= path.length ? null : <span className="text-(--text-muted)">/</span>}
                    </Fragment>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <button aria-label="Уведомления" className="w-8 h-8 flex items-center justify-center rounded-lg text-(--text-secondary) hover:text-(--text-color) hover:bg-(--background-secondary) transition-colors relative">
                    <FontAwesomeIcon icon={faBell} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-(--accent-color) border border-(--background-secondary)"></span>
                </button>
            </div>
        </header>
    )
}