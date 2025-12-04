// components/HomeSections.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { directusFetch } from "../lib/directus";

const DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(
  /\/$/,
  ""
);

interface HomeSection {
  id: number;
  title: string;
  subtitle?: string | null;
  detail_slug?: string | null; // NEW: slug for target service/article
  background_image?: { id: string } | string | null;
  published?: boolean;
}

interface HomeSectionsProps {
  lang: string;
}

function getAssetUrl(file: { id: string } | string | null | undefined) {
  if (!file) return null;
  const id = typeof file === "string" ? file : file.id;
  if (!id) return null;

  if (!DIRECTUS_URL) return `/assets/${id}`;
  return `${DIRECTUS_URL}/assets/${id}`;
}

export default function HomeSections({ lang }: HomeSectionsProps) {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSections() {
      try {
        setLoading(true);
        setError(null);

        // For now we only filter on published; language-specific filtering
        // can be added later if needed.
        const response = await directusFetch(
          "items/home_sections?filter[published][_eq]=true&sort=id&fields=*.*"
        );

        const data = ((response as any)?.data || []) as HomeSection[];
        setSections(data);
      } catch (err) {
        console.error("Error loading home sections:", err);
        setError("Could not load home sections.");
      } finally {
        setLoading(false);
      }
    }

    fetchSections();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 text-center text-slate-200">
          Loading sections…
        </div>
      </section>
    );
  }

  if (error || sections.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
        {sections.map((section) => {
          const imageUrl = getAssetUrl(section.background_image);

          const href = section.detail_slug
            ? `/${lang}/services/${section.detail_slug}`
            : "#";

          const card = (
            <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              {/* Image */}
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={section.title}
                  className="h-40 w-full object-cover"
                />
              )}

              {/* Text */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {section.title}
                </h3>
                {section.subtitle && (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {section.subtitle}
                  </p>
                )}
              </div>
            </article>
          );

          // If there is a detail_slug, make the whole card clickable
          return section.detail_slug ? (
            <Link key={section.id} href={href} className="block">
              {card}
            </Link>
          ) : (
            <div key={section.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
