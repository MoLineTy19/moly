import {useState} from "react";

export default function CheckBox() {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-600 bg-black-900 text-transparent">
                <input type="checkbox" checked={isActive} className="opacity-0 absolute w-full h-full cursor-pointer" onChange={(e) => setIsActive(e.target.checked)}/>
                <div className={`h-4 w-4 rounded flex items-center border justify-center transition-colors 
                    ${isActive ? 'bg-(--accent-color) border-(--accent-color)' : 'bg-(--background-color) border-(--border-input-color) group-hover:border-(--border-input-color)/80'}`}>
                    {isActive && <span className="text-(--text-color) text-xs">✓</span>}
                </div>
            </div>
        </>
    )
}