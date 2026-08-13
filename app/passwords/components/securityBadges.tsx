"use client";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faTriangleExclamation, faClone, faClockRotateLeft, faBug,
} from "@fortawesome/free-solid-svg-icons";
import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {useSecurityStore} from "@/store/securityStore";

/**
 * Бейджи проблем безопасности для записи пароля.
 *
 * Показываются, когда у записи есть хотя бы одна проблема из аудита:
 * слабый / дубликат / устаревший / в утечке. Читает данные из securityStore,
 * поэтому автоматически обновляется при пересчёте аудита.
 *
 * @param id          — id записи Password
 * @param compact     — компактный режим (только иконки): для таблицы и списка
 * @param showLabels  — показывать ли текст бейджа: для карточки/детальной
 */
export default function SecurityBadges({
    id,
    compact = true,
    showLabels = false,
    className = "",
}: {
    id: number;
    compact?: boolean;
    showLabels?: boolean;
    className?: string;
}) {
    const localAudit = useSecurityStore((s) => s.localAudit);
    const breaches = useSecurityStore((s) => s.breaches);

    const isWeak = localAudit?.weak.has(id) ?? false;
    const isDuplicate = localAudit?.duplicates.has(id) ?? false;
    const isStale = localAudit?.stale.has(id) ?? false;
    const breachCount = breaches?.get(id) ?? 0;

    if (!isWeak && !isDuplicate && !isStale && breachCount === 0) return null;

    // Каждый бейдж: иконка + опционально подпись + опционально число.
    const items: Array<{icon: IconDefinition; title: string; label: string; cls: string; count?: number}> = [];
    if (isWeak) items.push({
        icon: faTriangleExclamation,
        title: "Слабый пароль",
        label: "Слабый",
        cls: "text-red-400 bg-red-500/10 border-red-500/30",
    });
    if (isDuplicate) items.push({
        icon: faClone,
        title: "Пароль используется повторно (дубликат)",
        label: "Дубликат",
        cls: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    });
    if (isStale) items.push({
        icon: faClockRotateLeft,
        title: "Пароль давно не менялся",
        label: "Устарел",
        cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    });
    if (breachCount > 0) items.push({
        icon: faBug,
        title: `Встречался в утечках (${breachCount})`,
        label: "Утечка",
        cls: "text-red-500 bg-red-500/15 border-red-500/40",
        count: breachCount,
    });

    const sizeCls = compact
        ? "text-[10px] px-1.5 py-0.5 gap-1"
        : "text-xs px-2 py-1 gap-1.5";

    return (
        <div className={`flex items-center gap-1 flex-wrap ${className}`}>
            {items.map((it, i) => (
                <span
                    key={i}
                    title={it.title}
                    className={`inline-flex items-center rounded-md border ${sizeCls} ${it.cls}`}
                >
                    <FontAwesomeIcon icon={it.icon}/>
                    {showLabels && <span>{it.label}</span>}
                    {it.count !== undefined && (
                        <span className="font-mono">{it.count >= 10000 ? "10k+" : it.count}</span>
                    )}
                </span>
            ))}
        </div>
    );
}
