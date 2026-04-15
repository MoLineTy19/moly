import React from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import './global.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html>
          <body>
          <div className="grid grid-cols-[1fr_7fr] grid-rows-[auto_1fr] bg-(--background-secondary)">
              <div className="row-span-2">
                  <Sidebar/>
              </div>
              <Topbar/>
              <div className="col-span-1 text-(--text-color)">
                  {children}
              </div>
          </div>
          </body>
      </html>

  );
}
