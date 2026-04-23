import {Dispatch, SetStateAction} from "react";

export default function CheckBox({isActive, setIsActive, color}: {isActive: boolean, setIsActive: Dispatch<SetStateAction<boolean>>, color: string}) {
    return (
        <>
            <div className={`relative flex items-center justify-center w-5 h-5 rounded bg-${color} text-transparent`}>
                <input type="checkbox" checked={isActive} className="opacity-0 absolute w-full h-full cursor-pointer" onChange={(e) => setIsActive(e.target.checked)}/>
                <div className={`h-4 w-4 rounded flex items-center justify-center transition-colors 
                    ${isActive ? 'bg-(--accent-color)' : 'bg-(--background-color)'}`}>
                    {isActive && <span className="text-(--text-color) text-xs">✓</span>}
                </div>
            </div>
        </>
    )
}