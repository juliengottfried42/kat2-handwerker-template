import Link from "next/link";

interface CTAProps {
  phone: string;
  email: string;
  headline?: string;
}

export function CTA({ phone, email, headline }: CTAProps) {
  const telHref = phone ? `tel:${phone.replace(/[^+0-9]/g, "")}` : null;
  const mailHref = email ? `mailto:${email}` : null;

  return (
    <section
      className="py-16 md:py-20 px-5 md:px-12 bg-gradient-to-br from-warm-800 to-green-700 text-center"
      id="kontakt"
      aria-labelledby="cta-heading"
    >
      <h2 id="cta-heading" className="font-serif text-3xl md:text-4xl text-warm-100 mb-3 md:mb-4">
        {headline ?? "Bereit fuer Ihren Auftrag?"}
      </h2>
      <p className="text-warm-200 mb-7 md:mb-8 max-w-xl mx-auto">
        Starten Sie jetzt Ihre kostenlose Anfrage — wir melden uns innert 24 Stunden.
      </p>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl mx-auto">
        <Link
          href="/konfigurator"
          className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white min-h-[56px] px-7 py-4 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-400"
          aria-label="Anfrage starten"
        >
          Anfrage starten →
        </Link>
        {telHref && (
          <a
            href={telHref}
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-warm-100 min-h-[56px] px-6 py-4 rounded-xl border border-white/20 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            aria-label={`Anrufen: ${phone}`}
          >
            <span aria-hidden="true">📞</span> {phone}
          </a>
        )}
        {mailHref && (
          <a
            href={mailHref}
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-warm-100 min-h-[56px] px-6 py-4 rounded-xl border border-white/20 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            aria-label={`E-Mail senden an ${email}`}
          >
            <span aria-hidden="true">✉️</span> {email}
          </a>
        )}
      </div>
    </section>
  );
}
