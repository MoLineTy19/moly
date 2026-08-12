import React from "react";
import './global.css'
import {Metadata} from "next";
import ClientLayout from "@/app/clientLayout";

export const metadata: Metadata = {
    title: 'Moly - Password Manager'
}

/**
 * Применяет сохранённый пресет оформления до первой отрисовки, чтобы избежать
 * вспышки дефолтной темы. Читает тот же ключ в localStorage, что и configStore
 * (zustand/persist → moly_user_config), и ставит data-theme на <html>.
 */
const themeBootstrap = `(function(){try{var raw=localStorage.getItem('moly_user_config');if(!raw)return;var s=JSON.parse(raw).state;if(!s||!s.theme)return;var dark=['midnight','coal','orchid','ember'];var mode=dark.indexOf(s.theme)>=0?'dark':'light';var e=document.documentElement;e.setAttribute('data-theme',s.theme);e.style.colorScheme=mode;}catch(_){}})();`;

/**
 * Родительский компонент лайаут
 */
export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
}>) {

    return (
        <html suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{__html: themeBootstrap}}/>
            </head>
            <body className="min-h-screen">
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
