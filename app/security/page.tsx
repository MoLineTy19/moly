"use client"

import {useEffect, useState} from "react";
import type {ChangeEvent, FormEvent, MouseEventHandler} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown, faArrowRightToBracket, faArrowUp, faBorderAll, faCheck, faCircleInfo, faCodeBranch,
    faDesktop, faFileExport, faFileImport, faGears, faKey, faListUl, faPalette,
    faLock, faShieldHalved, faTableList, faClock, faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import {useConfigStore} from "@/store/configStore";
import {addPassword, usePasswordStore} from "@/store/passwordStore";
import {APP_VERSION, GITHUB_REPO} from "@/config/app";
import {THEMES} from "@/config/theme";
import Modal from "@/components/ui/modal";
import ConfirmDialog from "@/components/ui/confirmDialog";
import Toggle from "@/components/ui/toggle";
import {
    exportToJSON, exportToCSV, downloadFile, parseImport, strengthOf,
} from "@/lib/vault-io";
import type {ParsedEntry} from "@/lib/vault-io";
import {logActivity} from "@/lib/activity";
import type {ActivityEntry, ActivityEventType} from "@/types";

const ACTIVITY_META: Record<ActivityEventType, { icon: any; text: string }> = {
    unlock: {icon: faArrowRightToBracket, text: "Вход в систему"},
    manual_lock: {icon: faLock, text: "Ручная блокировка"},
    auto_lock: {icon: faClock, text: "Автоблокировка по таймауту"},
    tab_switch_lock: {icon: faWindowMinimize, text: "Блокировка при переключении вкладки"},
    change_master_password: {icon: faKey, text: "Смена мастер-пароля"},
    export: {icon: faFileExport, text: "Экспорт данных"},
    import: {icon: faFileImport, text: "Импорт данных"},
};

