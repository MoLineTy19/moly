"use client"

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";
import {SectionButtonDetails} from "@/types";


/**
 * Компонент кнопки для боковой панели
 */
export default function SectionButton({href, icon, title, data}: SectionButtonDetails) {
    const path = usePathname()

    return (
        <Link href={href} className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-(--text-color) font-medium transition-colors hover:bg-white/15 " + `${path === href? "bg-white/15": null}`}>
            <FontAwesomeIcon icon={icon}/>
            {title}
            { data ? <span className="ml-auto text-xs bg-(--background-color) text-gray-400 py-0.5 px-2 rounded-full border border-(--border-color)"> {data} </span> : null}
        </Link>
    )
}