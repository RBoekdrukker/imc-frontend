// components/Hero.tsx
import { directusFetch } from "../lib/directus"; // adjust path if needed
import { useEffect, useState } from 'react';
import axios from 'axios';

interface HeroData {
  title: string;
  subtitle: string;
  background_image?: string; // File ID
}

export default function Hero() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await directusFetch<any>('items/hero_section', {
          fields: ['title', 'subtitle', 'background_image.id'],
        });

        // singleton: data.data is an array or a single object depending on how we created it
        const record = Array.isArray(data.data) ? data.data[0] : data.data;
        setHero(record || null);
      } catch (err) {
        console.error('Failed loading hero section:', err);
        setError('Failed to load hero section');
      }
    };

    fetchHero();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!hero) return null;

  const backgroundImageUrl = hero.background_image
    ? `http://localhost:8055/assets/${hero.background_image}`
    : undefined;

  return (
    <section
      className="text-white py-32 px-6 text-center"
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#254463', // fallback
      }}
    >
      <h1 className="text-5xl font-bold mb-6">{hero.title}</h1>
      <p className="text-xl max-w-2xl mx-auto">{hero.subtitle}</p>
    </section>
  );
}
