import {ButtonDefaultType} from "@/types/components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";


export default function ButtonDefault({text, icon, backgroundColor, borderColor, onClick}: ButtonDefaultType) {

    return (
        <button className={`px-4 py-2 hover:bg-(${backgroundColor}) border text-(--text-color) rounded-lg text-sm font-medium transition-colors whitespace-nowrap items-center bg-(${backgroundColor})/90 border-(${borderColor})`}
                onClick={onClick}
                style={{
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                }}
        >
            {icon ? <FontAwesomeIcon icon={icon} style={{marginRight: 6}}/> : null}
            {text}
        </button>
    )
}