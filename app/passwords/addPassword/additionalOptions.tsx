import React, {Dispatch, SetStateAction} from "react";
import CheckBox from "@/app/passwords/addPassword/checkBox";


export default function AdditionOption({name, isActive, setIsActive}: {name: string; isActive: boolean, setIsActive: Dispatch<SetStateAction<boolean>>}) {
    return (
        <>
            <label className="text-sm font-medium mb-3 block">
                <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <CheckBox isActive={isActive} setIsActive={setIsActive} color="(--accent-color)"/>
                        <span className="text-(--text-color)/80 group-hover:text-(--text-color) transition-colors">{name}</span>
                    </label>
                </div>
            </label>

        </>
    )
}