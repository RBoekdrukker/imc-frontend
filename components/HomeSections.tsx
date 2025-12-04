import Link from "next/link";

export default function HomeSections({ sections, lang }) {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">

        {sections.map((section) => {
          const imageUrl = section.background_image
            ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${section.background_image.id}`
            : null;

          // Build link destination
          const href = section.detail_slug
            ? `/${lang}/services/${section.detail_slug}`
            : "#";

          return (
            <Link
              key={section.id}
              href={href}
              className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
            >
              {/* Top image */}
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={section.title}
                  className="h-40 w-full object-cover"
                />
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {section.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
