// pages/[lang]/services/[slug].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { directusFetch } from "../../../lib/directus";

const DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(
  /\/$/,
  ""
);

interface Article {
  article_id: number;
  title: string;
  slug: string;
  language_code: string;
  intro?: string | null;
  body?: string | null;
  hero_image?: { id: string } | string | null;
}

function getAssetUrl(file: { id: string } | string | null | undefined) {
  if (!file) return null;
  const id = typeof file === "string" ? file : file.id;
  if (!id) return null;

  if (!DIRECTUS_URL) return `/assets/${id}`;
  return `${DIRECTUS_URL}/assets/${id}`;
}

interface ServiceDetailPageProps {
  lang: string; // passed down from _app.js
}

export default function ServiceDetailPage({ lang }: ServiceDetailPageProps) {
  const router = useRouter();
  const { slug } = router.query;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const slugValue = Array.isArray(slug) ? slug[0] : slug;

    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);

        const response = await directusFetch(
          `items/articles?filter[slug][_eq]=${encodeURIComponent(
            slugValue
          )}&filter[language_code][_eq]=${encodeURIComponent(
            lang
          )}&filter[published][_eq]=true&limit=1&fields=*.*`
        );

        const items = ((response as any)?.data || []) as Article[];
        const item = items[0] || null;

        if (!item) {
          setError("Article not found.");
        }

        setArticle(item);
      } catch (err) {
        console.error("Error loading service detail article:", err);
        setError("Could not load this service detail page.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-slate-200">
          Loading service details…
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-slate-200">
          {error || "This page could not be found."}
        </div>
      </div>
    );
  }

  const heroUrl = getAssetUrl(article.hero_image);

  return (
    <article className="py-16">
      <div className="mx-auto max-w-4xl px-4 md:px-0 bg-white rounded-2xl shadow-sm">
        {/* Hero image */}
        {heroUrl && (
          <div className="overflow-hidden rounded-t-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroUrl}
              alt={article.title}
              className="h-64 w-full object-cover"
            />
          </div>
        )}

        <div className="px-6 pb-10 pt-8 md:px-10">
          {/* Title */}
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {article.title}
          </h1>

          {/* Intro */}
          {article.intro && (
            <p className="mb-6 text-base text-slate-600">{article.intro}</p>
          )}

          {/* Body (rich text from Directus) */}
          {article.body && (
            <div
              className="prose max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-800 prose-a:text-sky-700 prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
