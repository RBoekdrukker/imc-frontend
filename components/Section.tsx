// components/Section.tsx

import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;     // <-- THIS is required
  background?: string;    // <-- optional background class
  id?: string;            // <-- optional anchor id
}

export default function Section({
  children,
  className = "",
  background = "",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${background} py-10 md:py-14 ${className}`}   // <-- Now valid
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
        {children}
      </div>
    </section>
  );
}
