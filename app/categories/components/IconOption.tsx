import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {IconOptionScheme} from "@/types/components";

/**
 * Компонент логики иконки
 */
export default function IconOption({icon, onClick, isSelected}: IconOptionScheme) {
    return (
        <button className={`aspect-square rounded-lg ${isSelected ? 'bg-(--accent-color)/10 border border-(--accent-color) text-(--accent-color)': 'bg-(--background-color) border border-gray-800 text-gray-400'}  hover:text-(--text-color) hover:border-gray-600 flex items-center justify-center transition-colors`}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} />
        </button>
    )
}