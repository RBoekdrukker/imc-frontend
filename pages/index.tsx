// pages/index.tsx
import Head from 'next/head';
import Hero from '../components/Hero';
import HomeSections from '../components/HomeSections';
import CallToAction from '../components/CallToAction';
import Section from '../components/Section';

export default function Home() {
  return (
    <>
      <Head>
        <title>IMC - Home</title>
        <meta name="description" content="IMC Consulting - Home" />
      </Head>

      <main>
        <Section>
			<Hero />
		</Section>

		<Section>
                        <HomeSections lang={lang} />
		</Section>

		<Section>
			<CallToAction />
		</Section>
      </main>
    </>
  );
}
