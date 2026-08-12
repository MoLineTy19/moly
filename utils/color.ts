import {TagColorScheme} from "@/types/components";

type RGB = { r: number; g: number; b: number };

/** h, s, l — все в диапазоне 0..1 */
function hslToRgb(h: number, s: number, l: number): RGB {
    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l; // ахроматический (серый)
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
}

/**
 * Разбирает любой CSS-цвет (#hex / rgb / rgba / hsl / hsla) в RGB.
 * Возвращает null, если цвет распознать не удалось.
 */
function parseColor(color: string): RGB | null {
    const c = (color ?? "").trim().toLowerCase();
    if (!c) return null;

    // #RGB или #RRGGBB
    if (c.startsWith("#")) {
        let h = c.slice(1);
        if (h.length === 3) h = h.split("").map((ch) => ch + ch).join("");
        if (h.length !== 6 || !/^[0-9a-f]{6}$/.test(h)) return null;
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
        };
    }

    // hsl(h, s%, l%) / hsla(...) — основная палитра DEFAULT_TAG_COLORS
    const hsl = c.match(/^hsla?\(\s*([0-9.]+)(?:deg)?\s*[ ,]\s*([0-9.]+)%\s*[ ,]\s*([0-9.]+)%/);
    if (hsl) {
        return hslToRgb(
            parseFloat(hsl[1]) / 360,
            parseFloat(hsl[2]) / 100,
            parseFloat(hsl[3]) / 100,
        );
    }

    // rgb(r, g, b) / rgba(...)
    const rgb = c.match(/^rgba?\(\s*([0-9.]+)\s*[ ,]\s*([0-9.]+)\s*[ ,]\s*([0-9.]+)/);
    if (rgb) {
        return {r: parseFloat(rgb[1]), g: parseFloat(rgb[2]), b: parseFloat(rgb[3])};
    }

    return null;
}

// Серый #6a7282 — фолбэк, если цвет не удалось распознать.
// Совпадает с токеном --text-muted; единый источник для всех потребителей.
export const FALLBACK_TAG_COLOR = '#6a7282';
const FALLBACK_RGB: RGB = {r: 106, g: 114, b: 130};

/** Преобразует любой CSS-цвет в rgba(...) с заданной прозрачностью */
function toRgba(color: string, alpha: number): string {
    const {r, g, b} = parseColor(color) ?? FALLBACK_RGB;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Генерирует цветовую схему на основе основного цвета.
 * Принимает hex / rgb / rgba / hsl / hsla (соответствует DEFAULT_TAG_COLORS).
 * @param baseColor - основной цвет
 * @returns объект с color, backgroundColor, borderColor
 */
export function generateTagColor(baseColor: string): TagColorScheme {
    return {
        color: baseColor,
        backgroundColor: toRgba(baseColor, 0.1),
        borderColor: toRgba(baseColor, 0.3),
    };
}
