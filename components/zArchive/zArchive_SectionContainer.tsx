// components/SectionContainer.tsx
import { ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  background?: string; // e.g. "bg-white text-gray-800"
  className?: string;  // additional custom classes
}

export default function SectionContainer({
  children,
  background = 'bg-white text-gray-800',
  className = '',
}: SectionContainerProps) {
  return (
    <section className={`${background} py-20 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
