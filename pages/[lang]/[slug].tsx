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

  // ensure we always have a string
  const resolvedSlug =
    (Array.isArray(slug) ? slug[0] : slug) || "consulting";

  return (
    <>
      {/* Hero / feature section */}
      <Section>
        <FeatureSection lang={lang} slug={resolvedSlug} />
      </Section>

      {/* Why Us section */}
      <Section>
        <WhyUsSection lang={lang} slug={resolvedSlug} />
      </Section>

      {/* Content blocks */}
      <Section>
        <ContentBlocks lang={lang} slug={resolvedSlug} />
      </Section>
    </>
  );
}
