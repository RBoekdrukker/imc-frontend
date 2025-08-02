// components/WhyUsSection.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface WhyUsData {
  title: string;
  subtitle: string;
  intro_text: string;
  more_btn?: string;
}

export default function WhyUsSection({ slug, lang }: { slug: string; lang: string }) {
  const [whyUs, setWhyUs] = useState<WhyUsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWhyUs = async () => {
      try {
        const res = await axios.get('http://localhost:8055/items/why_us_section', {
          params: {
            filter: {
              slug: { _eq: slug },
              language_code: { _eq: lang },
              published: { _eq: true }
            },
            fields: 'title,subtitle,intro_text,more_btn'
          }
        });
        setWhyUs(res.data.data[0] || null);
      } catch (err) {
        console.error(err);
        setError('Failed to load Why Us section.');
      }
    };

    fetchWhyUs();
  }, [slug, lang]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!whyUs) return null;

  return (
    <section className="bg-white text-gray-800 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">{whyUs.title}</h2>
        <h3 className="text-xl text-nicepage-accent font-semibold mb-6">{whyUs.subtitle}</h3>
        <p className="text-lg mb-6 whitespace-pre-line">{whyUs.intro_text}</p>
        {whyUs.more_btn && (
          <Link href="#">
            <span className="inline-block mt-4 px-6 py-2 border-2 border-nicepage-accent text-nicepage-accent rounded-full hover:bg-nicepage-accent hover:text-white transition">
              {whyUs.more_btn}
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
