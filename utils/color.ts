import {TagColorScheme} from "@/types/components";

/**
 * Преобразует hex цвет в формат rgba
 * @param hex - цвет в формате #RRGGBB или #RGB
 * @param alpha - прозрачность (0..1)
 */
function hexToRGB(hex: string, alpha: number): string {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


/**
 * Осветляет или затемняет hex цвет (опционально для рамки)
 * @param hex - исходный цвет
 * @param percent - процент изменения (-1..1, отрицательное → темнее)
 */
function adjustBrightness(hex: string, percent: number): string {
    hex = hex.replace("#", '')

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    r = Math.min(255, Math.max(0, r + r * percent));
    g = Math.min(255, Math.max(0, g + g * percent));
    b = Math.min(255, Math.max(0, b + b * percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}


/**
 * Генерирует цветовую схему на основе основного цвета
 * @param baseColor - основной цвет в hex (например, '#3b82f6')
 * @returns объект с color, backgroundColor, borderColor
 */
export function generateTagColor(baseColor: string): TagColorScheme {
    const backgroundColor = hexToRGB(baseColor, 0.1);
    const borderColor = hexToRGB(baseColor, 0.3);

    return {
        color: baseColor,
        backgroundColor,
        borderColor,
    }
}