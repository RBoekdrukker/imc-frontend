// components/Footer.tsx
import React from "react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-400 md:flex-row">
        <div>&copy; {year} IMC Consulting. All rights reserved.</div>
        <div className="flex gap-4">
          <Link href="/imprint" className="hover:text-slate-200">
            Imprint
          </Link>
          <Link href="/privacy" className="hover:text-slate-200">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
