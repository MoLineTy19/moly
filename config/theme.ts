/**
 * Пресеты оформления Moly.
 *
 * Каждый пресет задаёт пару «режим + акцент». Переключаются атрибутом
 * data-theme на <html>, которому в global.css сопоставлены наборы токенов.
 * Поле preview содержит «честные» цвета мини-превью на карточке выбора,
 * независимые от текущей активной темы.
 */

export type ThemeMode = "dark" | "light";

export interface ThemePreset {
    id: string;
    name: string;
    mode: ThemeMode;
    accent: string;
    preview: {
        bg: string;
        surface: string;
        text: string;
        muted: string;
    };
}

/** Пресет по умолчанию. */
export const DEFAULT_THEME = "midnight";

export const THEMES: ThemePreset[] = [
    {
        id: "midnight",
        name: "Полночь",
        mode: "dark",
        accent: "#00c950",
        preview: {bg: "#030712", surface: "#111827", text: "#ffffff", muted: "#6a7282"},
    },
    {
        id: "coal",
        name: "Уголь",
        mode: "dark",
        accent: "#3b82f6",
        preview: {bg: "#030712", surface: "#111827", text: "#ffffff", muted: "#6a7282"},
    },
    {
        id: "orchid",
        name: "Орхидея",
        mode: "dark",
        accent: "#a855f7",
        preview: {bg: "#030712", surface: "#111827", text: "#ffffff", muted: "#6a7282"},
    },
    {
        id: "ember",
        name: "Закат",
        mode: "dark",
        accent: "#f97316",
        preview: {bg: "#030712", surface: "#111827", text: "#ffffff", muted: "#6a7282"},
    },
    {
        id: "frost",
        name: "Иней",
        mode: "light",
        accent: "#2563eb",
        preview: {bg: "#ffffff", surface: "#f3f4f6", text: "#0f172a", muted: "#64748b"},
    },
    {
        id: "blossom",
        name: "Цветение",
        mode: "light",
        accent: "#db2777",
        preview: {bg: "#ffffff", surface: "#f3f4f6", text: "#0f172a", muted: "#64748b"},
    },
];

/** Найти пресет по id; если неизвестен, вернуть дефолт. */
export function getPreset(id: string | undefined | null): ThemePreset {
    return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/**
 * Применить пресет к документу: ставит data-theme и подсказывает браузеру
 * цветовую схему (влияет на нативные скроллбары и контролы форм).
 */
export function applyTheme(id: string | undefined | null): void {
    if (typeof document === "undefined") return;
    const preset = getPreset(id);
    const root = document.documentElement;
    root.setAttribute("data-theme", preset.id);
    root.style.colorScheme = preset.mode;
}
