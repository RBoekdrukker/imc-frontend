// pages/index.tsx
import Layout from "../components/layout/Layout";
import HomePage from "../components/HomePage";

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/en",
      permanent: false, // use true later if you want 308
    },
  };
}

export default function Root() {
  return null;
}
