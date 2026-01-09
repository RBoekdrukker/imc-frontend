// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Lang = "en" | "de" | "uk";

/**
 * Minimal, language-aware footer.
 * - Translates the copyright text
 * - Drops Imprint
 * - Links Privacy to the article slug under /[lang]/services/data_protection
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const router = useRouter();

  // Determine current language from route (e.g. /en/..., /de/..., /uk/...)
  const lang = (router.query.lang as Lang) || getLangFromPath(router.asPath) || "en";

  const t = translations[lang] ?? translations.en;

  return (
    <footer className="border-t border-slate-800 bg-slate-900">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-400 md:flex-row">
    <div>{t.copyright(year)}</div>

    <div className="flex gap-4">
    <Link href={`/${lang}/services/data_protection`} className="hover:text-slate-200">
    {t.privacy}
    </Link>
    </div>
    </div>
    </footer>
  );
}

function getLangFromPath(path: string): Lang | null {
  // path examples: "/en/services/...", "/de", "/uk/about"
  const first = path.split("?")[0].split("#")[0].split("/").filter(Boolean)[0];
  if (first === "en" || first === "de" || first === "uk") return first;
  return null;
}

const translations: Record<Lang, { privacy: string; copyright: (year: number) => string }> = {
  en: {
    privacy: "Privacy & data use",
    copyright: (year) => `© ${year} IMC Consulting. All rights reserved.`,
  },
  de: {
    privacy: "Datenschutz",
    copyright: (year) => `© ${year} IMC Consulting. Alle Rechte vorbehalten.`,
  },
  uk: {
    privacy: "Конфіденційність",
    copyright: (year) => `© ${year} IMC Consulting. Усі права захищено.`,
  },
};
