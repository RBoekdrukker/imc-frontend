// components/Services.tsx
import React from "react";
import Section from "./Section";

interface ServiceItem {
  id: number;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: "Strategic Consulting",
    description:
      "We help you clarify priorities, design robust roadmaps, and translate strategy into measurable outcomes.",
  },
  {
    id: 2,
    title: "Process Optimization",
    description:
      "Streamline workflows, reduce complexity, and improve transparency across your organization.",
  },
  {
    id: 3,
    title: "Digital Implementation",
    description:
      "From requirements to rollout, we support the implementation of sustainable digital solutions.",
  },
];

export default function Services() {
  return (
    <Section
      id="services"
      title="Our Services"
      subtitle="Independent consulting with a focus on clarity, structure, and execution."
      light
    >
      <div className="grid gap-8 md:grid-cols-3">
        {SERVICES.map((service) => (
          <article
            key={service.id}
            className="flex h-full flex-col rounded-2xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              {service.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">
              {service.description}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
