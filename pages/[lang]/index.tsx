// pages/[lang]/index.tsx
import { GetServerSideProps } from "next";
import Layout from "../../components/layout/Layout";
import HomePage from "../../components/HomePage";

interface LangHomeProps {
  lang: string;
}

export default function LangHomePage({ lang }: LangHomeProps) {
  return (
    <Layout lang={lang}>
      <HomePage lang={lang} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<LangHomeProps> = async (
  context
) => {
  const langParam = context.params?.lang;

  let lang =
    typeof langParam === "string"
      ? langParam
      : Array.isArray(langParam)
      ? langParam[0]
      : "en";

  // Optional: guard against random codes, fall back to English
  const supportedLangs = ["en", "uk", "de"];
  if (!supportedLangs.includes(lang)) {
    lang = "en";
  }

  return {
    props: {
      lang,
    },
  };
};
