interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price_from: number | null;
}

export function Services({ services }: { services: Service[] }) {
  return (
    <section className="py-20 px-6 md:px-12 bg-white" id="leistungen">
      <h2 className="font-serif text-4xl text-center text-warm-800 mb-3">
        Unsere Leistungen
      </h2>
      <p className="text-center text-warm-600 mb-12">
        Qualität, die man sieht
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-warm-50 border border-warm-100 rounded-2xl p-8 text-center hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 bg-warm-200 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
              {s.icon}
            </div>
            <h3 className="text-lg font-semibold text-warm-800 mb-2">{s.title}</h3>
            <p className="text-sm text-warm-600 mb-3">{s.description}</p>
            <div className="font-semibold text-green-600">
              {s.price_from ? `ab CHF ${s.price_from.toLocaleString("de-CH")}` : "auf Anfrage"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
