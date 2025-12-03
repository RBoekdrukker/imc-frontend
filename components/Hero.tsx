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

export default function Hero() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await directusFetch("items/hero_section", {
          // singleton collection – one record with these fields
          fields: "title,subtitle,background_image.id",
        });

        // For singletons, Directus returns { data: { ... } }
        const record = data?.data ?? null;
        setHero(record);
        setError(null);
      } catch (err) {
        console.error("Failed loading hero section:", err);
        setError("Failed to load hero section");
      }
    };

    fetchHero();
  }, []);

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
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#254463", // fallback
      }}
    >
      <h1 className="text-5xl font-bold mb-6">{hero.title}</h1>
      <p className="text-xl max-w-2xl mx-auto">{hero.subtitle}</p>
    </section>
  );
}
