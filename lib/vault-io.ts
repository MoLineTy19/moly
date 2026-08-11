import {Password} from "@/types";

const EXPORT_VERSION = 1;

export interface VaultExportItem {
    title: string;
    login: string;
    url: string;
    password: string;
    note: string;
    tag: string | null;
    strengthScore: number;
}

export interface VaultExport {
    app: 'moly';
    version: number;
    exportedAt: string;
    items: VaultExportItem[];
}

export interface ParsedEntry {
    title: string;
    login: string;
    url: string;
    password: string;
    note: string;
}

/* ---------------------- Экспорт ---------------------- */

export function buildExport(passwords: Password[]): VaultExport {
    return {
        app: 'moly',
        version: EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        items: passwords.map((p) => ({
            title: p.title,
            login: p.login,
            url: p.url,
            password: p.password,
            note: p.note ?? '',
            tag: p.tag?.title ?? null,
            strengthScore: p.strengthScore,
        })),
    };
}

export function exportToJSON(passwords: Password[]): string {
    return JSON.stringify(buildExport(passwords), null, 2);
}

/** CSV с экранированием по RFC 4180. */
export function exportToCSV(passwords: Password[]): string {
    const header = ['title', 'login', 'url', 'password', 'note', 'tag'];
    const escape = (v: string) => {
        const s = v ?? '';
        return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const rows = passwords.map((p) => [
        escape(p.title),
        escape(p.login),
        escape(p.url),
        escape(p.password),
        escape(p.note ?? ''),
        escape(p.tag?.title ?? ''),
    ].join(','));
    return [header.join(','), ...rows].join('\r\n');
}

/** Скачивание файла в браузере. */
export function downloadFile(filename: string, content: string, mime: string) {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* ---------------------- Импорт ---------------------- */

/**
 * Распарсить импортируемый файл.
 * Принимает: JSON в формате Moly (объект с items или массив) либо CSV
 * (с заголовком title/login/url/password/note; поддерживает синонимы
 * name/username/user/uri/website/notes/secret как в выгрузках Bitwarden/Chrome).
 */
export function parseImport(text: string): ParsedEntry[] {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Файл пустой');

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        let data: any;
        try {
            data = JSON.parse(trimmed);
        } catch {
            throw new Error('Некорректный JSON');
        }
        const items = Array.isArray(data) ? data : data.items;
        if (!Array.isArray(items)) throw new Error('В JSON нет массива items');
        return items.map(normalizeEntry).filter((e): e is ParsedEntry => e !== null);
    }

    return parseCSV(trimmed).map(normalizeEntry).filter((e): e is ParsedEntry => e !== null);
}

function normalizeEntry(raw: any): ParsedEntry | null {
    if (!raw || typeof raw !== 'object') return null;
    const title = String(raw.title ?? raw.name ?? '').trim();
    const password = String(raw.password ?? raw.secret ?? '').trim();
    if (!title && !password) return null;     // минимум — заголовок или пароль
    return {
        title: title || 'Без названия',
        login: String(raw.login ?? raw.username ?? raw.user ?? '').trim(),
        url: String(raw.url ?? raw.website ?? raw.uri ?? '').trim(),
        password,
        note: String(raw.note ?? raw.notes ?? '').trim(),
    };
}

/** Простой CSV-парсер с поддержкой кавычек и запятых внутри полей. */
function parseCSV(text: string): Record<string, string>[] {
    const rows: string[][] = [];
    let field = '';
    let row: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else {
                field += c;
            }
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === ',') {
            row.push(field); field = '';
        } else if (c === '\n') {
            row.push(field); rows.push(row); row = []; field = '';
        } else if (c !== '\r') {
            field += c;
        }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    if (rows.length === 0) return [];

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    return rows.slice(1).map((cells) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => { obj[h] = (cells[idx] ?? '').trim(); });
        return obj;
    });
}

/* ---------------------- Прочее ---------------------- */

/** Грубая оценка силы пароля 0..4. */
export function strengthOf(pwd: string): number {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (pwd.length >= 12) s++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd) || /[^a-zA-Z0-9]/.test(pwd)) s++;
    return Math.min(s, 4);
}