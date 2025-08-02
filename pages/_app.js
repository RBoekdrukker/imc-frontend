import '../styles/globals.css';
import Menu from '../components/Menu';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const lang = router.query.lang || 'en'; // fallback to English if missing

  return (
    <>
      <Menu lang={lang} />
      <main className="p-6 max-w-4xl mx-auto">
        <Component {...pageProps} />
      </main>
    </>
  );
}
