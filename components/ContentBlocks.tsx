import { useEffect, useState } from 'react';
import axios from 'axios';

interface ContentBlock {
  content_block_id: number;
  title: string;
  subtitle: string;
  type: 'quote' | 'image';
  image_file?: {
    id: string;
  };
  details?: string;
}

export default function ContentBlocks({ slug, lang }: { slug: string; lang: string }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await axios.get('http://localhost:8055/items/content_blocks', {
          params: {
            filter: {
              slug: { _eq: slug },
              language_code: { _eq: lang },
              published: { _eq: true }
            },
            fields: 'content_block_id,title,subtitle,type,image_file.id,details'
          }
        });
        setBlocks(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load content blocks.');
      }
    };

    fetchBlocks();
  }, [slug, lang]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!blocks.length) return null;

  const stripHTML = (html: string) =>
    html.replace(/<[^>]+>/g, '');

  return (
    <section className="bg-brand-primary py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {blocks.map((block) => {
          const imageUrl = block.image_file?.id
            ? `http://localhost:8055/assets/${block.image_file.id}`
            : '';

          return (
            <div
              key={block.content_block_id}
              className="relative rounded-xl shadow-md overflow-hidden flex flex-col bg-white"
            >
              {block.type === 'image' && imageUrl ? (
                <div
                  className="h-48 bg-cover bg-center flex flex-col justify-end p-6 text-white"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                >
                  <div className="bg-black bg-opacity-50 p-4 rounded">
                    <h3 className="text-xl font-bold">{stripHTML(block.title)}</h3>
                    <p className="text-sm">{stripHTML(block.subtitle)}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 h-48 flex flex-col justify-start">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{stripHTML(block.title)}</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{stripHTML(block.subtitle)}</p>
                </div>
              )}

              {block.details && (
                <div className="p-4 border-t text-sm text-gray-500">{block.details}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
