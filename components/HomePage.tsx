// components/HomePage.tsx

import Hero from "./Hero";
import Section from "./Section";
import HomeSections from "./HomeSections";
import CallToAction from "./CallToAction";

interface HomePageProps {
  // Language code for content, defaults to "en"
  lang?: string;
}

export default function HomePage({ lang = "en" }: HomePageProps) {
  return (
    <>
      {/* Hero section */}
      <Section>
        <Hero lang={lang} />
      </Section>

      {/* Services / features grid */}
      <Section className="py-16 md:py-20">
        <HomeSections lang={lang} />
      </Section>

      {/* Call-to-action section */}
      <Section>
        <CallToAction lang={lang} />
      </Section>
    </>
  );
}
