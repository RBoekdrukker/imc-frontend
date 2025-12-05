// components/Section.tsx

import React from "react";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  title?: string;
  subtitle?: string;
  light?: boolean;      // if true → light background + dark text
  className?: string;
  background?: string;  // optional explicit background class override
}

export default function Section({
  children,
  id,
  title,
  subtitle,
  light = false,
  className = "",
  background = "",
}: SectionProps) {
  // Background + text colors
  const bgClass = background || (light ? "bg-white" : "");
  const titleColor = light ? "text-slate-900" : "text-slate-100";
  const subtitleColor = light ? "text-slate-600" : "text-slate-300";

  return (
    <section
      id={id}
      className={`${bgClass} py-10 md:py-14 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
        {(title || subtitle) && (
          <header className="mb-8 text-center">
            {title && (
              <h2 className={`text-3xl font-semibold tracking-tight ${titleColor}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`mt-3 text-base leading-relaxed ${subtitleColor}`}>
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
