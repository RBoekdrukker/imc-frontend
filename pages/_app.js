// pages/_app.js
import "../styles/globals.css";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useRouter } from "next/router";

const SUPPORTED_LANGS = ["en", "de", "uk"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Example paths:
  // "/"                   -> firstSegment = ""
  // "/de/kontaktaufnahme" -> firstSegment = "de"
  // "/uk/kontakt"         -> firstSegment = "uk"
  // "/en/contact"         -> firstSegment = "en"
  const path = router.asPath.split("?")[0]; // strip query string
  const firstSegment = path.split("/")[1];  // '' or 'de' or 'uk' or 'en'

  const lang = SUPPORTED_LANGS.includes(firstSegment)
    ? firstSegment
    : "en";

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
