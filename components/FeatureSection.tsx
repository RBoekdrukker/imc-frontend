// components/FeatureSection.tsx
import React, { useEffect, useState } from "react";
import { directusFetch } from "../lib/directus";

interface FeatureData {
  feature_id: number;
  title: string;
  description?: string | null;
  background_image?: { id: string } | string | null;
}

interface FeatureSectionProps {
  lang: string;
  slug: string;
}

const DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(
  /\/$/,
  ""
);

function getAssetUrl(file: { id: string } | string | null | undefined) {
  if (!file) return null;
  const id = typeof file === "string" ? file : file.id;
  if (!id) return null;

  if (!DIRECTUS_URL) return `/assets/${id}`;
  return `${DIRECTUS_URL}/assets/${id}`;
}

export default function FeatureSection({ lang, slug }: FeatureSectionProps) {
  const [feature, setFeature] = useState<FeatureData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeature() {
      try {
        setError(null);

        const response = await directusFetch<{ data: FeatureData[] }>(
          `items/feature_section?filter[slug][_eq]=${encodeURIComponent(
            slug
          )}&filter[language_code][_eq]=${encodeURIComponent(
            lang
          )}&filter[published][_eq]=true&limit=1&fields=*.*`
        );

        const item = response.data?.[0] || null;
        setFeature(item);
      } catch (err) {
        console.error("Error loading feature section:", err);
        setError("Could not load feature section.");
      }
    }

    fetchFeature();
  }, [lang, slug]);

  if (error || !feature) {
    return null;
  }

  const bgUrl = getAssetUrl(feature.background_image);

  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {feature.title}
          </h2>
          {feature.description && (
            <p className="max-w-xl text-base leading-relaxed text-slate-200">
              {feature.description}
            </p>
          )}
        </div>

        {bgUrl && (
          <div className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bgUrl}
              alt={feature.title}
              className="h-64 w-full rounded-2xl object-cover shadow-xl ring-1 ring-slate-700/60"
            />
          </div>
        )}
      </div>
    </section>
  );
}
