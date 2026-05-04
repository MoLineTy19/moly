import {Dispatch, SetStateAction} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faKey, faShieldHalved, faTag} from "@fortawesome/free-solid-svg-icons";
import {faCalendar, faUser} from "@fortawesome/free-regular-svg-icons";
import {Password} from "@/types";
import Row from "@/app/passwords/row";

export default function TableView({passwords, currentPage, itemPerPage, isChecked, setIsChecked}: {passwords: Array<Password>, currentPage: number, itemPerPage: number, isChecked: boolean, setIsChecked: Dispatch<SetStateAction<boolean>>}) {
    const paginatedPasswords = passwords
        .slice(currentPage * itemPerPage, (currentPage + 1) * itemPerPage)
        .map(value => ({
            ...value,
            isSelected: false
        }))

    return (
        <table className="w-full text-left border-collapse">
            <thead>
            <tr className="border-b border-(--border-color) text-xs font-medium text-gray-400 uppercase tracking-wider bg-(--background-secondary)">
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
                    <Row isSelected={item.isSelected} login={item.login} title={item.title} tag={item.tag} strengthScore={item.strengthScore} createdAt={item.createdAt} key={index} password={item.password}/>
                ))
            }
            </tbody>
        </table>
    )
}