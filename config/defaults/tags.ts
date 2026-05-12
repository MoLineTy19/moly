import {TagColorScheme} from "@/types/components";
import {faHome, faPen} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faUser} from "@fortawesome/free-regular-svg-icons";

export const DEFAULT_TAG_COLORS: TagColorScheme[] = [
    { color: '#3b82f6', backgroundColor: '#0d3577', borderColor: '#92b9ff' },   // синий
    { color: '#10b981', backgroundColor: '#096a4a', borderColor: '#9df6d8' },   // зелёный
    { color: '#f59e0b', backgroundColor: '#5c3a0a', borderColor: '#ffd966' },   // оранжевый
    { color: '#ef4444', backgroundColor: '#7f1a1a', borderColor: '#fca5a5' },   // красный
    { color: '#8b5cf6', backgroundColor: '#3b1e6b', borderColor: '#c4b5fd' },   // фиолетовый
]

export const DEFAULT_TAG_ICON: Array<IconDefinition> = [
    faUser, faHome, faPen
]