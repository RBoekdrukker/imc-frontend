// pages/uk/kontakt.tsx
import { GetServerSideProps } from "next";
import ContactPage, {
  getServerSideProps as baseGetServerSideProps,
} from "../[lang]/contact";

export default ContactPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.params = { lang: "uk" };
  return baseGetServerSideProps(context as any);
};
