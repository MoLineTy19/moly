"use client"

import React, {useMemo} from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-regular-svg-icons";
import {usePasswordStore} from "@/store/passwordStore";
import BoardView from "@/app/passwords/components/boardView";

/**
 * Страница с избранными паролями
 */
export default function Favorites() {
    const passwords = usePasswordStore((state) => state.passwords);
    const passwordCount = usePasswordStore((state) => state.passwordCount);

    const favorites = useMemo(() => passwords.filter((p) => p.favorite), [passwords]);

    return (
        <div className="grow overflow-y-auto p-8">
            {/* Хедер */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-(--text-color) flex items-center gap-3 mb-2">
                    Избранное
                    <span className="text-sm font-normal bg-(--background-secondary) text-(--text-muted) py-0.5 px-2.5 rounded-md border border-(--border-input-color)">
                        {favorites.length}
                    </span>
                </h1>
                <p className="text-sm text-(--text-muted)">
                    Пароли, которые вы отметили звёздочкой для быстрого доступа.
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="bg-(--background-secondary) border border-(--border-color) border-dashed rounded-xl p-12 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-(--background-color) border border-(--border-color) flex items-center justify-center text-(--text-muted)">
                        <FontAwesomeIcon icon={faStar} className="text-lg"/>
                    </div>
                    {passwordCount === 0 ? (
                        <p className="text-(--text-muted) text-sm">
                            В сейфе пока нет сохранённых паролей.
                        </p>
                    ) : (
                        <>
                            <p className="text-(--text-color) text-sm font-medium mb-1">
                                Здесь пока пусто
                            </p>
                            <p className="text-(--text-muted) text-sm mb-4">
                                Отмечайте пароли звёздочкой на карточке или в записи, и они появятся на этой странице.
                            </p>
                            <Link href="/passwords"
                                  className="inline-flex items-center gap-2 text-sm text-(--accent-color) hover:text-(--accent-color)/70 transition-colors">
                                Перейти к паролям
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <BoardView passwords={favorites}/>
            )}
        </div>
    );
}
