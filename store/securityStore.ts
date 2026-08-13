import {create} from "zustand";
import {Password} from "@/types";
import {auditLocal, AuditResult, EMPTY_AUDIT} from "@/lib/security-audit";
import {checkBreaches, BreachProgress} from "@/lib/hibp";
import {usePasswordStore} from "@/store/passwordStore";

/**
 * Стор результатов проверки безопасности паролей.
 *
 * Локальный аудит (слабые/дубликаты/устаревшие) пересчитывается мгновенно и
 * синхронно, вызывается при загрузке /passwords и после любого CRUD-действия.
 *
 * Проверка утечек (HIBP) — сетевая, запускается явно по кнопке пользователя.
 * Результаты сессионные: при блокировке сейфа всё стирается (данные являются
 * производными от расшифрованных паролей и не должны переживать блокировку).
 *
 * Зависимость направлена securityStore → passwordStore. Обратный вызов
 * (passwordStore дёргает securityStore при CRUD/lock) идёт через ленивый
 * require, чтобы не создать циклический импорт на этапе загрузки модулей.
 */

export type BreachStatus = "idle" | "checking" | "done" | "error";

export interface SecurityStore {
    /** Результат локального аудита; null = аудит ещё не запускался. */
    localAudit: AuditResult | null;
    /** id записи → сколько раз пароль встречался в утечках. null = не проверяли. */
    breaches: Map<number, number> | null;
    breachStatus: BreachStatus;
    breachProgress: BreachProgress | null;
    /** Сообщение последней ошибки проверки утечек, если была. */
    breachError: string | null;

    /** Пересчитать локальный аудит из текущих passwords passwordStore. */
    runLocalAudit: () => AuditResult;
    /** Запустить сетевую проверку утечек. Бросает исключение при ошибке сети. */
    runBreachCheck: (onToast?: (msg: string, ok: boolean) => void) => Promise<void>;
    /** Есть ли у записи хоть одна проблема (любой тип). */
    isProblematic: (id: number) => boolean;
    /** Стереть все результаты — вызывается при блокировке сейфа. */
    clear: () => void;
}

export const useSecurityStore = create<SecurityStore>((set, get) => ({
    localAudit: null,
    breaches: null,
    breachStatus: "idle",
    breachProgress: null,
    breachError: null,

    runLocalAudit: () => {
        const passwords: Password[] = usePasswordStore.getState().passwords;
        const result = passwords.length ? auditLocal(passwords) : EMPTY_AUDIT;
        set({localAudit: result});
        return result;
    },

    runBreachCheck: async () => {
        // Защита от повторного запуска: если проверка уже идёт — игнорируем.
        if (get().breachStatus === "checking") return;

        const passwords: Password[] = usePasswordStore.getState().passwords;
        if (!passwords.length) return;

        set({
            breachStatus: "checking",
            breachProgress: {done: 0, total: new Set(passwords.map((p) => p.password)).size},
            breachError: null,
        });

        try {
            const breached = await checkBreaches(passwords, (p) => {
                set({breachProgress: p});
            });
            set({
                breaches: breached,
                breachStatus: "done",
            });
        } catch (err) {
            set({
                breachStatus: "error",
                breachError: (err as Error).message ?? "Ошибка проверки",
            });
            throw err;
        }
    },

    isProblematic: (id) => {
        const {localAudit, breaches} = get();
        if (localAudit?.all.has(id)) return true;
        if (breaches?.has(id)) return true;
        return false;
    },

    clear: () => set({
        localAudit: null,
        breaches: null,
        breachStatus: "idle",
        breachProgress: null,
        breachError: null,
    }),
}));

/**
 * Хелперы для вызова из passwordStore без прямой ссылки на модуль
 * (поэтому ленивый импорт внутри функций, не на верхнем уровне).
 */
export function invalidateLocalAudit() {
    useSecurityStore.getState().runLocalAudit();
}

export function clearSecurityAudit() {
    useSecurityStore.getState().clear();
}
