"use client"

import {ReactNode, useEffect} from "react";
import {Toaster} from "react-hot-toast";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import {usePasswordStore} from "@/store/passwordStore";
import {useTagStore} from "@/store/tagStore";
import UnlockScreen from "@/app/unlock/page";
import {useAutoLock} from "@/app/hooks/useAutoLock";
import {useConfigStore} from "@/store/configStore";
import {applyTheme} from "@/config/theme";

/**
 * Клиентское исполнение лайаута
 */
export default function ClientLayout({ children }: { children: ReactNode }) {
    const fetchPasswords = usePasswordStore((state) => state.fetchPasswords)
    const rehydrate = usePasswordStore((state) => state.rehydrate);
    const fetchTags = useTagStore((state) => state.fetchTags)
    const {isLocked, isSetup} = usePasswordStore();
    const theme = useConfigStore((state) => state.theme);

    useEffect(() => {
        rehydrate();
        if (isLocked) return;
        fetchPasswords()
        fetchTags()
    }, [fetchPasswords, fetchTags, isLocked])

    // Применяем пресет оформления и поддерживаем его в актуальном состоянии.
    useEffect(() => {
        applyTheme(theme);
    }, [theme])

    // useAutoLock();

    // if (isLocked) return <UnlockScreen />;

    return (
        <>
            <Toaster position="top-right" />
            <div className="flex min-h-screen bg-(--background-color)">
                <Sidebar/>
                <div className="flex flex-col flex-1">
                    <Topbar/>
                    <main className="flex-1 text-(--text-color)">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}