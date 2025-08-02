import { GetServerSideProps } from 'next';
import axios from 'axios';
import React from 'react';

interface HomeSection {
  id: number;
  section_type: 'hero' | 'services' | 'cta' | 'footer';
  title?: string;
  body?: string;
  button_label?: string;
  button_url?: string;
}

export default function HomePage({
  lang,
  sections,
}: {
  lang: string;
  sections: HomeSection[];
}) {
  return (
    <div className="text-gray-900 bg-white">
      {sections.map((section) => {
        switch (section.section_type) {
          case 'hero':
            return (
              <section
                key={section.id}
                className="py-24 text-center px-6 md:px-0 bg-white shadow-sm"
              >
                <h1 className="text-4xl md:text-5xl font-light mb-4">
                  {section.title}
                </h1>
                <p className="text-xl text-gray-600">{section.body}</p>
              </section>
            );

          case 'services':
            return (
              <section
                key={section.id}
                className="bg-gray-100 py-16 px-6 md:px-20 text-center"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {section.body?.split('||').map((block, idx) => {
                    const [title, desc] = block.split('|');
                    return (
                      <div
                        key={idx}
                        className="bg-white p-6 rounded-2xl shadow-md"
                      >
                        <h3 className="text-lg font-semibold mb-2">{title}</h3>
                        <p className="text-sm text-gray-600">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case 'cta':
            return (
              <section
                key={section.id}
                className="bg-blue-900 text-white text-center py-20 px-6"
              >
                <h2 className="text-2xl md:text-3xl font-light mb-4">
                  {section.title}
                </h2>
                <p className="mb-6">{section.body}</p>
                {section.button_label && section.button_url && (
                  <a
                    href={section.button_url}
                    className="bg-white text-blue-900 px-6 py-3 rounded-full text-sm font-medium shadow hover:bg-gray-200"
                  >
                    {section.button_label}
                  </a>
                )}
              </section>
            );

          case 'footer':
            return (
              <footer
                key={section.id}
                className="bg-gray-200 text-center text-sm py-6"
              >
                <p className="text-gray-600">{section.body}</p>
              </footer>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.params?.lang as string;

  try {
    const response = await axios.get(
      'http://localhost:8055/items/home_sections',
      {
        params: {
          filter: {
            language_code: { _eq: lang },
            published: { _eq: true },
          },
          sort: 'sort',
          fields:
            'id,section_type,title,body,button_label,button_url,language_code',
        },
      }
    );

    return {
      props: {
        lang,
        sections: response.data.data,
      },
    };
  } catch (error) {
    console.error('Error loading home sections:', error);
    return {
      props: {
        lang,
        sections: [],
      },
    };
  }
};
