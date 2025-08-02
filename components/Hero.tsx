// components/Hero.tsx
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
        const res = await axios.get('http://localhost:8055/items/hero_section');
        setHero(res.data.data);
      } catch (err) {
        console.error(err);
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
