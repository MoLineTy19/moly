"use client"


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown, faArrowRightToBracket, faBorderAll, faCodeBranch,
    faDesktop,
    faExclamation,
    faFileExport,
    faFileImport, faGears,
    faKey, faListUl,
    faLock, faTableList
} from "@fortawesome/free-solid-svg-icons";
import {faEye} from "@fortawesome/free-regular-svg-icons";
import React, {MouseEventHandler, useState} from "react";

/**
 * Страница с настройками Moly
 */
export default function Security() {
    const [currentView, setCurrentView] = useState('table')
    const [enabled, setEnabled] = useState(false);

    const handleCheckUpdate: MouseEventHandler = (e) => {
        e.preventDefault()
    }

    const handleResetRecoveryKey: MouseEventHandler = (e) => {
        e.preventDefault()
    }

    const switchDisplayView = (view: string, e: React.MouseEvent) => {
        setCurrentView(view);
    }

    return (
        <div className="grow overflow-y-auto p-4 md:p-8 relative w-full">
            <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12">
                <div>
                    <h2 className="text-2xl font-bold text-(--text-color) mb-2">
                        Центр безопасности
                    </h2>
                    <p className="text-sm text-gray-400">
                        Управляйте настройками доступа, сессиями и параметрами защиты вашего сейфа.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-(--background-secondary) border border-gray-800 rounded-xl p-5 shadow-soft flex items-start gap-4 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-(--accent-color)/10 rounded-full blur-2xl">

                        </div>
                        <div className="w-10 h-10 rounded-lg bg-dark-800 border border-gray-700 flex items-center justify-center shrink-0 text-(--accent-color)">
                            <FontAwesomeIcon icon={faExclamation} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-medium mb-1">
                                Статус защиты
                            </div>
                            <div className="text-lg font-semibold text-(--text-color)">
                                Оптимальный
                            </div>
                        </div>
                    </div>
                    <div className="bg-(--background-secondary) border border-gray-800 rounded-xl p-5 shadow-soft flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 border border-gray-700 flex items-center justify-center shrink-0 text-gray-300">
                            <FontAwesomeIcon icon={faKey} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-medium mb-1">Смена мастер-пароля</div>
                            <div className="text-lg font-semibold text-(--text-color)">45 дней назад</div>
                            <div className="text-xs text-gray-400 mt-1">Рекомендуется менять каждые 90 дней</div>
                        </div>
                    </div>
                    <div className="bg-(--background-secondary) border border-gray-800 rounded-xl p-5 shadow-soft flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 border border-gray-700 flex items-center justify-center shrink-0 text-gray-300">
                            <FontAwesomeIcon icon={faCodeBranch} style={{color: 'var(--accent-color)'}}/>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-medium mb-1">
                                Статус обновлений
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                                Версия: 1.0
                            </p>
                            <button className={`px-4 py-2 hover:bg-(--accent-color) border text-(--text-color) rounded-lg text-sm font-medium transition-colors whitespace-nowrap items-center bg-(--accent-color)/90 border-(--accent-color)`} onClick={handleCheckUpdate}>
                                <FontAwesomeIcon icon={faDesktop} style={{marginRight: 6}}/>
                                Проверить версию
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <section className="bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-800 bg-(--background-secondary)/50">
                                <h2 className="text-lg font-medium text-(--text-color) flex items-center gap-2">
                                    <FontAwesomeIcon icon={faGears} />
                                    Общие настройки
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
                                    <div>
                                        <h3 className="text-sm font-medium text-(--text-color) mb-1">
                                            Отображение по умолчанию
                                        </h3>
                                        <p className="text-xs text-gray-400 max-w-md">
                                            Ваш основной ключ для доступа к сейфу. Убедитесь, что он надежный и уникальный.
                                        </p>
                                    </div>
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
                            </div>
                        </section>
                        <section className="bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-800 bg-(--background-secondary)/50">
                                <h2 className="text-lg font-medium text-(--text-color) flex items-center gap-2">
                                    <FontAwesomeIcon icon={faLock} />
                                    Авторизация и доступ
                                </h2>
                            </div>
                            <div className='p-6 flex flex-col gap-6'>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
                                    <div>
                                        <h3 className="text-sm font-medium text-(--text-color) mb-1">
                                            Мастер-пароль
                                        </h3>
                                        <p className="text-xs text-gray-400 max-w-md">
                                            Ваш основной ключ для доступа к сейфу. Убедитесь, что он надежный и уникальный.
                                        </p>
                                    </div>
                                    <button className='px-4 py-2 bg-white/5 hover:bg-dark-700 border border-gray-700 text-(--text-color) rounded-lg text-sm font-medium transition-colors whitespace-nowrap'>
                                        Сменить пароль
                                    </button>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-(--text-color) mb-1 flex items-center gap-2">
                                            Ключ восстановления
                                            <FontAwesomeIcon icon={faExclamation} className="text-yellow-500 text-[10px]" />
                                        </h3>

                                        <p className="text-xs text-gray-400 max-w-md">
                                            Единственный способ восстановить доступ, если вы забудете мастер-пароль.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-2 bg-dark-800 hover:bg-dark-700 border border-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors" title="Показать ключ">
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className={`px-4 py-2 hover:bg-red-500 border text-(--text-color) rounded-lg text-sm font-medium transition-colors whitespace-nowrap items-center bg-red-500/90 border-(--border-color)`} onClick={handleResetRecoveryKey}>
                                            Перегенерировать
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </section>
                    </div>
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <section className='bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft overflow-hidden'>
                            <div className="px-5 py-4 border-b border-gray-800 bg-(--background-secondary)/50">
                                <h2 className="text-sm font-medium text-(--text-color) uppercase tracking-wider">
                                    Политики безопасности
                                </h2>
                            </div>
                            <div className='p-5 flex flex-col gap-5'>
                                <div>
                                    <label className="block text-sm font-medium text-(--text-color) mb-2">
                                        Автоблокировка сейфа
                                    </label>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Время неактивности до запроса мастер-пароля.
                                    </p>
                                    <div className="relative">
                                        <select className="w-full px-3 py-2.5 bg-(--background-color) border border-gray-700 rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors appearance-none cursor-pointer">
                                            <option value={1}>1 минута</option>
                                            <option value={5} selected={true}>5 минута</option>
                                            <option value={15}>15 минут</option>
                                            <option value={30}>30 минут</option>
                                            <option value={1}>1 час</option>
                                            <option value={'never'}>Никогда (не рекомендуется)</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-gray-800"/>
                                <div>
                                    <label className="block text-sm font-medium text-(--text-color) mb-2">
                                        Очистка буфера обмена
                                    </label>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Автоматическое удаление скопированных паролей.
                                    </p>
                                    <div className="relative">
                                        <select className='w-full px-3 py-2.5 bg-(--background-color) border border-gray-700 rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors appearance-none cursor-pointer'>
                                            <option value="10">10 секунд</option>
                                            <option value="30">30 секунд</option>
                                            <option value="60">60 секунд</option>
                                            <option value="never">Никогда</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-gray-800"/>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-(--text-color) mb-1">
                                            Блокировка при сворачивании
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            Блокировать сейф при переключении вкладок
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type={'checkbox'} className="sr-only peer" checked={enabled} onChange={() => setEnabled(!enabled)}/>
                                        <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-(--accent-color) peer-focus:ring-2 peer-focus:ring-(--accent-color)/30 transition-colors duration-200">
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}>

                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </section>
                        <section className="bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-800 bg-(--background-secondary)/50">
                                <h2 className="text-sm font-medium text-(--text-color) uppercase tracking-wider">
                                    Данные сейфа
                                </h2>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 border border-gray-700 transition-colors text-sm text-gray-300 group">
                                    <span className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={faFileExport} />
                                         Экспорт данных (CSV, JSON)
                                    </span>
                                </button>
                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-dark-800 hover:bg-dark-700 border border-gray-700 transition-colors text-sm text-gray-300 group">
                                    <span className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={faFileImport} />
                                         Импорт из других менеджеров
                                    </span>
                                </button>
                            </div>
                        </section>
                        <section className="bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft overflow-hidden flex flex-col">
                            <div className="px-5 py-4 border-b border-gray-800 bg-(--background-secondary)/50 flex justify-between items-center">
                                <h2 className="text-sm font-medium text-(--text-color) uppercase tracking-wider">
                                    Журнал активности
                                </h2>
                                <button className="text-xs text-(--accent-color) hover:text-brand-400 transition-colors">
                                    Смотреть все
                                </button>
                            </div>
                            <div className="p-0 divide-y divide-gray-800/50">
                                <div className='px-5 py-3 flex gap-3'>
                                    <div className="w-6 h-6 rounded-full bg-(--accent-color)/10 text-(--accent-color) flex items-center justify-center shrink-0 mt-0.5">
                                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-300">
                                            Успешный вход в систему
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            Сегодня, 10:45
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}