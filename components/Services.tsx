export default function Services() {
  return (
    <section className="bg-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3 text-center">
        <div className="bg-white p-8 shadow-sm rounded-2xl">
          <h3 className="text-xl text-gray-800 font-semibold mb-4">Strategy Consulting</h3>
          <p className="text-gray-500">Helping businesses grow through tailored strategies.</p>
        </div>
        <div className="bg-white p-8 shadow-sm rounded-2xl">
          <h3 className="text-xl text-gray-800 font-semibold mb-4">Market Entry</h3>
          <p className="text-gray-500">Guiding international expansion with local expertise.</p>
        </div>
        <div className="bg-white p-8 shadow-sm rounded-2xl">
          <h3 className="text-xl text-gray-800 font-semibold mb-4">Operational Support</h3>
          <p className="text-gray-500">Optimizing operations for efficiency and performance.</p>
        </div>
      </div>
    </section>
  );
}
