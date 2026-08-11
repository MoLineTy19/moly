import {
    faBasketShopping,
    faBriefcase,
    faCamera,
    faCloud, faCoins,
    faHeart,
    faHome,
    faPen
} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faBluesky} from "@fortawesome/free-brands-svg-icons";

export const DEFAULT_TAG_COLORS = [
    'hsl(0, 70%, 55%)',      // красный
    'hsl(22.5, 70%, 55%)',   // оранжево-красный
    'hsl(45, 70%, 55%)',     // оранжевый
    'hsl(67.5, 70%, 55%)',   // золотистый
    'hsl(90, 70%, 55%)',     // салатовый
    'hsl(112.5, 70%, 55%)',  // жёлто-зелёный
    'hsl(135, 70%, 55%)',    // зелёный
    'hsl(157.5, 70%, 55%)',  // мятно-зелёный
    'hsl(180, 70%, 55%)',    // циан
    'hsl(202.5, 70%, 55%)',  // небесно-голубой
    'hsl(225, 70%, 55%)',    // синий
    'hsl(247.5, 70%, 55%)',  // сине-фиолетовый
    'hsl(270, 70%, 55%)',    // фиолетовый
    'hsl(292.5, 70%, 55%)',  // пурпурный
    'hsl(315, 70%, 55%)',    // розовый
    'hsl(337.5, 70%, 55%)',  // малиновый
];

export const DEFAULT_TAG_ICON: Array<IconDefinition> = [
    faUser, faHome, faPen, faCamera, faBasketShopping, faBluesky, faBriefcase, faCloud, faHeart, faCoins
]