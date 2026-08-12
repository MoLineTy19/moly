import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {IconOptionScheme} from "@/types/components";

export default function IconOption({icon, onClick, isSelected}: IconOptionScheme) {
    return (
        <button className={`aspect-square rounded-lg ${isSelected ? 'bg-(--accent-color)/10 border border-(--accent-color) text-(--accent-color)': 'bg-(--background-color) border border-(--border-color) text-(--text-secondary)'}  hover:text-(--text-color) hover:border-(--border-input-color) flex items-center justify-center transition-colors`}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} />
        </button>
    )
}