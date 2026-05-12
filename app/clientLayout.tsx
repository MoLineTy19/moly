"use client"

import {ReactNode, useEffect} from "react";
import {Toaster} from "react-hot-toast";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import {usePasswordStore} from "@/store/passwordStore";
import {useTagStore} from "@/store/tagStore";

/**
 * Клиентское исполнение лайаута
 */
export default function ClientLayout({ children }: { children: ReactNode }) {
    const fetchPasswords = usePasswordStore((state) => state.fetchPasswords)
    const fetchTags = useTagStore((state) => state.fetchTags)

    useEffect(() => {
        fetchPasswords()
        fetchTags()
    }, [fetchPasswords, fetchTags])


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