// pages/index.tsx
import Hero from "../components/Hero";
import Section from "../components/Section";
import HomeSections from "../components/HomeSections";
import CallToAction from "../components/CallToAction";

interface HomePageProps {
  lang?: string; // comes from _app.js
}

export default function HomePage({ lang = "en" }: HomePageProps) {
  return (
    <>
      <Section>
        <Hero />
      </Section>

      <Section className="py-16 md:py-20">
        <HomeSections lang={lang} />
      </Section>

      <Section>
        <CallToAction />
      </Section>
    </>
  );
}
