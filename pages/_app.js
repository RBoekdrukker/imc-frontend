// pages/_app.js
import "../styles/globals.css";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // router.query.lang can be string | string[] | undefined
  const rawLang = router.query.lang;
  const lang =
    (Array.isArray(rawLang) ? rawLang[0] : rawLang) || "en"; // fallback to English

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Top navigation */}
      <header>
        <Menu lang={lang} />
      </header>

      {/* Page content */}
      <main className="flex-1">
        {/* Pass lang down to every page */}
        <Component {...pageProps} lang={lang} />
      </main>

      {/* Global footer */}
      <Footer />
    </div>
  );
}
