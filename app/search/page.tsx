"use client"

import {usePasswordStore} from "@/store/passwordStore";
import {useTagStore} from "@/store/tagStore";
import {useMemo, useState} from "react";
import {faAngleDown, faGlobe, faMagnifyingGlass, faNoteSticky, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {STRENGTH_DETAILS} from "@/config";
import {FALLBACK_TAG_COLOR, generateTagColor} from "@/utils/color";
import {Password} from "@/types";
import Link from "next/link";
import Highlight from "@/components/ui/Highlight";
import {faUser} from "@fortawesome/free-regular-svg-icons";

// Русская плюрализация: форма зависит от двух последних цифр (запись / записи / записей).
function pluralRu(n: number, one: string, few: string, many: string): string {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
}

/**
 * Возвращает обрезанный сниппет заметки вокруг первого совпадения с запросом,
 * либо null, если совпадения / заметки / запроса нет.
 */
function noteSnippet(note: string, query: string, radius = 60): string | null {
    const q = query.trim();
    if (!q || !note) return null;
    const idx = note.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return null;

    const start = Math.max(0, idx - radius);
    const end = Math.min(note.length, idx + q.length + radius);
    let snippet = note.slice(start, end);
    if (start > 0) snippet = "…" + snippet;
    if (end < note.length) snippet = snippet + "…";
    return snippet;
}


/**
 * Страница поиска и фильтров по паролям
 */
export default function SearchPage() {
    const passwords = usePasswordStore((state) => state.passwords);
    const passwordCount = usePasswordStore((state) => state.passwordCount);
    const allTags = useTagStore((state) => state.tags);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterTag, setFilterTag] = useState<number | null>(null);
    const [filterStrength, setFilterStrength] = useState<number | null>(null);

    const q = searchQuery.trim().toLowerCase();

    const filteredPasswords = useMemo(() => {
        return passwords.filter(p => {
            if (q) {
                const hay =
                    `${p.title ?? ""} ${p.login ?? ""} ${p.url ?? ""} ${p.note ?? ""}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            if (filterTag !== null && p.tag?.id !== filterTag) return false;
            if (filterStrength !== null && p.strengthScore !== filterStrength) return false;
            return true;
        });
    }, [passwords, q, filterTag, filterStrength]);

    const hasActiveFilters = q !== "" || filterTag !== null || filterStrength !== null;
    const resetFilters = () => {
        setSearchQuery("");
        setFilterTag(null);
        setFilterStrength(null);
    };

    const hasPasswords = passwords.length > 0;
    const shownCount = filteredPasswords.length;

    return (
        <div className="grow overflow-y-auto p-8">
            {/* Хедер */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-(--text-color) flex items-center gap-3 mb-2">
                    Поиск
                    <span className="text-sm font-normal bg-(--background-secondary) text-(--text-muted) py-0.5 px-2.5 rounded-md border border-(--border-input-color)">
                        {passwordCount}
                    </span>
                </h1>
                <p className="text-sm text-(--text-muted)">
                    Поиск по названиям, логинам, сайтам и заметкам.
                </p>
            </div>

            {/* Поисковая строка */}
            <div className="relative mb-4 max-w-2xl">
                <FontAwesomeIcon icon={faMagnifyingGlass}
                                 className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted) text-base"/>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    placeholder="Поиск..."
                    className="w-full pl-11 pr-10 py-3 bg-(--background-secondary) border border-(--border-input-color) rounded-lg text-base text-(--text-color) focus:outline-none focus:border-(--accent-color) placeholder-(--text-muted) transition-colors"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-color) transition-colors"
                        aria-label="Очистить"
                    >
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                )}
            </div>

            {/* Тулбар фильтров */}
            <div className="flex items-center gap-3 flex-wrap mb-6 max-w-2xl">
                <div className="relative">
                    <select
                        value={filterTag ?? ""}
                        onChange={(e) => setFilterTag(e.target.value === "" ? null : Number(e.target.value))}
                        className="appearance-none pl-3 pr-9 py-2 rounded-lg bg-(--background-secondary) border border-(--border-input-color) text-(--text-muted) hover:text-(--text-color) text-sm transition-colors cursor-pointer focus:outline-none focus:border-(--accent-color)"
                    >
                        <option value="">Все теги</option>
                        {allTags.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                    <FontAwesomeIcon icon={faAngleDown}
                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none text-xs"/>
                </div>

                <div className="relative">
                    <select
                        value={filterStrength ?? ""}
                        onChange={(e) => setFilterStrength(e.target.value === "" ? null : Number(e.target.value))}
                        className="appearance-none pl-3 pr-9 py-2 rounded-lg bg-(--background-secondary) border border-(--border-input-color) text-(--text-muted) hover:text-(--text-color) text-sm transition-colors cursor-pointer focus:outline-none focus:border-(--accent-color)"
                    >
                        <option value="">Любая надёжность</option>
                        {STRENGTH_DETAILS.map((s, i) => <option key={i} value={i}>{s.title}</option>)}
                    </select>
                    <FontAwesomeIcon icon={faAngleDown}
                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none text-xs"/>
                </div>

                {hasActiveFilters && (
                    <button onClick={resetFilters}
                            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-(--text-muted) hover:text-(--text-color) text-sm transition-colors border border-transparent hover:border-(--border-input-color)">
                        <FontAwesomeIcon icon={faXmark}/>
                        Сбросить
                    </button>
                )}
            </div>

            {/* Результаты */}
            {!hasPasswords ? (
                <div className="bg-(--background-secondary) border border-(--border-color) border-dashed rounded-xl p-12 text-center">
                    <div className="text-(--text-muted) text-sm">
                        Пока нет сохранённых паролей.
                    </div>
                </div>
            ) : !hasActiveFilters ? (
                <div className="bg-(--background-secondary) border border-(--border-color) border-dashed rounded-xl p-12 text-center">
                    <div className="text-(--text-muted) text-sm">
                        Начните вводить запрос или выберите фильтр.
                    </div>
                </div>
            ) : shownCount === 0 ? (
                <div className="bg-(--background-secondary) border border-(--border-color) border-dashed rounded-xl p-12 text-center">
                    <div className="text-(--text-muted) text-sm">
                        Ничего не найдено. Попробуйте изменить запрос или сбросить фильтры.
                    </div>
                    <button onClick={resetFilters}
                            className="mt-4 text-sm text-(--accent-color) hover:text-(--accent-color)/70 transition-colors">
                        Сбросить фильтры
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-(--text-muted)">
                        Найдено {shownCount} {pluralRu(shownCount, "запись", "записи", "записей")}
                    </div>
                    <div className="space-y-2">
                        {filteredPasswords.map(p => (
                            <SearchResultCard key={p.id} item={p} query={searchQuery}/>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

/** Карточка результата поиска */
function SearchResultCard({item, query}: { item: Password; query: string }) {
    const tagColor = generateTagColor(item.tag?.color ?? FALLBACK_TAG_COLOR);
    const strength = STRENGTH_DETAILS[item.strengthScore] ?? STRENGTH_DETAILS[0];
    const snippet = noteSnippet(item.note ?? "", query);

    return (
        <Link href={`/passwords/${item.id}`}
              className="block group bg-(--background-secondary) border border-(--border-color) rounded-xl px-4 py-3 transition-colors hover:border-(--border-input-color)">
            <div className="flex items-center gap-4">
                {/* Иконка-заглушка */}
                <div className="w-10 h-10 shrink-0 rounded-lg bg-(--hover-overlay) border border-(--border-input-color) flex items-center justify-center text-(--text-muted)">
                    <FontAwesomeIcon icon={faGlobe}/>
                </div>

                {/* Основная информация */}
                <div className="grow min-w-0">
                    <div className="font-medium text-(--text-color) truncate">
                        <Highlight text={item.title || "(без названия)"} query={query}/>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-sm text-(--text-muted)">
                        {item.login && (
                            <span className="flex items-center gap-1.5 min-w-0">
                                <FontAwesomeIcon icon={faUser} className="text-xs shrink-0"/>
                                <span className="truncate"><Highlight text={item.login} query={query}/></span>
                            </span>
                        )}
                        {item.url && (
                            <span className="flex items-center gap-1.5 min-w-0 font-mono text-xs">
                                <Highlight text={item.url} query={query}/>
                            </span>
                        )}
                    </div>
                    {snippet && (
                        <div className="flex items-start gap-1.5 mt-1.5 text-xs text-(--text-muted)">
                            <FontAwesomeIcon icon={faNoteSticky} className="text-xs mt-0.5 shrink-0"/>
                            <span className="line-clamp-2"><Highlight text={snippet} query={query}/></span>
                        </div>
                    )}
                </div>

                {/* Бейджи */}
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs"
                          style={{
                              color: tagColor.color,
                              backgroundColor: tagColor.backgroundColor,
                              borderColor: tagColor.borderColor,
                          }}>
                        {item.tag?.title ?? "Без тега"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs"
                          style={{
                              color: strength.color,
                              backgroundColor: strength.backgroundColor,
                              borderColor: strength.borderColor,
                          }}>
                        {strength.title}
                    </span>
                </div>
            </div>
        </Link>
    );
}