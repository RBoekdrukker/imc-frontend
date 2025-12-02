// components/Menu.tsx
import { directusFetch } from "../lib/directus";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface NavigationItem {
  id: number;
  title: string;
  slug?: string;
  url?: string;
  parent_id?: number;
  language_code: string;
  children?: NavigationItem[];
}

export default function Menu({ lang }: { lang: string }) {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   const fetchNavigation = async () => {
     try {
       const data = await directusFetch("items/navigation_items", {
         "filter[published][_eq]": "true",
         "sort[]": "sort"
       });
       setNavigationItems(data.data);
     } catch (err) {
       console.error("Failed loading navigation:", err);
       setError("Failed to load navigation");
     }
   };

  fetchNavigation();

  }, [lang]);

  const buildTree = (items: NavigationItem[]): NavigationItem[] => {
    const map: Record<number, NavigationItem> = {};
    const roots: NavigationItem[] = [];

    items.forEach(item => {
      map[item.id] = { ...item, children: [] };
    });

    items.forEach(item => {
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
          <ul className="absolute left-0 -mt-1 bg-white text-gray-800 shadow-lg rounded-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
            {item.children.map(child => (
              <li key={child.id}>
                <Link href={child.url ?? `/${child.language_code}/${child.slug}`}>
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

  return (
    <nav className="bg-brand-menu text-nicepage-primary font-medium shadow">
  <div className="max-w-max mx-auto px-4 sm:px-6 lg:px-8">
    <ul className="flex space-x-4 py-3">
      {error ? (
        <li className="text-red-500">{error}</li>
      ) : (
        navigation.map(renderItem)
      )}
    </ul>
  </div>
</nav>
  );
}
