// pages/uk/контакт.tsx
import { GetServerSideProps } from "next";
import ContactPage, {
  getServerSideProps as baseGetServerSideProps,
} from "../[lang]/contact";

// Reuse the multilingual contact form but force "uk"
export default ContactPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.params = { lang: "uk" };
  return baseGetServerSideProps(context as any);
};
