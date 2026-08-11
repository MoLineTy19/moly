"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faBorderAll,
    faListUl,
    faMagnifyingGlass,
    faPlus,
    faShieldHalved,
    faTableList, faXmark
} from "@fortawesome/free-solid-svg-icons";
import {faFolder} from "@fortawesome/free-regular-svg-icons";
import React, {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import TableView from "@/app/passwords/components/tableView";
import BoardView from "@/app/passwords/components/boardView";
import {usePasswordStore} from "@/store/passwordStore";
import {useConfigStore} from "@/store/configStore";
import {useTagStore} from "@/store/tagStore";
import ListView from "@/app/passwords/components/listView";
import {STRENGTH_DETAILS} from "@/config";

/**
 * Страница с отображением паролей
 */
export default function PasswordPage() {
    const passwords = usePasswordStore((state) => state.passwords);
    const passwordCount = usePasswordStore((state) => state.passwordCount);
    const allTags = useTagStore((state) => state.tags);

    const {currentView, setCurrentView} = useConfigStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterTag, setFilterTag] = useState<number | null>(null);
    const [filterStrength, setFilterStrength] = useState<number | null>(null);

    const [isChecked, setIsChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemPerPage = 10;

    const filteredPasswords = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return passwords.filter(p => {
            if (q) {
                const hay = `${p.title ?? ""} ${p.login ?? ""} ${p.url ?? ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            if (filterTag !== null && p.tag?.id !== filterTag) return false;
            if (filterStrength !== null && p.strengthScore !== filterStrength) return false;
            return true;
        });
    }, [passwords, searchQuery, filterTag, filterStrength]);

    const totalPage = Math.max(1, Math.ceil(filteredPasswords.length / itemPerPage));

    useEffect(() => {
        if (currentPage > totalPage - 1) setCurrentPage(0);
    }, [currentPage, totalPage]);


    const goToNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPage - 1));
    const goToPreviousPage = () => setCurrentPage(p => Math.max(p - 1, 0));
    const switchDisplayView = (view: string) => setCurrentView(view);

    const hasActiveFilters = searchQuery.trim() !== "" || filterTag !== null || filterStrength !== null;
    const resetFilters = () => {
        setSearchQuery("");
        setFilterTag(null);
        setFilterStrength(null);
    };

    const shownCount = filteredPasswords.length;


    return (
        <div className="grow overflow-y-auto p-8">
            {/* Хедер */}
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold text-(--text-color) flex items-center gap-3 mb-2">
                        Все пароли
                        <span className="text-sm font-normal bg-(--background-secondary) text-(--text-muted) py-0.5 px-2.5 rounded-md border border-(--border-input-color)">
                            {passwordCount}
                        </span>
                    </h1>
                    <p className="text-sm text-(--text-muted)">
                        Управляйте вашими сохраненными учетными записями и безопасными заметками.
                    </p>
                </div>
                <Link href="/passwords/addPassword">
                    <button className="bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) font-medium py-2 px-4 rounded-lg shadow-lg shadow-(--accent-color)/20 transition-all flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlus}/>
                        Добавить пароль
                    </button>
                </Link>
            </div>

            {/* Тулбар */}
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                {/* Переключатель видов */}
                <div className="flex bg-(--background-secondary) rounded-lg p-1 border border-(--border-color)">
                    {[
                        {key: 'table', icon: faTableList, label: 'Таблица'},
                        {key: 'board', icon: faBorderAll, label: 'Доска'},
                        {key: 'list', icon: faListUl, label: 'Список'},
                    ].map(v => (
                        <button key={v.key}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors border ${currentView === v.key ? 'bg-white/5 text-(--text-color) border-(--border-input-color)' : 'text-(--text-muted) hover:text-(--text-color) hover:bg-white/5 border-transparent'}`}
                                onClick={() => switchDisplayView(v.key)}>
                            <FontAwesomeIcon icon={v.icon}/>
                            {v.label}
                        </button>
                    ))}
                </div>

                {/* Фильтры + поиск */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <select
                            value={filterTag ?? ""}
                            onChange={(e) => setFilterTag(e.target.value === "" ? null : Number(e.target.value))}
                            className="appearance-none pl-3 pr-9 py-2 rounded-lg bg-(--background-secondary) border border-(--border-input-color) text-(--text-muted) hover:text-(--text-color) text-sm transition-colors cursor-pointer focus:outline-none focus:border-(--accent-color)">
                            <option value="">Все теги</option>
                            {allTags.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                        <FontAwesomeIcon icon={faAngleDown} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none text-xs"/>
                    </div>

                    <div className="relative">
                        <select
                            value={filterStrength ?? ""}
                            onChange={(e) => setFilterStrength(e.target.value === "" ? null : Number(e.target.value))}
                            className="appearance-none pl-3 pr-9 py-2 rounded-lg bg-(--background-secondary) border border-(--border-input-color) text-(--text-muted) hover:text-(--text-color) text-sm transition-colors cursor-pointer focus:outline-none focus:border-(--accent-color)">
                            <option value="">Любая надёжность</option>
                            {STRENGTH_DETAILS.map((s, i) => <option key={i} value={i}>{s.title}</option>)}
                        </select>
                        <FontAwesomeIcon icon={faAngleDown} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none text-xs"/>
                    </div>

                    {hasActiveFilters && (
                        <button onClick={resetFilters}
                                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-(--text-muted) hover:text-(--text-color) text-sm transition-colors border border-transparent hover:border-(--border-input-color)">
                            <FontAwesomeIcon icon={faXmark}/>
                            Сбросить
                        </button>
                    )}

                    <div className="h-6 w-px bg-(--border-color) mx-1"></div>

                    <div className="relative">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted) text-sm"/>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск" className="pl-9 pr-4 py-2 bg-(--background-secondary) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) w-64 placeholder-gray-500 transition-colors"/>
                    </div>
                </div>
            </div>

            {/* Контент */}
            {shownCount === 0 ? (
                <div className="bg-(--background-secondary) border border-(--border-color) border-dashed rounded-xl p-12 text-center">
                    <div className="text-(--text-muted) text-sm">
                        {hasActiveFilters
                            ? "Ничего не найдено. Попробуйте изменить запрос или сбросить фильтры."
                            : "Пока нет сохранённых паролей."}
                    </div>
                    {hasActiveFilters && (
                        <button onClick={resetFilters} className="mt-4 text-sm text-(--accent-color) hover:text-(--accent-color)/70 transition-colors">
                            Сбросить фильтры
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {currentView === 'table' && (
                        <>
                            <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl overflow-hidden shadow-soft">
                                <TableView passwords={filteredPasswords} currentPage={currentPage} itemPerPage={itemPerPage} isChecked={isChecked} setIsChecked={setIsChecked}/>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm text-(--text-muted)">
                                <div>
                                    Показано {currentPage * itemPerPage + 1}–{Math.min((currentPage + 1) * itemPerPage, shownCount)} из {shownCount}
                                    {hasActiveFilters && ` (всего ${passwordCount})`}
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 rounded-md bg-(--background-secondary) border border-(--border-input-color) text-(--text-muted) hover:text-(--text-color) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            onClick={goToPreviousPage} disabled={currentPage === 0}>
                                        Предыдущая
                                    </button>
                                    <button className="px-3 py-1.5 rounded-md bg-(--background-secondary) border border-(--border-input-color) text-(--text-muted) hover:text-(--text-color) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            onClick={goToNextPage} disabled={currentPage >= totalPage - 1}>
                                        Следующая
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    {currentView === 'board' && <BoardView passwords={filteredPasswords}/>}
                    {currentView === 'list' && <ListView passwords={filteredPasswords}/>}
                </>
            )}
        </div>
    );
}