import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SectionContainer from './layout/SectionContainer';

interface CtaData {
  title: string;
  subtitle: string;
  button_text: string;
  button_url: string;
}

export default function CallToAction() {
  const [cta, setCta] = useState<CtaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCta = async () => {
      try {
        const res = await axios.get('http://localhost:8055/items/cta_section');
        setCta(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load call to action');
      }
    };

    fetchCta();
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!cta) return null;

  return (
    <SectionContainer background="bg-gray-4 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
      <p className="text-lg mb-8">{cta.subtitle}</p>
      <Link
		href={cta.button_url || '#'}
		className="bg-brand-menu text-nicepage-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
		>
  {cta.button_text}
</Link>

    </SectionContainer>
  );
}
