import {ButtonDefaultType} from "@/types/components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";


export default function ButtonDefault({text, icon, backgroundColor, borderColor, onClick}: ButtonDefaultType) {

    return (
        <button className="px-4 py-2 border rounded-lg text-sm font-medium text-(--text-color) transition-opacity whitespace-nowrap inline-flex items-center hover:opacity-90"
                onClick={onClick}
                style={{
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                }}
        >
            {icon ? <FontAwesomeIcon icon={icon} className="mr-1.5"/> : null}
            {text}
        </button>
    )
}