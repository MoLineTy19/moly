import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ColorCircleScheme} from "@/types/components";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import React from "react";



export default function ColorCircle({color, isSelected, onClick}: ColorCircleScheme) {
    return (
        <button className="w-8 h-8 rounded-full shadow-glow transition-all relative flex items-center justify-center"
                style={{
                    backgroundColor: color
                }}
                onClick={onClick}
        >
            { isSelected && <FontAwesomeIcon icon={faCheck} /> }
        </button>
    )
}