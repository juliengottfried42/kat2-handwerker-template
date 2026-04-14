import Link from "next/link";

interface CTAProps { phone: string; email: string; }

export function CTA({ phone, email }: CTAProps) {
  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-warm-700 to-green-700 text-center" id="kontakt">
      <h2 className="font-serif text-4xl text-warm-100 mb-4">Bereit für frische Farbe?</h2>
      <p className="text-warm-200 mb-8">Starten Sie jetzt Ihre kostenlose Anfrage — wir melden uns innert 24 Stunden.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/konfigurator" className="inline-block bg-green-600 hover:bg-green-700 text-white px-9 py-4 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-400" aria-label="Anfrage starten">Anfrage starten →</Link>
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 bg-white/10 text-warm-100 px-7 py-4 rounded-xl border border-white/15 hover:bg-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400" aria-label={`Anrufen: ${phone}`}><span aria-hidden="true">📞</span> {phone}</a>
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 bg-white/10 text-warm-100 px-7 py-4 rounded-xl border border-white/15 hover:bg-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400" aria-label={`E-Mail senden an ${email}`}><span aria-hidden="true">✉️</span> {email}</a>
      </div>
    </section>
  );
}
