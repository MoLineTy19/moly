import {Password} from "@/types";

/**
 * Проверка паролей на утечки через Have I Been Pwned range-API.
 *
 * Zero-knowledge: наружу уходит только первые 5 символов SHA-1 хэша.
 * Суффикс (остальные 35 символов) и сам пароль никогда не покидают клиент.
 * См. https://haveibeenpwned.com/API/v3#PwnedPasswords
 */

const HIBP_RANGE_ENDPOINT = "https://api.pwnedpasswords.com/range/";

/** HEX SHA-1 от строки, верхний регистр. */
async function sha1HexUpper(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-1", data);
    // digest → Array of bytes → hex
    const bytes = new Uint8Array(digest);
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
    }
    return hex.toUpperCase();
}

/**
 * Сколько раз пароль встречался в утечках. 0 = не найден.
 * Кидает Error при ошибке сети/парсинга — вызывающий решает, что показать.
 *
 * Заголовок Add-Padding: true — рекомендация HIBP для повышения точности
 * (добавляет ложные записи в ответ, чтобы скрыть факт реального совпадения
 * от пассивного наблюдателя трафика).
 */
export async function checkPasswordBreach(password: string): Promise<number> {
    const hash = await sha1HexUpper(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const res = await fetch(HIBP_RANGE_ENDPOINT + prefix, {
        headers: {"Add-Padding": "true"},
    });
    if (!res.ok) {
        throw new Error(`HIBP ${res.status}`);
    }
    const text = await res.text();

    // Ответ: строки вида "SUFFIX:COUNT", разделённые \r\n или \n.
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const lineSuffix = line.slice(0, idx).toUpperCase();
        if (lineSuffix === suffix) {
            const count = parseInt(line.slice(idx + 1), 10);
            return Number.isFinite(count) ? count : 1;
        }
    }
    return 0;
}

export interface BreachProgress {
    /** Сколько уникальных паролей уже проверено. */
    done: number;
    /** Всего уникальных паролей к проверке. */
    total: number;
}

/**
 * Проверяет записи на утечки.
 *
 * Дедуп по значению пароля: если 5 записей используют одинаковый пароль,
 * HIBP-запрос делается один раз, результат применяется ко всем пяти.
 * Возвращает Map<passwordId, breachCount> — только записи с breachCount > 0.
 *
 * onProgress вызывается после каждой проверки уникального пароля.
 * Сериальный цикл (без Promise.all) — чтобы не-ddos'ить сервис и иметь
 * корректный прогресс.
 */
export async function checkBreaches(
    passwords: Password[],
    onProgress?: (p: BreachProgress) => void,
): Promise<Map<number, number>> {
    // Группируем id записей по значению пароля (только непустые).
    const groups = new Map<string, number[]>();
    for (const p of passwords) {
        if (!p.password) continue;
        const ids = groups.get(p.password);
        if (ids) ids.push(p.id);
        else groups.set(p.password, [p.id]);
    }

    const uniquePasswords = [...groups.keys()];
    const total = uniquePasswords.length;
    let done = 0;

    const breached = new Map<number, number>();

    for (const pwd of uniquePasswords) {
        const count = await checkPasswordBreach(pwd);
        done++;
        if (count > 0) {
            // Применяем результат ко всем записям с этим паролем.
            for (const id of groups.get(pwd)!) {
                breached.set(id, count);
            }
        }
        if (onProgress) onProgress({done, total});
    }

    return breached;
}
