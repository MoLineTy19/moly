export interface HighlightSegment {
    text: string;
    match: boolean;
}

/** Экранирует спецсимволы для безопасного использования в RegExp. */
function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Разбивает строку на сегменты, помечая совпадения с запросом.
 * Регистронезависимо. Пустой запрос -> один сегмент без подсветки.
 */
export function splitHighlight(text: string, query: string): HighlightSegment[] {
    const q = query.trim();
    if (!q || !text) return [{text, match: false}];

    const escaped = escapeRegExp(q);
    const re = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(re).filter((part) => part !== "");

    return parts.map((part) => ({
        text: part,
        match: part.toLowerCase() === q.toLowerCase(),
    }));
}