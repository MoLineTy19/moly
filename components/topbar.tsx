'use client';

import {faBell, faListUl, faShieldHalved, faSliders} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faFolder, faHouse, faStar} from "@fortawesome/free-regular-svg-icons";

export interface RouteConfig {
    title: string,
    icon: IconDefinition
}

export const routes: Record<string, RouteConfig> = {
    "/passwords": {
        title: "Все пароли",
        icon: faListUl
    },
    "/favorites": {
        title: "Избранное",
        icon: faStar
    },
    "/categories": {
        title: "Управление категориями",
        icon: faFolder
    },
    "/search": {
        title: "Поиск и фильтры",
        icon: faSliders
    },
    "/security": {
        title: "Настройки безопасности",
        icon: faShieldHalved
    }
}

export default function Topbar() {
    const patchname = usePathname();

    const currentPage = routes[patchname] || {title: "Главная", icon: faHouse};

    return (
        <header className="border-b-2  col-span-1 h-15 flex gap-2 items-center pl-4 border-white/15 pr-7">
            <h3 className="text-(--text-color)/70">Moly</h3>
            <h3 className="text-(--text-color)/70"> {'/'} </h3>
            <div className="flex items-center">
                <FontAwesomeIcon icon={currentPage.icon} style={{color: "var(--accent-color)", margin: "6px 4px"}}/>
                <h3 className="text-(--text-color)/70"> {currentPage.title} </h3>
            </div>
            <button className="ml-auto">
                <FontAwesomeIcon icon={faBell} style={{color: "var(--accent-color)"}} />
            </button>
        </header>
    )
}