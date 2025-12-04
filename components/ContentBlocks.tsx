// components/ContentBlocks.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { directusFetch } from "../lib/directus";

interface ContentBlock {
  content_block_id: number;
  title: string;
  subtitle?: string | null;
  type: string; // "image" | "quote" | etc.
  image_file?: { id: string } | string | null;
  details?: string | null;             // rich text / HTML
  detail_slug?: string | null;         // NEW: slug for deep detail page
}

interface ContentBlocksProps {
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

  if (!DIRECTUS_URL) {
    return `/assets/${id}`;
  }

  return `${DIRECTUS_URL}/assets/${id}`;
}

export default function ContentBlocks({ lang, slug }: ContentBlocksProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlocks() {
      try {
        setLoading(true);
        setError(null);

        const response = await directusFetch(
          `items/content_blocks?filter[slug][_eq]=${encodeURIComponent(
            slug
          )}&filter[language_code][_eq]=${encodeURIComponent(
            lang
          )}&filter[published][_eq]=true&sort=content_block_id&limit=6&fields=*.*`
        );

        const data = ((response as any)?.data || []) as ContentBlock[];
        setBlocks(data);
      } catch (err) {
        console.error("Error loading content blocks:", err);
        setError("Could not load content blocks.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlocks();
  }, [lang, slug]);

  if (loading) {
    return (
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center text-slate-500">
          Loading content…
        </div>
      </section>
    );
  }

  if (error || blocks.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {blocks.map((block) => {
            const imageUrl = getAssetUrl(block.image_file);

            // --- Inner card content (used for both <div> and <Link>) ---
            const card = (
              <article className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                {/* Top: image or quote */}
                {block.type === "image" && imageUrl && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={block.title || ""}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}

                {block.type !== "image" && block.subtitle && (
                  <div className="mb-4 border-l-4 border-sky-600 pl-4">
                    <p className="text-sm italic text-slate-600">
                      {block.subtitle}
                    </p>
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-slate-800">
                  {block.title}
                </h3>

                {/* Details text (HTML from Directus) */}
                {block.details && (
                  <div
                    className="mt-auto text-sm leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: block.details }}
                  />
                )}
              </article>
            );

            const key = block.content_block_id;

            // --- If detail_slug is set, make the whole card clickable ---
            if (block.detail_slug) {
              return (
                <Link
                  key={key}
                  href={`/${lang}/services/${block.detail_slug}`}
                  className="block"
                >
                  {card}
                </Link>
              );
            }

            // --- Otherwise, just render a static card ---
            return (
              <div key={key}>
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
