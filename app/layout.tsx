import React from "react";
import './global.css'
import {Metadata} from "next";
import ClientLayout from "@/app/clientLayout";

export const metadata: Metadata = {
    title: 'Moly - Password Manager'
}

/**
 * Родительский компонент лайаут
 */
export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
}>) {

    return (
        <html>
            <body className="min-h-screen">
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
