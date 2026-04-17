interface HowItWorksProps {
  labels?: readonly [string, string, string];
}

const DESCRIPTIONS: [string, string, string] = [
  "Erzaehlen Sie uns in unserem Chat, was Sie brauchen. Fotos helfen bei der Einschaetzung.",
  "Wir melden uns innert 24h mit einer unverbindlichen Offerte.",
  "Wir kommen zum vereinbarten Termin und liefern Qualitaetsarbeit.",
];

export function HowItWorks({ labels }: HowItWorksProps) {
  const effective = labels ?? (["Anfrage stellen", "Offerte erhalten", "Auftrag erledigt"] as const);

  return (
    <section className="py-16 md:py-20 px-5 md:px-12 bg-warm-50">
      <h2 className="font-serif text-3xl md:text-4xl text-center text-warm-800 mb-3">
        So einfach geht&apos;s
      </h2>
      <p className="text-center text-warm-600 mb-10 md:mb-12">
        In 3 Schritten zu Ihrem Auftrag
      </p>
      <ol className="flex flex-col md:flex-row justify-center gap-10 md:gap-12 max-w-4xl mx-auto" role="list">
        {effective.map((title, idx) => (
          <li key={idx} className="text-center flex-1">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4" aria-hidden="true">
              {idx + 1}
            </div>
            <h3 className="text-lg font-semibold text-warm-800 mb-2">{title}</h3>
            <p className="text-sm text-warm-600 leading-relaxed">{DESCRIPTIONS[idx]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
