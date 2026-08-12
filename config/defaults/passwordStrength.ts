import {StatusDetails} from "@/types";

/** rgba(...) из hex-цвета (#rgb / #rrggbb) с заданной непрозрачностью */
function hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace('#', '');
    const full = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const STRENGTH_WEIGHTS = {
    length: {
        min: 0,
        thresholds: [
            { length: 8, points: 1},
            { length: 12, points: 2},
            { length: 16, points: 3},
        ],
    },
    charTypes: {
        lowercase: 1,
        uppercase: 1,
        digits: 1,
        symbol: 1,
    },
    bonus: {
        uniqueCharsRatio: 0.7,
        noRepeating: 1,
        noSequence: 1,
    },
};

const STRENGTH_RAW: Array<{ color: string; title: string }> = [
    {color: "#6b7280", title: "Очень слабый"},
    {color: "#ef4444", title: "Слабый"},
    {color: "#f97316", title: "Средний"},
    {color: "#3b82f6", title: "Надежный"},
    {color: "#00c950", title: "Очень надежный"},
];

export const STRENGTH_DETAILS: StatusDetails[] = STRENGTH_RAW.map(({color, title}) => ({
    color,
    backgroundColor: hexToRgba(color, 0.1),
    borderColor: hexToRgba(color, 0.2),
    title,
}));

