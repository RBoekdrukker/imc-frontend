// pages/_app.js
import "../styles/globals.css";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useRouter } from "next/router";

const SUPPORTED_LANGS = ["en", "de", "uk"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // 1) Try to get lang from dynamic route param: /[lang]/...
  const rawLang = router.query.lang;
  let lang = "en";

  if (typeof rawLang === "string" && SUPPORTED_LANGS.includes(rawLang)) {
    lang = rawLang;
  } else if (Array.isArray(rawLang) && SUPPORTED_LANGS.includes(rawLang[0])) {
    lang = rawLang[0];
  } else {
    // 2) Fallback: infer from first URL segment, e.g. /de/... or /uk/...
    const path = router.asPath.split("?")[0]; // strip query
    const firstSegment = path.split("/")[1]; // '' | 'de' | 'uk' | 'en' | ...

    if (SUPPORTED_LANGS.includes(firstSegment)) {
      lang = firstSegment;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Top navigation */}
      <header className="border-b border-slate-600/20">
        <Menu lang={lang} />
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Component {...pageProps} lang={lang} />
      </main>

      {/* Global footer */}
      <Footer />
    </div>
  );
}
