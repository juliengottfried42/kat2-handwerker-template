import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  companyName: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-warm-800 to-warm-700">
      <div className="relative px-6 md:px-12 py-20 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm text-warm-200 backdrop-blur-sm mb-6">
          ⭐ Bestbewertet auf Google
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-warm-100 leading-tight mb-5">
          {title}
        </h1>
        <p className="text-lg text-warm-200 mb-9 max-w-lg">
          {subtitle}
        </p>
        <Link
          href="/konfigurator"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-9 py-4 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Kostenlose Anfrage starten →
        </Link>
      </div>
    </section>
  );
}
