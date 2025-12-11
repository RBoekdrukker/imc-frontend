// pages/contact.tsx
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/en/contact",
      permanent: false,
    },
  };
};

export default function ContactRedirect() {
  return null;
}
