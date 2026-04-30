"use client"

import Row from "@/app/passwords/row";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBorderAll, faGlobe, faKey,
    faListUl,
    faMagnifyingGlass,
    faPlus,
    faShieldHalved,
    faTableList, faTag
} from "@fortawesome/free-solid-svg-icons";
import {faCalendar, faFolder, faUser} from "@fortawesome/free-regular-svg-icons";
import React, {useState} from "react";
import Link from "next/link";
import {PasswordData, PasswordCount} from "@/store/passwordStore";


export default function PasswordPage() {
    const [isChecked, setIsChecked] = useState(false);
    const [pagePassword, setPagePassword] = useState();
    const passwordCount = PasswordCount();

    const allPasswords = PasswordData();
    const [currentPage, setCurrentPage] = useState(0);
    const itemPerPage = 10;

    const totalPage = Math.ceil(allPasswords.length / itemPerPage);

    const paginatedPasswords = allPasswords
        .slice(currentPage * itemPerPage, (currentPage + 1) * itemPerPage)
        .map(value => ({
            ...value,
            isSelected: false
        }))


    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPage - 1));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 0))
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
                <div className="flex bg-dark-900 rounded-lg p-1 border border-gray-800">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-dark-800 text-(--text-color) text-sm shadow-sm border border-(--border-input-color)">
                        <FontAwesomeIcon icon={faTableList}/>
                        Таблица
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-400 hover:text-(--text-color) text-sm transition-colors">
                        <FontAwesomeIcon icon={faBorderAll}/>
                        Доска
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-400 hover:text-(--text-color) text-sm transition-colors">
                        <FontAwesomeIcon icon={faListUl}/>
                        Список
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-900 border border-(--border-input-color) text-gray-300 hover:text-(--text-color) text-sm transition-colors">
                        <FontAwesomeIcon icon={faFolder}/>
                        Категория
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-900 border border-(--border-input-color) text-gray-300 hover:text-(--text-color) text-sm transition-colors">
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
                        <input type="text" placeholder="Поиск" className="pl-9 pr-4 py-2 bg-dark-900 border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) w-64 placeholder-gray-500 transition-colors"/>
                    </div>
                </div>
            </div>
            <div className="bg-(--background-secondary) border border-gray-800 rounded-xl overflow-hidden shadow-soft">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-(--border-color) text-xs font-medium text-gray-400 uppercase tracking-wider bg-dark-900">
                        <th className="py-4 px-4 w-12 text-center">
                            <label className="relative flex items-center justify-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox opacity-0 absolute h-4 w-4 z-10"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                />
                                <div className={`h-4 w-4 rounded flex items-center border justify-center transition-colors 
        ${isChecked ? 'bg-(--accent-color) border-(--accent-color)' : 'bg-(--background-color) border-(--border-input-color) group-hover:border-(--border-input-color)/80'}`}>
                                    {isChecked && <span className="text-(--text-color) text-xs">✓</span>}
                                </div>
                            </label>
                        </th>
                        <th className="py-4 px-4 font-medium w-lg">
                            <FontAwesomeIcon icon={faGlobe} className="mr-2"/>
                            САЙТ / НАЗВАНИЕ
                        </th>
                        <th className="py-4 px-4 font-medium w-1/5 border-l border-(--border-color)">
                            <FontAwesomeIcon icon={faUser} className="mr-2"/>
                            ЛОГИН
                        </th>
                        <th className="py-4 px-4 font-medium w-1/6 border-l border-(--border-color)">
                            <FontAwesomeIcon icon={faKey} className="mr-2"/>
                            Пароль
                        </th>
                        <th className="py-4 px-4 font-medium border-l border-(--border-color)">
                            <FontAwesomeIcon icon={faTag} className="mr-2"/>
                            КАТЕГОРИЯ
                        </th>
                        <th className="py-4 px-4 font-medium border-l border-(--border-color)">
                            <FontAwesomeIcon icon={faShieldHalved} className="mr-2"/>
                            СТАТУС
                        </th>
                        <th className="py-4 px-4 font-medium border-l border-(--border-color)">
                            <FontAwesomeIcon icon={faCalendar} className="mr-2"/>
                            ОБНОВЛЕНО
                        </th>
                    </tr>
                    </thead>
                    <tbody className="text-sm text-gray-300">
                    {
                        paginatedPasswords.map((item, index) => (
                            <Row isSelected={item.isSelected} login={item.login} title={item.title} category={item.category} strengthScore={item.strengthScore} createdAt={item.createdAt} key={index} password={item.password}/>
                        ))
                    }
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div>Показано {currentPage * itemPerPage + 1} - {Math.min((currentPage + 1) * itemPerPage, passwordCount)} из {passwordCount} записей</div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-md bg-dark-900 border border-(--border-input-color) hover:text-(--text-color) hover:border-(--border-input-color)/90 transition-colors disabled:opacity-50" onClick={goToPreviousPage}>
                        Предыдущая
                    </button>
                    <button className="px-3 py-1.5 rounded-md bg-dark-900 border border-(--border-input-color) hover:text-(--text-color) hover:border-(--border-input-color)/90 transition-colors" onClick={goToNextPage}>
                        Следующая
                    </button>
                </div>
            </div>
        </div>
    )
}