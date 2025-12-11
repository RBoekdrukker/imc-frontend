// components/Menu.tsx
import { useEffect, useState } from "react";
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
  gb: "/flags/en.svg", // handle "gb" code from Directus / URLs
  de: "/flags/de.svg",
  ua: "/flags/ua.svg",
  uk: "flags/uk.svg", // handle "uk" code from Directus / URLs
};

export default function Menu({ lang }: { lang: string }) {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Navigation items (language-specific)
        const navRes = await directusFetch("items/navigation_items", {
          "filter[language_code][_eq]": lang,
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
  }, [lang]);

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

  const renderItem = (item: NavigationItem) => {
    const href = item.url ?? `/${item.language_code}/${item.slug}`;

    return (
      <li key={item.id} className="relative group">
        <Link href={href}>
          <span className="px-4 py-2 block hover:bg-white hover:text-brand-menu cursor-pointer transition">
            {item.title}
          </span>
        </Link>

        {item.children && item.children.length > 0 && (
          <ul className="absolute left-0 -mt-1 bg-white text-gray-800 shadow-lg rounded-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto z-50">
            {item.children.map((child) => (
              <li key={child.id}>
                <Link
                  href={child.url ?? `/${child.language_code}/${child.slug}`}
                >
                  <span className="px-4 py-2 block hover:bg-nicepage-primary hover:text-brand-menu cursor-pointer transition">
                    {child.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  const handleLanguageChange = (targetCode: string) => {
    const slug = router.query.slug as string | undefined;

    if (slug) {
      // Service / detail page: keep same slug, switch lang
      router.push(`/${targetCode}/${slug}`);
    } else {
      // Home page
      if (targetCode === "en") {
        router.push("/");
      } else {
        router.push(`/${targetCode}`);
      }
    }

    setLangOpen(false);
  };

  const currentLang =
    languages.find((l) => l.language_code === lang) ||
    languages[0] || {
      language_code: lang,
      label: lang.toUpperCase(),
      flag_emoji: "",
    };

  const currentFlagSrc = FLAG_MAP[currentLang.language_code];

  return (
    <nav className="bg-brand-menu text-nicepage-primary font-medium shadow">
      <div className="max-w-max mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Left: navigation items */}
          <ul className="flex space-x-4">
            {error ? (
              <li className="text-red-500">{error}</li>
            ) : (
              navigation.map(renderItem)
            )}
          </ul>

          {/* Right: language dropdown */}
          <div className="relative">
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
                  const flagSrc = FLAG_MAP[lng.language_code];

                  return (
                    <button
                      key={lng.id}
                      type="button"
                      onClick={() => handleLanguageChange(lng.language_code)}
                      className={`w-full flex items-center px-3 py-1.5 text-sm text-left hover:bg-slate-100 transition ${
                        lng.language_code === lang
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
