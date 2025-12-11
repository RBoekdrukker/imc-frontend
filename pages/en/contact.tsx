// pages/en/contact.tsx
import { GetServerSideProps } from "next";
import ContactPage, {
  getServerSideProps as baseGetServerSideProps,
} from "../[lang]/contact";

// Reuse the multilingual contact form but force "en"
export default ContactPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.params = { lang: "en" };
  return baseGetServerSideProps(context as any);
};
