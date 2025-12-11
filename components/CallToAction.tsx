// components/CallToAction.tsx
import { useEffect, useState } from "react";
import { directusFetch } from "../lib/directus";

interface CtaData {
  title: string;
  subtitle?: string;
  button_label?: string;
  button_url?: string;
}

interface CallToActionProps {
  lang?: string;
}

export default function CallToAction({ lang = "en" }: CallToActionProps) {
  const [cta, setCta] = useState<CtaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCta = async () => {
      try {
        const res = await directusFetch("items/cta_section", {
          "filter[language_code][_eq]": lang,
          "filter[published][_eq]": "true",
          limit: 1,
        });

        const records = res?.data ?? [];
        const record = Array.isArray(records) ? records[0] : records;

        setCta(record || null);
        setError(null);
      } catch (err) {
        console.error("Failed loading CTA section:", err);
        setError("Failed to load call-to-action section.");
      }
    };

    fetchCta();
  }, [lang]);

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  if (!cta) return null;

  return (
    <section className="bg-slate-100 py-20 text-center rounded-xl shadow-sm">
      <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-brand-primary">
        {cta.title}
      </h2>

      {cta.subtitle && (
        <p className="max-w-xl mx-auto mb-6 text-slate-700">
          {cta.subtitle}
        </p>
      )}

      {cta.button_label && cta.button_url && (
        <a
          href={cta.button_url}
          className="inline-block bg-brand-primary text-white px-6 py-3 rounded-md font-medium hover:bg-brand-primary-light transition"
        >
          {cta.button_label}
        </a>
      )}
    </section>
  );
}
