import {ActivityEventType} from "@/types";

/**
 * Логирует событие в журнал активности.
 * Не блокирует UI и не валит флоу при ошибке сети.
 */
export function logActivity(type: ActivityEventType, message?: string) {
    if (typeof window === "undefined") return;
    try {
        fetch('/api/log', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({type, message}),
        }).catch(() => {});
    } catch {}
}