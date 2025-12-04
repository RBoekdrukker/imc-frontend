// components/layout/Layout.tsx
import React, { ReactNode } from "react";
import Menu from "../Menu";
import Footer from "../Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Top navigation */}
      <header>
        <Menu />
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Global footer */}
      <Footer />
    </div>
  );
}
