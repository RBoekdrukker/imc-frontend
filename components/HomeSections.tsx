import { directusFetch } from "../lib/directus"; // adjust path if needed
import { useEffect, useState } from 'react';
import axios from 'axios';
import SectionContainer from './layout/SectionContainer';

interface HomeSection {
  id: number;
  title: string;
  body: string;
  background_image?: {
    id: string;
  };
}

export default function HomeSections() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchSections = async () => {
    try {
      const data = await directusFetch("items/home_sections", {
        "fields": "id,title,body,background_image.id",
        "filter[published][_eq]": "true"
      });
      setSections(data.data);
    } catch (err) {
      console.error("Failed loading home sections:", err);
    }
  };

  fetchSections();

  }, []);

  return (
    <SectionContainer className="rounded-x3">
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white border border-brand-primary shadow-lg rounded-2xl overflow-hidden">
            {/* Background Image Banner */}
            {section.background_image && (
              <img
                src={`http://localhost:8055/assets/${section.background_image.id}`}
                alt={section.title}
                className="w-full h-32 object-cover"
              />
            )}

            {/* Text Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-2 leading-snug min-h-[3.5rem]">
				{section.title}
			</h3>
              <div
                className="text-gray-700 text-center text-sm leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
