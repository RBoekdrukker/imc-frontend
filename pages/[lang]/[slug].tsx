// pages/[lang]/[slug].tsx
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import FeatureSection from '../../components/FeatureSection';
import WhyUsSection from '../../components/WhyUsSection';
import ContentBlocks from '../../components/ContentBlocks';

interface Props {
  slug: string;
  lang: string;
}

export default function Page({ slug, lang }: Props) {
  return (
    <>
      <Head>
        <title>{slug}</title>
      </Head>

      <main>
        <FeatureSection slug={slug} lang={lang} />
        <WhyUsSection slug={slug} lang={lang} />
        <ContentBlocks slug={slug} lang={lang} />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { lang, slug } = context.params as { lang: string; slug: string };

  return {
    props: {
      lang,
      slug,
    },
  };
};
