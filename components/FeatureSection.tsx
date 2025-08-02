// components/FeatureSection.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface FeatureData {
  title: string;
  description: string;
  background_image?: {
    id: string;
  };
}

export default function FeatureSection({ slug, lang }: { slug: string; lang: string }) {
  const [feature, setFeature] = useState<FeatureData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const res = await axios.get('http://localhost:8055/items/feature_section', {
          params: {
            filter: {
              slug: { _eq: slug },
              language_code: { _eq: lang },
              published: { _eq: true }
            },
        //    fields: '*'
			fields: 'title,description,background_image.id'
          }
        });
        console.log('[FeatureSection] data:', res.data.data); //add console log
		setFeature(res.data.data[0] || null);
      } catch (err) {
        console.error(err);
        setError('Failed to load feature section.');
      }
    };

    fetchFeature();
  }, [slug, lang]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!feature) return null;

  const bgImageUrl = feature.background_image
    ? `http://localhost:8055/assets/${feature.background_image.id}`
    : '';

	console.log('[FeatureSection] feature:', feature); //add console log
	
	if (error) return <div className="text-red-600">{error}</div>;
	if (!feature) return <div className="text-yellow-400">FeatureSection: No data loaded</div>;
  
  return (
    <section
      className="py-16 text-white bg-cover bg-center"
      style={{ backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">{feature.title}</h2>
        <p className="text-lg">{feature.description}</p>
      </div>
    </section>
  );
}
