// pages/[lang]/services/[slug].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { directusFetch } from "../../../lib/directus";

const DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(/\/$/, "");

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
  return `${DIRECTUS_URL}/assets/${id}?width=1600&height=600&fit=cover`;
}

interface ServiceDetailPageProps {
  lang: string;
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
          `items/articles?filter[slug][_eq]=${encodeURIComponent(slugValue)}&filter[language_code][_eq]=${encodeURIComponent(
            lang
          )}&filter[published][_eq]=true&limit=1&fields=*.*`
        );

        const items = ((response as any)?.data || []) as Article[];
        const item = items[0] || null;

        if (!item) setError("Article not found.");
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

  const heroUrl = getAssetUrl(article?.hero_image);

  if (loading) {
    return (
      <main className="flex-1">
      <section className="bg-transparent text-white py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4 md:px-8 text-slate-200">
      Loading service details…
      </div>
      </section>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="flex-1">
      <section className="bg-transparent text-white py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4 md:px-8 text-slate-200">
      {error || "This page could not be found."}
      </div>
      </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
    <section className="bg-transparent text-white py-10 md:py-14">
    <div className="mx-auto max-w-6xl px-4 md:px-8">
    <article className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
    {heroUrl && (
      <div className="relative h-72 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
      src={heroUrl}
      alt={article.title}
      className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      </div>
    )}

    <div className="px-6 py-8 md:px-10 md:py-10">
    <h1 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight">
    {article.title}
    </h1>

    {article.intro && (
      <p className="mb-8 text-base md:text-lg text-slate-600">
      {article.intro}
      </p>
    )}

    {article.body && (
      <div
        className="
          text-slate-900
          prose prose-slate max-w-none
          prose-headings:text-slate-900
          prose-h2:text-2xl prose-h2:font-bold prose-h2:text-brand-primary prose-h2:mt-10
          prose-h3:text-lg prose-h3:font-semibold prose-h3:text-brand-primary prose-h3:mt-8
          prose-p:leading-relaxed

          prose-ul:list-disc prose-ul:pl-6
          prose-ol:list-decimal prose-ol:pl-6
          prose-ul:my-4 prose-ul:space-y-2
          prose-ol:my-4 prose-ol:space-y-2
          prose-li:my-0

          prose-strong:text-slate-900
          prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline
          "
        dangerouslySetInnerHTML={{ __html: article.body }}
      />
    )}
    </div>
    </article>
    </div>
    </section>
    </main>
  );
}
