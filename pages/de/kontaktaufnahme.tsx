// pages/de/kontaktaufnahme.tsx
import { GetServerSideProps } from "next";
import ContactPage, {
  getServerSideProps as baseGetServerSideProps,
} from "../[lang]/contact";

// Reuse the same ContactPage component used at /de/contact
export default ContactPage;

// Force the language to "de"
export const getServerSideProps: GetServerSideProps = async (context) => {
  context.params = { lang: "de" };
  return baseGetServerSideProps(context as any);
};
