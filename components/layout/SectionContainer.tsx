// components/layout/SectionContainer.tsx
import React from 'react';

export default function SectionContainer({
  children,
  className = '',
  background = '',
}: {
  children: React.ReactNode;
  className?: string;
  background?: string;
}) {
  return (
    <section className={`${background} py-4  ${className}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-0">
        {children}
      </div>
    </section>
  );
}
