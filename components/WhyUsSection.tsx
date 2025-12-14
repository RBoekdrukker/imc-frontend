// components/WhyUsSection.tsx
import React, { useEffect, useState } from "react";
import { directusFetch } from "../lib/directus";

interface WhyUsData {
  title: string;
  subtitle?: string | null;
  intro_text?: string | null;          // contains HTML from Directus
  more_btn_label?: string | null;
  more_btn_url?: string | null;
}

interface WhyUsSectionProps {
  lang: string;
  slug: string;
}

export default function WhyUsSection({ lang, slug }: WhyUsSectionProps) {
  const [data, setData] = useState<WhyUsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWhyUs() {
      try {
        setError(null);

        const response = await directusFetch(
          `items/why_us_section?filter[slug][_eq]=${encodeURIComponent(
            slug
          )}&filter[language_code][_eq]=${encodeURIComponent(
            lang
          )}&filter[published][_eq]=true&limit=1`
        );

        const items = ((response as any)?.data || []) as WhyUsData[];
        setData(items[0] || null);
      } catch (err) {
        console.error("Error loading Why Us section:", err);
        setError("Could not load Why Us section.");
      }
    }

    fetchWhyUs();
  }, [lang, slug]);

  if (error || !data) {
    return null;
  }

  return (
    <section className="bg-white pt-10 pb-4">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-base text-slate-600">{data.subtitle}</p>
          )}
        </header>

        {data.intro_text && (
          <div
            className="mx-auto prose prose-sm max-w-none text-gray-900 prose-p:my-0 prose-p:text-gray-900"
            // intro_text contains HTML from Directus
            dangerouslySetInnerHTML={{ __html: data.intro_text }}
          />
        )}

        {data.more_btn_label && data.more_btn_url && (
          <div className="mt-8 flex justify-center">
            <a
              href={data.more_btn_url}
              className="rounded-full bg-sky-700 px-7 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-sky-800"
            >
              {data.more_btn_label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
