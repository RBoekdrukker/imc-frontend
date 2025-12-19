// components/Menu.tsx

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { directusFetch } from "../lib/directus";

interface NavigationItem {
  id: number;
  title: string;
  slug?: string;
  url?: string;
  parent_id?: number | null;
  language_code: string;
  children?: NavigationItem[];
}

interface Language {
  id: number;
  language_code: string;
  label: string;
  flag_emoji?: string;
}

// Local mapping from language_code -> SVG in /public/flags
const FLAG_MAP: Record<string, string> = {
  en: "/flags/en.svg",
  gb: "/flags/en.svg", // alias
  de: "/flags/de.svg",
  ua: "/flags/ua.svg",
  uk: "/flags/ua.svg", // alias
};

const DEFAULT_LANG = "en";

// Handle alias codes coming from data/URLs
const LANG_ALIASES: Record<string, string> = {
  gb: "en",
  uk: "ua",
};

function canonicalLang(code: string) {
  return (LANG_ALIASES[code] ?? code).toLowerCase();
}

function isExternalUrl(url: string) {
  return (
    /^(https?:)?\/\//i.test(url) ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  );
}

/**
 * Replace the first URL segment if it’s a language code.
 * Preserves querystring + hash (router.asPath includes them).
 */
function replaceLangInPath(
  asPath: string,
  targetLang: string,
  supportedLangs: string[]
) {
  const canonicalTarget = canonicalLang(targetLang);

  // Split off query/hash safely
  const [pathOnly, suffix = ""] = asPath.split(/(?=[?#])/);

  const parts = pathOnly.split("/").filter(Boolean); // ["en","services","x"]
  const supported = supportedLangs.map(canonicalLang);

  if (parts.length > 0 && supported.includes(canonicalLang(parts[0]))) {
    parts[0] = canonicalTarget;
  } else {
    parts.unshift(canonicalTarget);
  }

  return "/" + parts.join("/") + suffix;
}

/**
 * Build internal hrefs in a consistent `/{lang}/...` way.
 * - If item.url is external => return it as-is.
 * - If item.url is internal and already starts with /en/... => rewrite to current lang
 * - If item.url is internal and has no lang => prefix with current lang
 * - Else if item.slug exists => /{lang}/{slug}
 * - Else => /{lang} (home)
 */
function resolveNavHref(
  item: { url?: string; slug?: string },
  lang: string,
  supportedLangs: string[]
) {
  const langCanonical = canonicalLang(lang);

  if (item.url) {
    if (isExternalUrl(item.url)) return item.url;

    // Ensure it starts with "/"
    const url = item.url.startsWith("/") ? item.url : `/${item.url}`;

    // Rewrite/prefix language consistently
    return replaceLangInPath(url, langCanonical, supportedLangs);
  }

  if (item.slug && item.slug.trim()) {
    return `/${langCanonical}/${item.slug.trim()}`;
  }

  return `/${langCanonical}`;
}

export default function Menu({ lang }: { lang: string }) {
  const router = useRouter();

  const langCanon = canonicalLang(lang);

  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on navigation / outside click / escape
  useEffect(() => {
    const handleRouteStart = () => setLangOpen(false);
    router.events.on("routeChangeStart", handleRouteStart);

    const handleMouseDown = (e: MouseEvent) => {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setLangOpen(false);
    };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLangOpen(false);
      };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
          router.events.off("routeChangeStart", handleRouteStart);
          document.removeEventListener("mousedown", handleMouseDown);
          document.removeEventListener("keydown", handleKeyDown);
        };
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Navigation items (language-specific)
        const navRes = await directusFetch("items/navigation_items", {
          "filter[language_code][_eq]": langCanon,
          "filter[published][_eq]": "true",
          fields: "id,title,slug,url,parent_id,language_code,sort",
          "sort[]": "sort",
        });

        const items: NavigationItem[] = navRes.data;
        const tree = buildTree(items);
        setNavigation(tree);

        // Languages (global)
        const langRes = await directusFetch("items/languages", {
          "filter[published][_eq]": "true",
          fields: "id,language_code,label,flag_emoji,sort",
          "sort[]": "sort",
        });

        setLanguages(langRes.data);
        setError(null);
      } catch (err) {
        console.error("Failed loading navigation or languages:", err);
        setError("Navigation could not be loaded.");
      }
    };

    fetchData();
  }, [langCanon]);

  const buildTree = (items: NavigationItem[]): NavigationItem[] => {
    const map: Record<number, NavigationItem> = {};
    const roots: NavigationItem[] = [];

    items.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    items.forEach((item) => {
      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].children!.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  };

  // Canonical supported language codes for reliable prefix detection
  const supportedLangs = languages.map((l) => canonicalLang(l.language_code));

  const renderItem = (item: NavigationItem) => {
    const href = resolveNavHref(item, langCanon, supportedLangs);
    const external = !!item.url && isExternalUrl(item.url);

    const label = (
      <span className="px-4 py-2 block hover:bg-white hover:text-brand-menu cursor-pointer transition">
      {item.title}
      </span>
    );

    return (
      <li key={item.id} className="relative group">
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
        </a>
      ) : (
        <Link href={href}>{label}</Link>
      )}

      {item.children && item.children.length > 0 && (
        <ul
        className="absolute left-0 -mt-1 bg-white text-gray-800 shadow-lg rounded-md z-50
        opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
        min-w-[220px]"
        >
        {item.children.map((child) => {
          const childHref = resolveNavHref(child, langCanon, supportedLangs);
          const childExternal = !!child.url && isExternalUrl(child.url);

          const childLabel = (
            <span className="px-4 py-2 block whitespace-nowrap hover:bg-nicepage-primary hover:text-brand-menu cursor-pointer transition">
            {child.title}
            </span>
          );

          return (
            <li key={child.id}>
            {childExternal ? (
              <a
              href={childHref}
              target="_blank"
              rel="noopener noreferrer"
              >
              {childLabel}
              </a>
            ) : (
              <Link href={childHref}>{childLabel}</Link>
            )}
            </li>
          );
        })}
        </ul>
      )}
      </li>
    );
  };

  const handleLanguageChange = (targetCode: string) => {
    const target = canonicalLang(targetCode);
    const current = langCanon;

    if (target === current) {
      setLangOpen(false);
      return;
    }

    // Keep path + query + hash, only swap the language prefix
    const nextPath = replaceLangInPath(
      router.asPath || `/${current}`,
      target,
      supportedLangs.length ? supportedLangs : [DEFAULT_LANG]
    );

    router.push(nextPath);
    setLangOpen(false);
  };

  const currentLang =
  languages.find((l) => canonicalLang(l.language_code) === langCanon) ||
  languages[0] || {
    language_code: langCanon,
    label: langCanon.toUpperCase(),
    flag_emoji: "",
  };

  const currentFlagSrc = FLAG_MAP[canonicalLang(currentLang.language_code)];

  return (
    <nav className="bg-brand-menu text-nicepage-primary font-ui font-medium shadow">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between py-3">
    {/* Left: navigation items */}
    <ul
    className="flex items-center gap-2 sm:gap-4"
    onMouseEnter={() => setLangOpen(false)}
    >
    {error ? (
      <li className="text-red-500">{error}</li>
    ) : (
      navigation.map(renderItem)
    )}
    </ul>

    {/* Right: language dropdown */}
    <div ref={langRef} className="relative">
    <button
    type="button"
    onClick={() => setLangOpen((open) => !open)}
    className="flex items-center px-3 py-1.5 rounded bg-slate-800/60 hover:bg-slate-700 text-sm text-slate-50 transition"
    >
    {currentFlagSrc ? (
      <img
      src={currentFlagSrc}
      alt={currentLang.label}
      className="mr-2 w-5 h-4 rounded-sm object-cover"
      />
    ) : currentLang.flag_emoji ? (
      <span className="mr-1 text-lg leading-none">
      {currentLang.flag_emoji}
      </span>
    ) : null}

    <span className="mr-1">{currentLang.label}</span>
    <span className="text-xs opacity-80">▾</span>
    </button>

    {langOpen && (
      <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-md shadow-lg py-1 z-50">
      {languages.map((lng) => {
        const lngCanon = canonicalLang(lng.language_code);
        const flagSrc = FLAG_MAP[lngCanon];

        return (
          <button
          key={lng.id}
          type="button"
          onClick={() => handleLanguageChange(lngCanon)}
          className={`w-full flex items-center px-3 py-1.5 text-sm text-left hover:bg-slate-100 transition ${
            lngCanon === langCanon
            ? "font-semibold text-slate-900"
            : "text-slate-700"
          }`}
          >
          {flagSrc ? (
            <img
            src={flagSrc}
            alt={lng.label}
            className="mr-2 w-5 h-4 rounded-sm object-cover"
            />
          ) : lng.flag_emoji ? (
            <span className="mr-2 text-lg leading-none">
            {lng.flag_emoji}
            </span>
          ) : null}

          <span>{lng.label}</span>
          </button>
        );
      })}
      </div>
    )}
    </div>
    </div>
    </div>
    </nav>
  );
}
