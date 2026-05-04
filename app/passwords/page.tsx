"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBorderAll,
    faListUl,
    faMagnifyingGlass,
    faPlus,
    faShieldHalved,
    faTableList
} from "@fortawesome/free-solid-svg-icons";
import {faFolder} from "@fortawesome/free-regular-svg-icons";
import React, {useState} from "react";
import Link from "next/link";
import {PasswordData, PasswordCount} from "@/store/passwordStore";
import TableView from "@/app/passwords/components/tableView";


export default function PasswordPage() {
    const [isChecked, setIsChecked] = useState(false);
    const passwordCount = PasswordCount();

    const [currentView, setCurrentView] = useState('table')

    const allPasswords = PasswordData();
    const [currentPage, setCurrentPage] = useState(0);
    const itemPerPage = 10;

    const totalPage = Math.ceil(allPasswords.length / itemPerPage);


    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPage - 1));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 0))
    }

    const switchDisplayView = (view: string, e: React.MouseEvent) => {
        setCurrentView(view);
    }

    return (
        <div className="grow overflow-y-auto p-8">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-(--text-color) flex items-center gap-3 mb-2">
                        Все пароли
                        <span className="text-sm font-normal bg-dark-800 text-(--text-muted) brightness-130 py-0.5 px-2.5 rounded-md border border-(--border-input-color)"> {passwordCount} </span>
                    </h1>
                    <h4 className="mt-3">Управляйте вашими сохраненными учетными записями и безопасными заметками.</h4>
                </div>
                <Link href="/passwords/addPassword">
                    <button className="bg-(--accent-color)/90 hover:bg-(--accent-color) text-(--text-color) font-medium py-2 px-4 rounded-lg shadow-lg shadow-(--accent-color)/20 transition-all flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlus}/>
                        Добавить пароль
                    </button>
                </Link>
            </div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex bg-(--background-secondary) rounded-lg p-1 border border-gray-800">
                    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-(--text-color) text-sm shadow-sm  hover:bg-white/5 ${currentView === 'table' ? 'border bg-white/5 border-(--border-input-color)' : ''}`} onClick={(e) => switchDisplayView('table', e)}>
                        <FontAwesomeIcon icon={faTableList}/>
                        Таблица
                    </button>
                    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-(--text-color) text-sm shadow-sm hover:bg-white/5 ${currentView === 'board' ? 'border bg-white/5 border-(--border-input-color)' : ''}`} onClick={(e) => switchDisplayView('board', e)}>
                        <FontAwesomeIcon icon={faBorderAll}/>
                        Доска
                    </button>
                    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-(--text-color) text-sm shadow-sm hover:bg-white/5 ${currentView === 'list' ? 'border bg-white/5 border-(--border-input-color)' : ''}`} onClick={(e) => switchDisplayView('list', e)}>
                        <FontAwesomeIcon icon={faListUl}/>
                        Список
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-(--background-secondary) border border-(--border-input-color) text-gray-300 hover:text-(--text-color) text-sm transition-colors">
                        <FontAwesomeIcon icon={faFolder}/>
                        Категория
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-(--background-secondary) border border-(--border-input-color) text-gray-300 hover:text-(--text-color) text-sm transition-colors">
                        <FontAwesomeIcon icon={faShieldHalved}/>
                        Надежность
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-(--text-color) text-sm transition-colors border border-transparent border-dashed hover:border-(--border-input-color)">
                        <FontAwesomeIcon icon={faPlus}/>
                        Добавить фильтр
                    </button>
                    <div className="h-6 w-px bg-gray-800 mx-2"></div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"/>
                        <input type="text" placeholder="Поиск" className="pl-9 pr-4 py-2 bg-(--background-secondary) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) w-64 placeholder-gray-500 transition-colors"/>
                    </div>
                </div>
            </div>
            <div className="bg-(--background-secondary) border border-gray-800 rounded-xl overflow-hidden shadow-soft">
                {/*тут сделать свап*/}
                { currentView === 'table' ? <TableView passwords={allPasswords} currentPage={currentPage} itemPerPage={itemPerPage} isChecked={isChecked} setIsChecked={setIsChecked}/> : null}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div>Показано {currentPage * itemPerPage + 1} - {Math.min((currentPage + 1) * itemPerPage, passwordCount)} из {passwordCount} записей</div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-md bg-(--background-secondary) border border-(--border-input-color) hover:text-(--text-color) hover:border-(--border-input-color)/90 transition-colors disabled:opacity-50" onClick={goToPreviousPage}>
                        Предыдущая
                    </button>
                    <button className="px-3 py-1.5 rounded-md bg-(--background-secondary) border border-(--border-input-color) hover:text-(--text-color) hover:border-(--border-input-color)/90 transition-colors" onClick={goToNextPage}>
                        Следующая
                    </button>
                </div>
            </div>
        </div>
    )
}