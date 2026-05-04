"use client"

import {
    faAngleDown,
    faFile,
    faListUl,
    faMagnifyingGlass,
    faPenToSquare,
    faShieldHalved, faSliders
} from "@fortawesome/free-solid-svg-icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {faFolder, faStar} from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import SectionButton from "@/components/layout/sectionButton";
import {PasswordCount} from "@/store/passwordStore";

export default function Sidebar() {
    return (
        <aside className="w-75 shrink-0 bg-(--background-secondary) border-r border-(--border-color) flex flex-col pt-6 pb-6 overflow-y-auto z-20">
            <div className="px-6 mb-8 flex items-center justify-between">
                <Link href="/passwords">
                    <div className="flex items-center gap-3 text-(--text-color) font-semibold text-lg">
                        <div className="w-8 h-8 rounded-lg bg-(--accent-color) flex items-center justify-center shadow-glow">
                            <FontAwesomeIcon icon={faShieldHalved} style={{color: "#ffffff", margin: "8px 6px"}}/>
                        </div>
                        Moly
                    </div>
                </Link>
                <Link href="/passwords/addPassword">
                    <button className="text-gray-400 hover:text-(--text-color) transition-colors">
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </Link>
            </div>
            <div className="px-4 mb-8 flex gap-2">
                <button className="grow flex items-center justify-between bg-dark-800 border border-(--border-input-color) hover:border-(--border-input-color)/80 rounded-lg px-3 py-2 text-xs text-gray-300 transition-colors">
                    <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFile} />
                        Быстрые действия
                    </span>
                    <span className="text-xs text-gray-500 bg-dark-950 px-1.5 py-0.5 rounded border border-(--border-input-color)">
                        ⌘K
                    </span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-dark-800 border border-(--border-input-color) hover:border-(--border-input-color) rounded-lg text-gray-300 transition-colors">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
            <nav className="px-3 space-y-1 grow">
                <div className="px-3 mb-2 text-xs font-medium text-(--text-muted) uppercase tracking-wider">
                    Разделы
                </div>
                <SectionButton title="Все пароли" icon={faListUl} href="/passwords" data={PasswordCount().toString()}/>
                <SectionButton title="Избранное" icon={faStar} href="/favorites"/>
                <div className="px-3 mt-8 mb-2 text-xs font-medium text-(--text-muted) uppercase tracking-wider flex items-center justify-between">
                    Управление
                    <FontAwesomeIcon icon={faAngleDown} />
                </div>
                <SectionButton title="Управление категориями" icon={faFolder} href="/categories"/>
                <SectionButton title="Поиск и фильтры" icon={faSliders} href="/search"/>
                <SectionButton title="Настройки безопасности" icon={faShieldHalved} href="/security"/>
            </nav>
        </aside>
    )
}