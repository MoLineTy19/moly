import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faGlobe} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {faUser} from "@fortawesome/free-regular-svg-icons";

export default function MetaData({url, setUrl, name, setName, login, setLogin, category, setCategory} : {url: string, setUrl: React.Dispatch<React.SetStateAction<string>>, name: string, setName: React.Dispatch<React.SetStateAction<string>>, login: string, setLogin: React.Dispatch<React.SetStateAction<string>>, category: string, setCategory: React.Dispatch<React.SetStateAction<string>>}) {
    const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value)
    }

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value)
    }

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>)=> {
        setCategory(e.target.value)
    }


    return (
        <>
            <div className="bg-(--background-secondary) border border-(--text-muted)/20 rounded-xl shadow-soft overflow-hidden">
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-(--text-color)/80 mb-2">
                            Сайт / Приложение*
                        </label>
                        <div className="flex relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                                <FontAwesomeIcon icon={faGlobe}/>
                            </div>
                            <input type="url" placeholder="https://example.com" className={`w-full pl-11 pr-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none transition-colors placeholder-gray-600 ${url.length >= 2 ? 'focus:border-(--accent-color)' : 'focus:border-red-500'}`} value={url} onChange={handleChangeUrl}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-(--text-color)/80 mb-2">
                            Название записи*
                        </label>
                        <input type="text" placeholder="Например: WoW 3" className={`w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none transition-colors placeholder-gray-600 ${name.length >= 2 ? 'focus:border-(--accent-color)' : 'focus:border-red-500'}`} value={name} onChange={handleChangeName}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-(--text-color)/80 mb-2">
                                Логин / Email*
                            </label>
                            <div className="flex relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                                    <FontAwesomeIcon icon={faUser}/>
                                </div>
                                <input type="text" placeholder="user@example.com" className={`w-full pl-11 pr-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none  transition-colors placeholder-gray-600 ${login.length >= 2 ? 'focus:border-(--accent-color)' : 'focus:border-red-500'}`} value={login} onChange={handleChangeLogin}/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-(--text-color)/80 mb-2">Категория</label>
                            <div className="relative">
                                <select className="w-full px-4 py-3 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors appearance-none cursor-pointer" value={category} onChange={handleChangeCategory}>
                                    <option disabled={true}>Выберите категорию</option>
                                    <option value="personal">Личное</option>
                                    <option value="work">Работа</option>
                                    <option value="finance">Финансы</option>
                                    <option value="social">Социальные сети</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none">
                                    <FontAwesomeIcon icon={faAngleDown}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}