const steps = [
  { number: 1, title: "Anfrage stellen", desc: "Erzählen Sie uns in unserem Chat, was Sie brauchen. Fotos helfen bei der Einschätzung." },
  { number: 2, title: "Offerte erhalten", desc: "Wir melden uns innert 24h mit einer unverbindlichen Offerte." },
  { number: 3, title: "Auftrag erledigt", desc: "Wir kommen zum vereinbarten Termin und liefern Qualitätsarbeit." },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-6 md:px-12 bg-warm-50">
      <h2 className="font-serif text-4xl text-center text-warm-800 mb-3">
        So einfach geht&apos;s
      </h2>
      <p className="text-center text-warm-600 mb-12">
        In 3 Schritten zu Ihrem Auftrag
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-12 max-w-4xl mx-auto">
        {steps.map((s) => (
          <div key={s.number} className="text-center flex-1">
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {s.number}
            </div>
            <h3 className="text-lg font-semibold text-warm-800 mb-2">{s.title}</h3>
            <p className="text-sm text-warm-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
