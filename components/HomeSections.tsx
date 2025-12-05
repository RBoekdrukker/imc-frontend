// components/HomeSections.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { directusFetch } from "../lib/directus";

interface HomeSectionItem {
  id: number;
  title: string;
  body?: string | null;
  button_label?: string | null;
  detail_slug?: string | null;
  background_image?: string | { id: string } | null;
  language_code: string;
  sort?: number;
}

interface HomeSectionsProps {
  lang: string;
}

function getAssetUrl(file: any | null | undefined): string | null {
  if (!file) return null;
  if (typeof file === "string") return `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${file}`;
  if (typeof file === "object" && file.id) {
    return `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${file.id}`;
  }
  return null;
}

export default function HomeSections({ lang }: HomeSectionsProps) {
  const [sections, setSections] = useState<HomeSectionItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const response = await directusFetch("items/home_sections", {
          "filter[language_code][_eq]": lang,
          "filter[published][_eq]": "true",
          "sort[]": "sort",
          fields: "id,title,body,button_label,detail_slug,background_image,language_code,sort",
        });

        setSections(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load home sections", err);
        setError("Sections could not be loaded.");
      }
    };

    loadSections();
  }, [lang]);

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (!sections.length) {
    return null;
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {sections.map((section) => {
        const href = section.detail_slug ? `/${lang}/${section.detail_slug}` : "#";
        const imageUrl = getAssetUrl(section.background_image);

        const card = (
          <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={section.title}
                className="h-40 w-full object-cover"
              />
            )}

            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                {section.title}
              </h3>

              {section.body && (
                <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                  {section.body}
                </p>
              )}
            </div>
          </article>
        );

        return section.detail_slug ? (
          <Link key={section.id} href={href} className="block">
            {card}
          </Link>
        ) : (
          <div key={section.id}>{card}</div>
        );
      })}
    </div>
  );
}
