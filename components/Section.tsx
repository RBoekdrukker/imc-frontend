// components/Section.tsx
import React, { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  light?: boolean;
}

export default function Section({
  id,
  title,
  subtitle,
  children,
  light = false,
}: SectionProps) {
  const bg = light ? "bg-white" : "bg-slate-900";
  const text = light ? "text-slate-900" : "text-white";
  const subText = light ? "text-slate-600" : "text-slate-300";

  return (
    <section id={id} className={`${bg} py-10 md:py-14 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
        {(title || subtitle) && (
          <header className="mb-8 text-center">
            {title && (
              <h2
                className={`mb-2 text-3xl font-bold tracking-tight ${text}`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-base ${subText}`}>{subtitle}</p>
            )}
          </header>
        )}

        {children}
      </div>
    </section>
  );
}
