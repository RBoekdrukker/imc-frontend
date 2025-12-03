// components/CallToAction.tsx
import { useEffect, useState } from "react";
import { directusFetch } from "../lib/directus";

interface CtaData {
  title: string;
  subtitle?: string;
  button_label?: string;
  button_url?: string;
}

export default function CallToAction() {
  const [cta, setCta] = useState<CtaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCta = async () => {
      try {
        const data = await directusFetch("items/cta_section", {
          // singleton CTA with basic fields
          fields: "title,subtitle,button_label,button_url",
        });

        const record = data?.data ?? null;
        setCta(record);
        setError(null);
      } catch (err) {
        console.error("Failed loading call to action:", err);
        setError("Failed to load call to action");
      }
    };

    fetchCta();
  }, []);

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  if (!cta) return null;

  return (
    <section className="py-16 px-6 bg-slate-100 text-center">
      <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
      {cta.subtitle && (
        <p className="text-lg mb-6 max-w-2xl mx-auto">{cta.subtitle}</p>
      )}

      {cta.button_label && cta.button_url && (
        <a
          href={cta.button_url}
          className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          {cta.button_label}
        </a>
      )}
    </section>
  );
}
