// components/ContentBlocks.tsx
import React, { useEffect, useState } from "react";
import { directusFetch } from "../lib/directus";

interface ContentBlock {
  content_block_id: number;
  title: string;
  subtitle?: string | null;
  type: string; // "image" | "quote" | etc.
  image_file?: { id: string } | string | null;
  details?: string | null;
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
    // Fallback – relative URL
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

        const response = await directusFetch<{ data: ContentBlock[] }>(
          `items/content_blocks?filter[slug][_eq]=${encodeURIComponent(
            slug
          )}&filter[language_code][_eq]=${encodeURIComponent(
            lang
          )}&filter[published][_eq]=true&sort=content_block_id&limit=6&fields=*.*`
        );

        setBlocks(response.data || []);
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

            return (
              <article
                key={block.content_block_id}
                className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
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

                {block.type !== "image" && (
                  <div className="mb-4 border-l-4 border-sky-600 pl-4">
                    <p className="text-sm italic text-slate-600">
                      {block.subtitle}
                    </p>
                  </div>
                )}

                {/* Title + subtitle */}
                <h3 className="mb-2 text-lg font-semibold text-slate-800">
                  {block.title}
                </h3>
                {block.subtitle && block.type === "image" && (
                  <p className="mb-3 text-sm text-slate-600">
                    {block.subtitle}
                  </p>
                )}

                {/* Details text (new field) */}
                {block.details && (
                  <p className="mt-auto text-sm leading-relaxed text-slate-700">
                    {block.details}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
