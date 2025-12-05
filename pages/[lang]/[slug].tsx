// pages/[lang]/[slug].tsx
import { useRouter } from "next/router";
import FeatureSection from "../../components/FeatureSection";
import WhyUsSection from "../../components/WhyUsSection";
import ContentBlocks from "../../components/ContentBlocks";
import Section from "../../components/Section";

interface SlugPageProps {
  lang: string;
}

export default function SlugPage({ lang }: SlugPageProps) {
  const router = useRouter();
  const { slug } = router.query;

  const resolvedSlug =
    (Array.isArray(slug) ? slug[0] : slug) || "consulting";

  return (
    <>
      {/* Top section no spacing */}
      <Section id="Feature" className="py-0">
        <FeatureSection lang={lang} slug={resolvedSlug} />
      </Section>

      {/* White “Experts in legal consulting…” section */}
      <Section>
        <WhyUsSection lang={lang} slug={resolvedSlug} />
      </Section>

      {/* Three content/testimonial blocks */}
      <Section>
        <ContentBlocks lang={lang} slug={resolvedSlug} />
      </Section>
    </>
  );
}
