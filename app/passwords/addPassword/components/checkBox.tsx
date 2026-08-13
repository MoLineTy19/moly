import {Dispatch, SetStateAction} from "react";

export default function CheckBox({isActive, setIsActive}: {isActive: boolean, setIsActive: Dispatch<SetStateAction<boolean>>}) {
    return (
        <>
            {/* Раньше тут было bg-${color} с динамической подстановкой — Tailwind v4
                такой класс не генерирует, и фон отсутствовал. Заменили на токен. */}
            <div className="relative flex items-center justify-center w-5 h-5 rounded bg-(--background-color) text-transparent">
                <input type="checkbox" checked={isActive} className="opacity-0 absolute w-full h-full cursor-pointer" onChange={(e) => setIsActive(e.target.checked)}/>
                <div className={`h-4 w-4 rounded flex items-center justify-center transition-colors
                    ${isActive ? 'bg-(--accent-color)' : 'bg-(--background-color)'}`}>
                    {isActive && <span className="text-(--text-color) text-xs">✓</span>}
                </div>
            </div>
        </>
    )
}
