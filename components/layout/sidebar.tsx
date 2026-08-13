"use client"

import {
    faAngleDown, faAngleUp,
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
import {useEffect, useState} from "react";
import {usePasswordStore} from "@/store/passwordStore";
import {useRouter} from "next/navigation";

/**
 * Компонент боковой панели
 */
export default function Sidebar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const passwordCount = usePasswordStore((state) => state.passwordCount);
    const favoritesCount = usePasswordStore(
        (state) => state.passwords.filter((p) => p.favorite).length
    );

    // Глобальный хоткей: ⌘K / Ctrl+K → переход на страницу поиска
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                router.push("/search");
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [router]);

    return (
        <aside className="w-75 shrink-0 bg-(--background-secondary) border-r border-(--border-color) flex flex-col pt-6 pb-6 overflow-y-auto z-20">
            <div className="px-6 mb-8 flex items-center justify-between">
                <Link href="/passwords">
                    <div className="flex items-center gap-3 text-(--text-color) font-semibold text-lg">
                        <div className="w-8 h-8 rounded-lg bg-(--accent-color) flex items-center justify-center shadow-glow">
                            <FontAwesomeIcon icon={faShieldHalved} className="text-(--text-color) my-2 mx-1.5"/>
                        </div>
                        Moly
                    </div>
                </Link>
                <Link href="/passwords/addPassword">
                    <button aria-label="Добавить пароль" className="text-(--text-secondary) hover:text-(--text-color) transition-colors">
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </Link>
            </div>
            <div className="px-4 mb-8 flex gap-2">
                <Link href="/search"
                      className="grow flex items-center justify-between bg-(--hover-overlay) border border-(--border-input-color) hover:border-(--border-input-color)/80 rounded-lg px-3 py-2 text-xs text-(--text-secondary) transition-colors">
                    <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFile} />
                        Быстрые действия
                    </span>
                    <span className="text-xs text-(--text-muted) bg-(--background-color) px-1.5 py-0.5 rounded border border-(--border-input-color)">
                        ⌘K
                    </span>
                </Link>
                <Link href="/search" aria-label="Поиск"
                      className="w-10 h-10 flex items-center justify-center bg-(--hover-overlay) border border-(--border-input-color) hover:border-(--border-input-color) rounded-lg text-(--text-secondary) transition-colors">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Link>
            </div>
            <nav className="px-3 space-y-1 grow">
                <div className="px-3 mb-2 text-xs font-medium text-(--text-muted) uppercase tracking-wider">
                    Разделы
                </div>
                <SectionButton title="Все пароли" icon={faListUl} href="/passwords" data={passwordCount.toString()}/>
                <SectionButton title="Избранное" icon={faStar} href="/favorites" data={favoritesCount > 0 ? favoritesCount.toString() : undefined}/>
                <div className="px-3 mt-8 mb-2 text-xs font-medium text-(--text-muted) uppercase tracking-wider flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    Управление
                    { isOpen ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} /> }
                </div>
                {
                    isOpen &&
                    <>
                        <SectionButton title="Управление тегами" icon={faFolder} href="/categories"/>
                        <SectionButton title="Поиск и фильтры" icon={faSliders} href="/search"/>
                        <SectionButton title="Настройки безопасности" icon={faShieldHalved} href="/security"/>
                    </>
                }
            </nav>
        </aside>
    )
}
