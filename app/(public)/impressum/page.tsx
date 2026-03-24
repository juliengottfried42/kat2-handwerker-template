import { getSiteConfig } from "@/lib/queries";
import Link from "next/link";

export default async function ImpressumPage() {
  const config = await getSiteConfig();

  const companyName = config.company_name ?? "Muster Handwerk GmbH";
  const phone = config.phone ?? "+41 XX XXX XX XX";
  const email = config.email ?? "info@example.ch";
  const address = config.address ?? "Musterstrasse 1, 8000 Zürich";
  const ownerName = config.owner_name ?? "Max Muster";

  return (
    <main className="min-h-screen bg-warm-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-8 transition-colors"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="font-serif text-3xl text-warm-800 mb-2">Impressum</h1>
        <p className="text-warm-500 text-sm mb-10">Angaben gemäss Art. 3 UWG (Schweiz)</p>

        <div className="space-y-8 text-warm-700 leading-relaxed">

          {/* Company */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              Unternehmen
            </h2>
            <p className="font-medium">{companyName}</p>
            <p>{address}</p>
            <p>Schweiz</p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              Kontakt
            </h2>
            <p>
              <span className="text-warm-500">Telefon:</span>{" "}
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-warm-800 transition-colors">
                {phone}
              </a>
            </p>
            <p>
              <span className="text-warm-500">E-Mail:</span>{" "}
              <a href={`mailto:${email}`} className="hover:text-warm-800 transition-colors">
                {email}
              </a>
            </p>
          </section>

          {/* Responsible person */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              Verantwortliche Person
            </h2>
            <p>{ownerName}</p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              Haftungsausschluss
            </h2>
            <p className="text-sm text-warm-600">
              Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten verantwortlich.
            </p>
          </section>

          {/* Copyright */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              Urheberrecht
            </h2>
            <p className="text-sm text-warm-600">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem Schweizer Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung ausserhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
