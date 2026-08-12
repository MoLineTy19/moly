let activeTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Скопировать текст в буфер и автоматически очистить через timeoutSeconds.
 * timeoutSeconds === 0 - без автоочистки.
 */
export async function copyWithAutoClear(text: string, timeoutSeconds: number): Promise<void> {
    await navigator.clipboard.writeText(text);

    if (activeTimer) clearTimeout(activeTimer);
    if (timeoutSeconds <= 0) return;

    activeTimer = setTimeout(async () => {
        try {
            // Читаем текущее содержимое; если оно всё ещё наше, чистим
            const current = await navigator.clipboard.readText();
            if (current === text) {
                await navigator.clipboard.writeText("");
            }
        } catch {
            // readText может бросить (например, в не-Secure контексте): просто пишем пустоту
            try { await navigator.clipboard.writeText(""); } catch {}
        }
        activeTimer = null;
    }, timeoutSeconds * 1000);
}
