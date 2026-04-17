import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  companyName: string;
  badge?: string;
  phone?: string;
  heroImage?: string;
  emergency24h?: boolean;
}

export function Hero({ title, subtitle, badge, phone, heroImage, emergency24h }: HeroProps) {
  const telHref = phone ? `tel:${phone.replace(/[^+0-9]/g, "")}` : null;

  return (
    <section
      className="relative min-h-[88vh] md:min-h-[85vh] flex items-center bg-gradient-to-br from-warm-800 via-warm-800 to-warm-900 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {heroImage && (
        <>
          <link rel="preload" as="image" href={heroImage} fetchPriority="high" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-hidden="true"
          />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-warm-900/80 via-warm-900/40 to-transparent" aria-hidden="true" />

      <div className="relative px-5 md:px-12 pt-24 pb-16 md:py-20 max-w-3xl mx-auto md:mx-0 w-full">
        {emergency24h && telHref ? (
          <a
            href={telHref}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-xs md:text-sm text-white font-semibold mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400"
            aria-label={`Notdienst 24h anrufen: ${phone}`}
          >
            <span aria-hidden="true" className="animate-pulse">🚨</span> 24h Notdienst — Jetzt anrufen
          </a>
        ) : badge ? (
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-xs md:text-sm text-warm-100 backdrop-blur-sm mb-5">
            <span aria-hidden="true">⭐</span> {badge}
          </div>
        ) : null}
        <h1
          id="hero-heading"
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-warm-100 leading-tight mb-4"
        >
          {title}
        </h1>
        <p className="text-base sm:text-lg text-warm-200 mb-7 max-w-xl">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/konfigurator"
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white min-h-[56px] px-7 py-4 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-400"
            aria-label="Kostenlose Anfrage starten"
          >
            Kostenlose Anfrage starten →
          </Link>
          {telHref && (
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-warm-100 min-h-[56px] px-7 py-4 rounded-xl text-base font-semibold border border-white/20 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-400"
              aria-label={`Sofort anrufen: ${phone}`}
            >
              <span aria-hidden="true">📞</span> {phone}
            </a>
          )}
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-warm-200" aria-label="Vorteile">
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="text-green-400">✓</span> Unverbindliche Offerte</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="text-green-400">✓</span> Antwort innert 24h</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="text-green-400">✓</span> Fair &amp; transparent</li>
        </ul>
      </div>
    </section>
  );
}
