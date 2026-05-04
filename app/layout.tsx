import React from "react";
import './global.css'
import {Toaster} from "react-hot-toast";
import Sidebar from "../components/layout/sidebar";
import Topbar from "../components/layout/topbar";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Moly - Password Manager'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html>
      <body className="min-h-screen">
      <Toaster position="top-right" />
      <div className="flex min-h-screen bg-(--background-color)">
          <Sidebar />
          <div className="flex flex-col flex-1">
              <Topbar/>
              <main className="flex-1 text-(--text-color)">
                  {children}
              </main>
          </div>
      </div>
      </body>
      </html>

  );
}