function formatActivityTime(raw: string): string {
    const d = new Date(raw.replace(" ", "T"));
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString("ru-RU", {day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"});
}

/**
 * Страница с настройками безопасности Moly.
 */
export default function Security() {
    const {
        currentView, setCurrentView,
        autoLockTimeOut, setAutoLockTimeOut,
        clipboardClearTimeout, setClipboardClearTimeout,
        lockOnTabSwitch, setOnTabSwitch,
        theme, setTheme,
    } = useConfigStore();

    const {masterKeyCreatedAt, passwords, lock, changeMasterPassword} = usePasswordStore();

    // Смена мастер-пароля
    const [changeOpen, setChangeOpen] = useState(false);
    const [cur, setCur] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changeErr, setChangeErr] = useState("");
    const [checking, setChecking] = useState(false);

    // Импорт
    const [importOpen, setImportOpen] = useState(false);
    const [importName, setImportName] = useState("");
    const [parsed, setParsed] = useState<ParsedEntry[] | null>(null);
    const [importErr, setImportErr] = useState("");
    const [importing, setImporting] = useState(false);

    // Журнал
    const [activity, setActivity] = useState<ActivityEntry[]>([]);
    const [journalAllOpen, setJournalAllOpen] = useState(false);
    const [allActivity, setAllActivity] = useState<ActivityEntry[]>([]);
    const [confirmClear, setConfirmClear] = useState(false);

    /* --------- Метрики защиты --------- */
    const ageDays = masterKeyCreatedAt
        ? Math.floor((Date.now() - masterKeyCreatedAt) / 86400000) : null;
    const avgStrength = passwords.length
        ? passwords.reduce((s, p) => s + (p.strengthScore || 0), 0) / passwords.length : 0;
    // Оценка защиты из 5 факторов: автоблокировка, очистка буфера, блокировка при
    // переключении вкладки, возраст мастер-пароля младше 90 дней, средняя сила паролей >= 3.
    const score = ([
        autoLockTimeOut > 0,
        clipboardClearTimeout > 0,
        lockOnTabSwitch,
        ageDays !== null && ageDays < 90,
        avgStrength >= 3,
    ].filter(Boolean).length);
    const protection = score >= 5
        ? {label: "Оптимальный", color: "text-(--accent-color)", bg: "bg-(--accent-color)/10"}
        : score >= 3
            ? {label: "Хороший", color: "text-sky-400", bg: "bg-sky-500/10"}
            : {label: "Требует внимания", color: "text-yellow-400", bg: "bg-yellow-500/10"};

    const strengthPreview = strengthOf(next);

    /* --------- Журнал --------- */
    const loadActivity = async () => {
        try {
            const res = await fetch("/api/activity?limit=8");
            if (res.ok) setActivity(await res.json());
        } catch {/* noop */}
    };
    useEffect(() => { loadActivity(); }, []);

    const openJournalAll = async () => {
        setJournalAllOpen(true);
        try {
            const res = await fetch("/api/activity?limit=200");
            if (res.ok) setAllActivity(await res.json());
        } catch {/* noop */}
    };

    const clearActivity = async () => {
        await fetch("/api/activity", {method: "DELETE"});
        setActivity([]); setAllActivity([]);
        toast.success("Журнал очищен");
    };

    /* --------- Обработчики --------- */
    const handleCheckUpdate: MouseEventHandler = async (e) => {
        e.preventDefault();
        if (checking) return;
        setChecking(true);
        try {
            const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
            if (res.status === 404) {
                toast("Релизов на GitHub пока нет", {icon: <FontAwesomeIcon icon={faCircleInfo} className="text-sky-400"/>});
                return;
            }
            if (!res.ok) throw new Error("GitHub API");
            const data = await res.json();
            const remote = String(data.tag_name ?? "").replace(/^v/, "");
            const local = APP_VERSION.replace(/^v/, "");
            if (!remote) {
                toast("Не удалось определить версию релиза", {icon: <FontAwesomeIcon icon={faCircleInfo} className="text-sky-400"/>});
            } else if (remote === local) {
                toast.success(`У вас последняя версия: v${local}`);
            } else {
                toast(`Доступна новая версия: v${remote} (у вас v${local})`, {icon: <FontAwesomeIcon icon={faArrowUp} className="text-(--accent-color)"/>});
            }
        } catch {
            toast.error("Не удалось проверить обновления");
        } finally {
            setChecking(false);
        }
    };

    const onSubmitChange = async (e: FormEvent) => {
        e.preventDefault();
        setChangeErr("");
        if (next.length < 8) { setChangeErr("Новый пароль: минимум 8 символов"); return; }
        if (next !== confirm) { setChangeErr("Пароли не совпадают"); return; }
        setSaving(true);
        const res = await changeMasterPassword(cur, next);
        setSaving(false);
        if (res.ok) {
            toast.success("Мастер-пароль изменён");
            setChangeOpen(false);
            setCur(""); setNext(""); setConfirm("");
        } else {
            setChangeErr(res.error ?? "Не удалось изменить пароль");
        }
    };

    const handleLockNow = () => lock("manual");

    const handleExport = (format: "json" | "csv") => {
        if (passwords.length === 0) { toast.error("Нет данных для экспорта"); return; }
        const stamp = new Date().toISOString().slice(0, 10);
        if (format === "json") {
            downloadFile(`moly-export-${stamp}.json`, exportToJSON(passwords), "application/json");
        } else {
            downloadFile(`moly-export-${stamp}.csv`, exportToCSV(passwords), "text/csv");
        }
        logActivity("export", format.toUpperCase());
        toast.success(`Экспортировано записей: ${passwords.length} (${format.toUpperCase()})`);
    };

    const onFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImportName(file.name);
        setImportErr("");
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const entries = parseImport(String(reader.result));
                setParsed(entries);
                if (entries.length === 0) setImportErr("В файле нет записей для импорта");
            } catch (err) {
                setParsed(null);
                setImportErr((err as Error).message);
            }
        };
        reader.readAsText(file);
    };

    const doImport = async () => {
        if (!parsed || parsed.length === 0) return;
        setImporting(true);
        // Считаем фактически добавленные записи по разнице счётчика в сторе,
        // а не по parsed.length: отдельные addPassword могут завершиться с ошибкой.
        const before = usePasswordStore.getState().passwordCount;
        for (const entry of parsed) {
            await addPassword({
                title: entry.title,
                login: entry.login,
                url: entry.url,
                password: entry.password,
                strengthScore: strengthOf(entry.password),
                tag: null,
                note: entry.note,
                favorite: false,
            });
        }
        const imported = Math.max(0, usePasswordStore.getState().passwordCount - before);
        setImporting(false);
        logActivity("import", `${imported} записей`);
        toast.success(`Импортировано записей: ${imported}`);
        setImportOpen(false);
        setParsed(null); setImportName(""); setImportErr("");
    };

    const switchDisplayView = (view: string) => setCurrentView(view);

    /* --------- JSX --------- */
    return (
        <div className="grow overflow-y-auto p-4 md:p-8 relative w-full">
            <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12">

                {/* Заголовок */}
                <div>
                    <h1 className="text-3xl font-bold text-(--text-color) mb-2">Центр безопасности</h1>
                    <p className="text-sm text-(--text-muted)">
                        Управление доступом, блокировками и защитой сейфа.
                    </p>
                </div>

                {/* Карточки статистики */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Статус защиты */}
                    <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl p-5 shadow-soft flex items-start gap-4 relative overflow-hidden">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${protection.bg} rounded-full blur-2xl`}/>
                        <div className={`w-10 h-10 rounded-lg bg-dark-800 border border-(--border-color) flex items-center justify-center shrink-0 ${protection.color}`}>
                            <FontAwesomeIcon icon={faShieldHalved}/>
                        </div>
                        <div>
                            <div className="text-xs text-(--text-muted) font-medium mb-1">Статус защиты</div>
                            <div className="text-lg font-semibold text-(--text-color)">{protection.label}</div>
                            <div className="text-xs text-(--text-muted) mt-1">Оценка: {score}/5</div>
                        </div>
                    </div>

                    {/* Возраст мастер-пароля */}
                    <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl p-5 shadow-soft flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 border border-(--border-color) flex items-center justify-center shrink-0 text-(--text-secondary)">
                            <FontAwesomeIcon icon={faKey}/>
                        </div>
                        <div>
                            <div className="text-xs text-(--text-muted) font-medium mb-1">Мастер-пароль</div>
                            <div className="text-lg font-semibold text-(--text-color)">
                                {ageDays === null ? "нет данных" : `${ageDays} дн. назад`}
                            </div>
                            <div className={`text-xs mt-1 ${ageDays !== null && ageDays >= 90 ? "text-yellow-400" : "text-(--text-muted)"}`}>
                                {ageDays !== null && ageDays >= 90 ? "Пора сменить" : "Рекомендация: раз в 90 дней"}
                            </div>
                        </div>
                    </div>

                    {/* Версия */}
                    <div className="bg-(--background-secondary) border border-(--border-color) rounded-xl p-5 shadow-soft flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 border border-(--border-color) flex items-center justify-center shrink-0" style={{color: "var(--accent-color)"}}>
                            <FontAwesomeIcon icon={faCodeBranch}/>
                        </div>
                        <div>
                            <div className="text-xs text-(--text-muted) font-medium mb-1">Версия</div>
                            <p className="text-sm text-(--text-muted) mb-2">Moly v{APP_VERSION}</p>
                            <button
                                className="px-4 py-2 bg-(--accent-color)/90 hover:bg-(--accent-color) border border-(--accent-color) text-(--text-color) rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleCheckUpdate}
                                disabled={checking}
                            >
                                <FontAwesomeIcon icon={faDesktop} className="mr-1.5"/>
                                {checking ? "Проверка…" : "Проверить версию"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Основная сетка */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Левая колонка */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Оформление */}
                        <section className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft overflow-hidden">
                            <div className="px-6 py-4 border-b border-(--border-color)">
                                <h2 className="text-lg font-medium text-(--text-color) flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPalette}/>
                                    Оформление
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="max-w-md mb-4">
                                    <h3 className="text-sm font-medium text-(--text-color) mb-1">Тема приложения</h3>
                                    <p className="text-xs text-(--text-muted)">
                                        Готовые пресеты: фон, текст и акцент. Применяется ко всему приложению сразу.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {THEMES.map((p) => {
                                        const active = theme === p.id;
                                        return (
                                            <button
                                                key={p.id}
                                                onClick={() => setTheme(p.id)}
                                                className={`relative text-left rounded-lg border p-2 transition-colors ${active ? "border-(--accent-color)" : "border-(--border-color) hover:border-(--border-input-color)"}`}
                                                aria-pressed={active}
                                            >
                                                {/* Мини-превью с честными цветами пресета */}
                                                <div className="rounded-md p-2 h-16 flex flex-col justify-between overflow-hidden" style={{background: p.preview.bg}}>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background: p.accent}}/>
                                                        <span className="h-1.5 rounded-full" style={{background: p.preview.text, width: 28}}/>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 rounded px-1.5 py-1" style={{background: p.preview.surface}}>
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{background: p.accent}}/>
                                                        <span className="h-1 rounded-full" style={{background: p.preview.muted, width: 22}}/>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-xs font-medium text-(--text-color)">{p.name}</span>
                                                    {active && (
                                                        <span className="text-(--accent-color) text-xs">
                                                            <FontAwesomeIcon icon={faCheck}/>
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* Общие настройки */}
                        <section className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft overflow-hidden">
                            <div className="px-6 py-4 border-b border-(--border-color)">
                                <h2 className="text-lg font-medium text-(--text-color) flex items-center gap-2">
                                    <FontAwesomeIcon icon={faGears}/>
                                    Общие настройки
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="max-w-md">
                                        <h3 className="text-sm font-medium text-(--text-color) mb-1">Отображение по умолчанию</h3>
                                        <p className="text-xs text-(--text-muted)">
                                            Как показывать список паролей при входе: таблицей, доской или списком.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {([
                                            {v: "table", icon: faTableList, label: "Таблица"},
                                            {v: "board", icon: faBorderAll, label: "Доска"},
                                            {v: "list", icon: faListUl, label: "Список"},
                                        ] as const).map((opt) => (
                                            <button
                                                key={opt.v}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-(--text-color) text-sm shadow-sm hover:bg-(--hover-overlay) border transition-colors ${currentView === opt.v ? "bg-(--hover-overlay) border-(--border-input-color)" : "border-transparent"}`}
                                                onClick={() => switchDisplayView(opt.v)}
                                            >
                                                <FontAwesomeIcon icon={opt.icon}/>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Авторизация и доступ */}
                        <section className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft overflow-hidden">
                            <div className="px-6 py-4 border-b border-(--border-color)">
                                <h2 className="text-lg font-medium text-(--text-color) flex items-center gap-2">
                                    <FontAwesomeIcon icon={faLock}/>
                                    Авторизация и доступ
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                {/* Смена мастер-пароля */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-(--border-color)">
                                    <div className="max-w-md">
                                        <h3 className="text-sm font-medium text-(--text-color) mb-1">Мастер-пароль</h3>
                                        <p className="text-xs text-(--text-muted)">
                                            Мастер-пароль от сейфа. Все записи будут перешифрованы новым ключом.
                                        </p>
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-(--hover-overlay) hover:bg-dark-700 border border-(--border-input-color) text-(--text-color) rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                                        onClick={() => setChangeOpen(true)}
                                    >
                                        Сменить пароль
                                    </button>
                                </div>
                                {/* Ручная блокировка */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="max-w-md">
                                        <h3 className="text-sm font-medium text-(--text-color) mb-1">Ручная блокировка</h3>
                                        <p className="text-xs text-(--text-muted)">
                                            Немедленно закрыть сейф и запросить мастер-пароль.
                                        </p>
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-(--hover-overlay) hover:bg-dark-700 border border-(--border-input-color) text-(--text-color) rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                                        onClick={handleLockNow}
                                    >
                                        <FontAwesomeIcon icon={faLock} className="mr-1.5"/>
                                        Заблокировать сейчас
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Правая колонка */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Политики безопасности */}
                        <section className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft overflow-hidden">
                            <div className="px-5 py-4 border-b border-(--border-color)">
                                <h2 className="text-sm font-medium text-(--text-color) uppercase tracking-wider">Политики безопасности</h2>
                            </div>
                            <div className="p-5 flex flex-col gap-5">
                                {/* Автоблокировка */}
                                <div>
                                    <label className="block text-sm font-medium text-(--text-color) mb-2">Автоблокировка сейфа</label>
                                    <p className="text-xs text-(--text-muted) mb-3">Время неактивности до запроса мастер-пароля.</p>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2.5 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors appearance-none cursor-pointer"
                                            value={autoLockTimeOut}
                                            onChange={(e) => setAutoLockTimeOut(Number(e.target.value))}
                                        >
                                            <option value={1}>1 минута</option>
                                            <option value={5}>5 минут</option>
                                            <option value={15}>15 минут</option>
                                            <option value={30}>30 минут</option>
                                            <option value={60}>1 час</option>
                                            <option value={0}>Никогда (не рекомендуется)</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none">
                                            <FontAwesomeIcon icon={faAngleDown}/>
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-(--border-color)"/>
                                {/* Очистка буфера */}
                                <div>
                                    <label className="block text-sm font-medium text-(--text-color) mb-2">Очистка буфера обмена</label>
                                    <p className="text-xs text-(--text-muted) mb-3">Автоматическое удаление скопированных паролей.</p>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2.5 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors appearance-none cursor-pointer"
                                            value={clipboardClearTimeout}
                                            onChange={(e) => setClipboardClearTimeout(Number(e.target.value))}
                                        >
                                            <option value={10}>10 секунд</option>
                                            <option value={30}>30 секунд</option>
                                            <option value={60}>60 секунд</option>
                                            <option value={0}>Никогда</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none">
                                            <FontAwesomeIcon icon={faAngleDown}/>
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-(--border-color)"/>
                                {/* Блокировка при сворачивании */}
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-(--text-color) mb-1">Блокировка при сворачивании</h3>
                                        <p className="text-xs text-(--text-muted)">Блокировать сейф при переключении вкладок</p>
                                    </div>
                                    <Toggle checked={lockOnTabSwitch} onChange={setOnTabSwitch}/>
                                </div>
                            </div>
                        </section>

                        {/* Данные сейфа */}
                        <section className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft overflow-hidden">
                            <div className="px-5 py-4 border-b border-(--border-color)">
                                <h2 className="text-sm font-medium text-(--text-color) uppercase tracking-wider">Данные сейфа</h2>
                            </div>
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-3 text-sm text-(--text-secondary)">
                                        <FontAwesomeIcon icon={faFileExport}/> Экспорт
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleExport("json")} className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 border border-(--border-input-color) text-(--text-secondary) text-xs font-medium transition-colors">JSON</button>
                                        <button onClick={() => handleExport("csv")} className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 border border-(--border-input-color) text-(--text-secondary) text-xs font-medium transition-colors">CSV</button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-3 text-sm text-(--text-secondary)">
                                        <FontAwesomeIcon icon={faFileImport}/> Импорт
                                    </span>
                                    <button onClick={() => setImportOpen(true)} className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 border border-(--border-input-color) text-(--text-secondary) text-xs font-medium transition-colors">Выбрать файл</button>
                                </div>
                                <p className="text-[11px] text-(--text-muted) leading-relaxed pt-1">
                                    JSON-экспорт содержит пароли в открытом виде и ключи восстановления. Храните файл надёжно: ключи позволяют восстановить доступ к сейфу при потере данных браузера.
                                </p>
                            </div>
                        </section>

                        {/* Журнал активности */}
                        <section className="bg-(--background-secondary) border border-(--border-color) rounded-xl shadow-soft overflow-hidden flex flex-col">
                            <div className="px-5 py-4 border-b border-(--border-color) flex justify-between items-center">
                                <h2 className="text-sm font-medium text-(--text-color) uppercase tracking-wider">Журнал активности</h2>
                                <div className="flex gap-3">
                                    <button onClick={openJournalAll} className="text-xs text-(--accent-color) hover:text-(--accent-color) transition-colors">Смотреть все</button>
                                    <button onClick={() => setConfirmClear(true)} className="text-xs text-(--text-muted) hover:text-(--text-color) transition-colors">Очистить</button>
                                </div>
                            </div>
                            <div className="divide-y divide-(--border-color)/50">
                                {activity.length === 0 ? (
                                    <div className="px-5 py-6 text-center text-sm text-(--text-muted)">Событий пока нет</div>
                                ) : activity.map((a) => {
                                    const meta = ACTIVITY_META[a.type] ?? {icon: faGears, text: a.type};
                                    return (
                                        <div key={a.id} className="px-5 py-3 flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-(--accent-color)/10 text-(--accent-color) flex items-center justify-center shrink-0 mt-0.5">
                                                <FontAwesomeIcon icon={meta.icon}/>
                                            </div>
                                            <div>
                                                <div className="text-sm text-(--text-secondary)">{meta.text}{a.message ? ` · ${a.message}` : ""}</div>
                                                <div className="text-xs text-(--text-muted) mt-0.5">{formatActivityTime(a.createdAt)}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Модалка: смена мастер-пароля */}
                <Modal open={changeOpen} onClose={() => setChangeOpen(false)} title="Смена мастер-пароля" maxWidth="max-w-md">
                    <form onSubmit={onSubmitChange} className="flex flex-col gap-4">
                        <p className="text-xs text-(--text-muted)">
                            Все записи будут перешифрованы новым ключом. Новый пароль восстановить невозможно, поэтому запомните его.
                        </p>
                        {([
                            {key: "cur", label: "Текущий пароль", val: cur, set: setCur},
                            {key: "next", label: "Новый пароль", val: next, set: setNext},
                            {key: "confirm", label: "Новый пароль ещё раз", val: confirm, set: setConfirm},
                        ] as const).map((f) => (
                            <div key={f.key}>
                                <label className="block text-sm font-medium text-(--text-color) mb-2">{f.label}</label>
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={f.val}
                                    onChange={(e) => f.set(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-(--background-color) border border-(--border-input-color) rounded-lg text-sm text-(--text-color) focus:outline-none focus:border-(--accent-color) transition-colors"
                                />
                            </div>
                        ))}
                        {next.length > 0 && (
                            <div className="flex gap-1 h-1 rounded-full overflow-hidden bg-dark-800">
                                {[1, 2, 3, 4].map((lvl) => (
                                    <div key={lvl} className={`w-1/4 ${lvl <= strengthPreview ? "bg-(--accent-color)" : "bg-(--surface-inactive)"}`}/>
                                ))}
                            </div>
                        )}
                        <button type="button" onClick={() => setShowPw((s) => !s)} className="text-xs text-(--accent-color) hover:text-(--accent-color) transition-colors self-start">
                            {showPw ? "Скрыть пароли" : "Показать пароли"}
                        </button>
                        {changeErr && <p className="text-xs text-red-400">{changeErr}</p>}
                        <div className="flex gap-2 justify-end pt-2">
                            <button type="button" onClick={() => setChangeOpen(false)} className="px-4 py-2 rounded-lg bg-(--hover-overlay) hover:bg-dark-700 border border-(--border-input-color) text-(--text-color) text-sm font-medium transition-colors">Отмена</button>
                            <button type="submit" disabled={saving || !cur || !next || !confirm} className="px-4 py-2 rounded-lg bg-(--accent-color)/90 hover:bg-(--accent-color) border border-(--accent-color) text-(--text-color) text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? "…" : "Сменить пароль"}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Модалка: импорт */}
                <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Импорт данных" maxWidth="max-w-md">
                    <div className="flex flex-col gap-4">
                        <p className="text-xs text-(--text-muted)">
                            Поддерживаются JSON (выгрузка Moly) и CSV (title, login, url, password, note). Записи шифруются вашим ключом перед сохранением.
                        </p>
                        <input
                            type="file"
                            accept=".json,.csv,application/json,text/csv"
                            onChange={onFile}
                            className="text-sm text-(--text-muted) file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-(--accent-color)/90 file:text-(--text-color) file:font-medium file:cursor-pointer file:hover:bg-(--accent-color) cursor-pointer"
                        />
                        {importName && <div className="text-xs text-(--text-secondary)">Файл: {importName}</div>}
                        {parsed && parsed.length > 0 && <div className="text-xs text-(--accent-color)">Найдено записей: {parsed.length}</div>}
                        {importErr && <p className="text-xs text-red-400">{importErr}</p>}
                        <div className="flex gap-2 justify-end pt-2">
                            <button type="button" onClick={() => setImportOpen(false)} className="px-4 py-2 rounded-lg bg-(--hover-overlay) hover:bg-dark-700 border border-(--border-input-color) text-(--text-color) text-sm font-medium transition-colors">Отмена</button>
                            <button type="button" onClick={doImport} disabled={!parsed || parsed.length === 0 || importing} className="px-4 py-2 rounded-lg bg-(--accent-color)/90 hover:bg-(--accent-color) border border-(--accent-color) text-(--text-color) text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {importing ? "Импорт…" : "Импортировать"}
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Модалка: весь журнал */}
                <Modal open={journalAllOpen} onClose={() => setJournalAllOpen(false)} title="Журнал активности" maxWidth="max-w-2xl">
                    {allActivity.length === 0 ? (
                        <div className="text-center text-sm text-(--text-muted) py-6">Событий пока нет</div>
                    ) : (
                        <div className="flex flex-col divide-y divide-(--border-color)/50">
                            {allActivity.map((a) => {
                                const meta = ACTIVITY_META[a.type] ?? {icon: faGears, text: a.type};
                                return (
                                    <div key={a.id} className="py-3 flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-(--accent-color)/10 text-(--accent-color) flex items-center justify-center shrink-0 mt-0.5">
                                            <FontAwesomeIcon icon={meta.icon}/>
                                        </div>
                                        <div>
                                            <div className="text-sm text-(--text-secondary)">{meta.text}{a.message ? ` · ${a.message}` : ""}</div>
                                            <div className="text-xs text-(--text-muted) mt-0.5">{formatActivityTime(a.createdAt)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Modal>

                <ConfirmDialog open={confirmClear} title="Очистить журнал?" danger
                               message="Все записи журнала активности будут удалены безвозвратно."
                               confirmLabel="Очистить"
                               onConfirm={async () => { await clearActivity(); setConfirmClear(false); }}
                               onCancel={() => setConfirmClear(false)}/>
            </div>
        </div>
    );
}