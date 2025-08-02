// components/Section.tsx
export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-6 md:px-8 py-8 bg-brand-accent">
      {children}
    </section>
  );
}
