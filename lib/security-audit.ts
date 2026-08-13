import {Password} from "@/types";

/**
 * Локальный аудит безопасности паролей — чистые функции без сети и без React.
 * Считается на клиенте из уже расшифрованных данных passwordStore.
 */

/** Порог «устаревший пароль»: запись не менялась дольше этого числа дней. */
export const STALE_THRESHOLD_DAYS = 180;
export const STALE_THRESHOLD_MS = STALE_THRESHOLD_DAYS * 86400000;

/** Порог «слабый пароль»: сила 0..2 из шкалы 0..4 (STRENGTH_DETAILS). */
export const WEAK_STRENGTH_THRESHOLD = 2;

export interface AuditResult {
    /** id записей со strengthScore <= WEAK_STRENGTH_THRESHOLD */
    weak: Set<number>;
    /** id записей, чей пароль встречается у двух и более записей */
    duplicates: Set<number>;
    /** id записей, не менявшихся дольше STALE_THRESHOLD_DAYS */
    stale: Set<number>;
    /** объединение трёх множеств выше — все проблемные записи */
    all: Set<number>;
}

export const EMPTY_AUDIT: AuditResult = {
    weak: new Set(),
    duplicates: new Set(),
    stale: new Set(),
    all: new Set(),
};

/** Записи со слабым паролем (strengthScore <= порога). */
export function findWeak(passwords: Password[]): Set<number> {
    const result = new Set<number>();
    for (const p of passwords) {
        if ((p.strengthScore ?? 0) <= WEAK_STRENGTH_THRESHOLD) result.add(p.id);
    }
    return result;
}

/**
 * Записи с повторно используемым паролем: то же значение password
 * встречается у двух и более записей. Возвращает id всех таких записей
 * (а не только «вторых экземпляров»).
 */
export function findDuplicates(passwords: Password[]): Set<number> {
    const groups = new Map<string, number[]>();
    for (const p of passwords) {
        if (!p.password) continue;
        const ids = groups.get(p.password);
        if (ids) ids.push(p.id);
        else groups.set(p.password, [p.id]);
    }
    const result = new Set<number>();
    for (const ids of groups.values()) {
        if (ids.length >= 2) ids.forEach((id) => result.add(id));
    }
    return result;
}

/** Записи, не менявшиеся дольше STALE_THRESHOLD_DAYS от точки отсчёта. */
export function findStale(passwords: Password[], now: number = Date.now()): Set<number> {
    const result = new Set<number>();
    for (const p of passwords) {
        // lastModified — миллисекунды (timestamp). null/NaN пропускаем.
        if (typeof p.lastModified !== "number" || !Number.isFinite(p.lastModified)) continue;
        if (now - p.lastModified > STALE_THRESHOLD_MS) result.add(p.id);
    }
    return result;
}

/**
 * Полный локальный аудит: слабые + дубликаты + устаревшие, плюс объединение.
 * Чистая функция — безопасно вызывать сколько угодно раз.
 */
export function auditLocal(passwords: Password[], now: number = Date.now()): AuditResult {
    const weak = findWeak(passwords);
    const duplicates = findDuplicates(passwords);
    const stale = findStale(passwords);
    const all = new Set<number>([...weak, ...duplicates, ...stale]);
    return {weak, duplicates, stale, all};
}

/** Сводка по количествам — для бейджа в UI. */
export function auditCounts(audit: AuditResult): { weak: number; duplicates: number; stale: number; total: number } {
    return {
        weak: audit.weak.size,
        duplicates: audit.duplicates.size,
        stale: audit.stale.size,
        total: audit.all.size,
    };
}
