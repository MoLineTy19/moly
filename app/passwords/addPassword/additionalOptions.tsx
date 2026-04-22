import React, {useState} from "react";

interface Option {
    name: string,
}

export default function AdditionOption({name}: Option) {
    const [isActive, setIsActive] = useState(false)

    return (
        <>
            <label className="text-sm font-medium mb-3 block">
                <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded border border-(--accent-color) bg-(--accent-color)/20 text-(--accent-color)">
                            <input type="checkbox" checked={isActive} className="opacity-0 absolute w-full h-full cursor-pointer" onChange={(e) => setIsActive(e.target.checked)}/>
                            <div className={`h-4 w-4 rounded flex items-center border justify-center transition-colors 
        ${isActive ? 'bg-(--accent-color) border-(--accent-color)' : 'bg-(--background-color) border-(--text-muted)/80 group-hover:border-(--text-muted)'}`}>
                                {isActive && <span className="text-(--text-color) text-xs">✓</span>}
                            </div>
                        </div>
                        <span className="text-(--text-color)/80 group-hover:text-(--text-color) transition-colors">{name}</span>
                    </label>
                </div>
            </label>

        </>
    )
}