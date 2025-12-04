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

  // Ensure we always have a string slug
  const resolvedSlug =
    (Array.isArray(slug) ? slug[0] : slug) || "consulting";

  return (
    <>
      {/* Dark hero / feature section */}
      <Section>
        <FeatureSection lang={lang} slug={resolvedSlug} />
      </Section>

      {/* White "Why Us" section */}
      <Section background="bg-white">
        <WhyUsSection lang={lang} slug={resolvedSlug} />
      </Section>

      {/* Light grey content blocks */}
      <Section background="bg-slate-50">
        <ContentBlocks lang={lang} slug={resolvedSlug} />
      </Section>
    </>
  );
}
