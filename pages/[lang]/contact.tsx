// pages/[lang]/contact.tsx
import { GetServerSideProps } from "next";
import { useState, FormEvent } from "react";
import Layout from "../../components/layout/Layout";

type LangCode = "en" | "de" | "uk" | string;

interface ContactPageProps {
  lang: LangCode;
}

interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
  consent: boolean;
  honeypot: string; // hidden field for bots
}

const initialFormState: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  consent: false,
  honeypot: "",
};

const translations: Record<
  string,
  {
    pageTitle: string;
    intro: string;
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    messageLabel: string;
    consentLabel: string;
    submitLabel: string;
    privacyLinkLabel: string;
    successMessage: string;
    errorMessage: string;
    requiredMessage: string;
  }
> = {
  en: {
    pageTitle: "Contact us",
    intro:
      "Contact us for professional guidance from senior, internationally experienced consultants.",
    nameLabel: "Your name",
    emailLabel: "Email address",
    companyLabel: "Company (optional)",
    messageLabel: "Your message",
    consentLabel:
      "I consent to IMC Consulting processing my personal data for the purpose of handling my inquiry, in accordance with the ",
    privacyLinkLabel: "privacy & data policy",
    submitLabel: "Send message",
    successMessage:
      "Thank you for your message. We will get back to you as soon as possible.",
    errorMessage:
      "Something went wrong while sending your message. Please try again later.",
    requiredMessage: "Please fill in all required fields and accept the consent.",
  },
  de: {
    pageTitle: "Kontakt",
    intro:
      "Setzen Sie sich mit uns für eine unverbindliche Erstabklärung in Verbindung.",
    nameLabel: "Ihr Name",
    emailLabel: "E-Mail-Adresse",
    companyLabel: "Unternehmen (optional)",
    messageLabel: "Ihre Nachricht",
    consentLabel:
      "Ich willige ein, dass IMC Consulting meine personenbezogenen Daten zum Zweck der Bearbeitung meiner Anfrage gemäß der ",
    privacyLinkLabel: "Datenschutzordnung",
    submitLabel: "Nachricht senden",
    successMessage:
      "Vielen Dank für Ihre Nachricht. Wir melden uns so bald wie möglich bei Ihnen.",
    errorMessage:
      "Beim Versenden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
    requiredMessage:
      "Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie die Einwilligung.",
  },
  uk: {
    pageTitle: "Звʼяжіться з нами",
    intro:
      "Зверніться до нас за професійною консультацією від досвідчених фахівців.",
    nameLabel: "Ваше ім’я",
    emailLabel: "Електронна пошта",
    companyLabel: "Компанія (необов’язково)",
    messageLabel: "Ваше повідомлення",
    consentLabel:
      "Я надаю згоду на обробку моїх персональних даних IMC Consulting з метою опрацювання цього запиту відповідно до ",
    privacyLinkLabel: "Конфіденційність",
    submitLabel: "Надіслати повідомлення",
    successMessage:
      "Дякуємо за Ваше повідомлення. Ми зв’яжемося з Вами якнайшвидше.",
    errorMessage:
      "Під час надсилання повідомлення сталася помилка. Будь ласка, спробуйте ще раз пізніше.",
    requiredMessage:
      "Будь ласка, заповніть усі обов’язкові поля та підтвердіть згоду.",
  },
};


export default function ContactPage({ lang }: ContactPageProps) {
  const t = translations[lang] ?? translations.en;

  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Required field checks
    if (!form.name || !form.email || !form.message || !form.consent) {
      setError(t.requiredMessage);
      return;
    }

    // Honeypot: if filled, silently "succeed" but do nothing
    if (form.honeypot) {
      setSuccess(t.successMessage);
      setForm(initialFormState);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang,
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          consent: form.consent,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      setSuccess(t.successMessage);
      setForm(initialFormState);
    } catch (err) {
      console.error("Contact form error:", err);
      setError(t.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout lang={lang}>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg px-8 py-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-slate-900 mb-2">
            {t.pageTitle}
          </h1>
          <p className="text-center text-slate-600 mb-8">{t.intro}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field (hidden from humans) */}
            <div className="hidden">
              <label>
                Do not fill this field
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.nameLabel} *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.emailLabel} *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.companyLabel}
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.messageLabel} *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-vertical"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="consent"
                id="consent"
                checked={form.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              <label
              htmlFor="consent"
              className="text-xs text-slate-600 leading-relaxed"
              >
              {t.consentLabel}{" "}
              <a
              href={`/${lang}/services/data_protection`}
              className="underline text-brand-primary hover:text-brand-primary-light"
              target="_blank"
              rel="noopener noreferrer"
              >
              {t.privacyLinkLabel}
              </a>
              .
              </label>

            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
                {success}
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-md text-sm font-medium bg-brand-primary text-white hover:bg-brand-primary-light disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "..." : t.submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ContactPageProps> = async (
  context
) => {
  const langParam = context.params?.lang;
  let lang =
    typeof langParam === "string"
      ? langParam
      : Array.isArray(langParam)
      ? langParam[0]
      : "en";

  const supported = ["en", "de", "uk"];
  if (!supported.includes(lang)) {
    lang = "en";
  }

  return {
    props: {
      lang,
    },
  };
};
