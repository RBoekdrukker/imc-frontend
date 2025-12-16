// components/Hero.tsx
import { useEffect, useState } from "react";
import { directusFetch } from "../lib/directus";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "";

interface HeroData {
  title: string;
  subtitle: string;
  background_image?: {
    id: string;
  } | null;
}

interface HeroProps {
  lang?: string;
}

export default function Hero({ lang = "en" }: HeroProps) {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await directusFetch("items/hero_section", {
          "filter[language_code][_eq]": lang,
          "filter[published][_eq]": "true",
          fields: "title,subtitle,background_image.id",
          limit: 1,
        });

        // hero_section is no longer a singleton → res.data is an ARRAY
        const records = res?.data ?? [];
        const record = Array.isArray(records) ? records[0] : records;

        setHero(record || null);
        setError(null);
      } catch (err) {
        console.error("Failed loading hero section:", err);
        setError("Failed to load hero section");
      }
    };

    fetchHero();
  }, [lang]);

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  if (!hero) return null;

  const backgroundImageId = hero.background_image?.id;
  const backgroundImageUrl =
    backgroundImageId && DIRECTUS_URL
      ? `${DIRECTUS_URL}/assets/${backgroundImageId}`
      : undefined;

  return (
    <section
      className="text-white py-32 px-6 text-center"
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#254463",
      }}
    >
      <h1 className="text-5xl font-bold mb-6">{hero.title}</h1>
      <p className="mx-auto max-w-4xl text-center text-lg md:text-xl leading-relaxed text-slate-200">
        {hero.subtitle}
      </p>
    </section>
  );
}
