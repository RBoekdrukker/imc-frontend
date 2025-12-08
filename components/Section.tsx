// components/Section.tsx
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function Section({
  id,
  title,
  subtitle,
  light = false,
  className = "",
  children,
}: SectionProps) {
  const bg = light ? "bg-white text-gray-900" : "bg-transparent text-white";

  return (
    <section
      id={id}
      className={`${bg} py-16 md:py-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <header className="mb-10 text-center">
            {title && (
              <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-300 md:text-gray-600 max-w-3xl mx-auto text-justify">
                {subtitle}
              </p>
            )}
          </header>
        )}

        {children}
      </div>
    </section>
  );
}
