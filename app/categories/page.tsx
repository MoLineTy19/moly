import {faCheck, faGamepad, faGripVertical, faPen, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";

export default function Categories() {
    return (
        <div className="grow overflow-y-auto p-8 relative">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-(--text-color) flex items-center gap-3 mb-2">
                        Управление категориями
                        <span className="text-sm font-normal bg-(--background-secondary) text-gray-400 py-0.5 px-2.5 rounded-md border border-gray-700">
                            8
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Создавайте, редактируйте и сортируйте категории для организации ваших паролей.
                    </p>
                </div>
                <button className="bg-(--accent-color)/80 hover:bg-(--accent-color) text-(--text-color) font-medium py-2 px-4 rounded-lg shadow-lg shadow-(--accent-color)/20 transition-all flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} />
                    Создать категорию
                </button>
            </div>
            <div className="flex gap-6 max-w-6xl">
                <div className="grow w-2/3">
                    <div className="bg-(--background-secondary) border border-gray-800 rounded-xl overflow-hidden shadow-soft">
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-(--background-secondary)">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                Структура категорий
                            </h2>
                            <span className="text-xs text-gray-500">
                                Drag & Drop для сортировки
                            </span>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="group flex items-center justify-between p-3 rounded-lg border border-gray-800/50 bg-(--background-color) hover:bg-(--background-secondary)/50 hover:border-gray-700 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="drag-handle text-gray-600 hover:text-gray-400 px-1 py-2">
                                        <FontAwesomeIcon icon={faGripVertical} />
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <div>
                                        <div className="text-(--text-color) font-medium text-sm">
                                            Личное
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            42 записи
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-8 h-8 rounded-md bg-(--background-color) border border-gray-800 text-gray-400 hover:text-(--text-color) hover:border-gray-600 flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button className="w-8 h-8 rounded-md bg-(--background-color) border border-gray-800 text-red-400 hover:text-red-300 hover:border-red-900/50 hover:bg-red-900/20 flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/3">
                    <div className='bg-(--background-secondary) border border-gray-800 rounded-xl shadow-soft sticky top-0'>
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-sm font-medium text-(--text-color)">
                                Редактирование категории
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">
                                    Название
                                </label>
                                <input type="text" value="Развлечения" className="w-full px-4 py-2 bg-(--background-color) border border-gray-700 rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) focus:ring-1 focus:ring-(--accent-color) transition-all"/>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-3">Цвет</label>
                                <div className="flex flex-wrap gap-2">
                                    <button className="w-8 h-8 rounded-full bg-[#ef4444] border-2 border-transparent hover:border-(--text-color) transition-all">

                                    </button>
                                    <button className="w-8 h-8 rounded-full bg-[#eab308] border-2 border-(--text-color) shadow-glow transition-all relative flex items-center justify-center">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-3">
                                    Иконка
                                </label>
                                <div className="grid grid-cols-6 gap-2">
                                    <button className="aspect-square rounded-lg bg-(--background-color) border border-gray-800 text-gray-400 hover:text-(--text-color) hover:border-gray-600 flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faUser} />
                                    </button>
                                    <button className="aspect-square rounded-lg bg-(--accent-color)/10 border border-(--accent-color) text-(--accent-color) flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faGamepad} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-800 bg-(--background-secondary)/50 rounded-b-xl flex justify-end gap-3">
                            <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-(--text-color) transition-colors">
                                Отмена
                            </button>
                            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-(--accent-color)/80 hover:bg-(--accent-color) text-(--text-color) shadow-md shadow-(--accent-color)/10 transition-colors">
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}