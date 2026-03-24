import { getSiteConfig } from "@/lib/queries";
import Link from "next/link";

export default async function DatenschutzPage() {
  const config = await getSiteConfig();

  // Update this date whenever the privacy policy content changes
  const POLICY_DATE = "März 2026";

  const companyName = config.company_name ?? "Muster Handwerk GmbH";
  const phone = config.phone ?? "+41 XX XXX XX XX";
  const email = config.email ?? "info@example.ch";
  const address = config.address ?? "Musterstrasse 1, 8000 Zürich";

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

        <h1 className="font-serif text-3xl text-warm-800 mb-2">Datenschutzerklärung</h1>
        <p className="text-warm-500 text-sm mb-10">
          Gemäss Schweizer Datenschutzgesetz (DSG) vom 25. September 2020
        </p>

        <div className="space-y-8 text-warm-700 leading-relaxed">

          {/* 1. Verantwortliche Stelle */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              1. Verantwortliche Stelle
            </h2>
            <p>
              Verantwortlich für die Datenbearbeitung auf dieser Website ist:
            </p>
            <div className="mt-3 p-4 bg-white rounded-lg border border-warm-200 text-sm">
              <p className="font-medium">{companyName}</p>
              <p>{address}</p>
              <p>Schweiz</p>
              <p className="mt-2">
                Telefon: <a href={`tel:${phone.replace(/[\s\-().]/g, "")}`} className="hover:text-warm-800">{phone}</a>
              </p>
              <p>
                E-Mail: <a href={`mailto:${email}`} className="hover:text-warm-800">{email}</a>
              </p>
            </div>
          </section>

          {/* 2. Erhobene Daten */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              2. Erhobene Personendaten
            </h2>
            <p className="mb-3">
              Wir bearbeiten folgende Personendaten, die Sie uns im Rahmen Ihrer Anfrage mitteilen:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-warm-600 ml-2">
              <li>Name und Vorname</li>
              <li>Telefonnummer</li>
              <li>E-Mail-Adresse</li>
              <li>Angaben zu Ihrem Projekt (Konfigurationsantworten)</li>
              <li>Wunschtermin (sofern angegeben)</li>
              <li>Fotos (sofern hochgeladen)</li>
              <li>Freitextliche Nachricht (sofern angegeben)</li>
            </ul>
            <p className="mt-3 text-sm text-warm-600">
              Beim Besuch unserer Website werden ausserdem technische Daten (IP-Adresse, Browser,
              Betriebssystem, Referrer-URL, Zugriffszeit) durch unseren Hosting-Anbieter
              protokolliert. Diese Daten sind nicht Gegenstand dieser Datenschutzerklärung.
            </p>
          </section>

          {/* 3. Zweck */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              3. Zweck der Datenbearbeitung
            </h2>
            <p className="mb-3">
              Wir bearbeiten Ihre Personendaten ausschliesslich für folgende Zwecke:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-warm-600 ml-2">
              <li>Bearbeitung und Beantwortung Ihrer Anfrage</li>
              <li>Erstellung eines individuellen Angebots</li>
              <li>Terminvereinbarung und Auftragsabwicklung</li>
              <li>Qualitätssicherung und Verbesserung unserer Dienstleistungen</li>
            </ul>
            <p className="mt-3 text-sm text-warm-600">
              Die Bearbeitung erfolgt auf Grundlage Ihrer Einwilligung (durch das Absenden des
              Anfrageformulars) sowie zur Erfüllung vorvertraglicher Massnahmen.
            </p>
          </section>

          {/* 4. Speicherdauer */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              4. Speicherdauer
            </h2>
            <p className="text-sm text-warm-600">
              Ihre Anfragedaten werden so lange gespeichert, wie es für die Bearbeitung Ihrer Anfrage
              notwendig ist. Nach Abschluss des Auftragsverhältnisses werden Ihre Daten gemäss den
              gesetzlichen Aufbewahrungsfristen (in der Regel 10 Jahre) aufbewahrt und danach
              gelöscht. Nicht zur Auftragsabwicklung führende Anfragen werden nach spätestens
              12 Monaten gelöscht.
            </p>
          </section>

          {/* 5. Weitergabe an Dritte */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              5. Weitergabe an Dritte
            </h2>
            <p className="text-sm text-warm-600">
              Wir geben Ihre Personendaten nicht an Dritte weiter, ausser dies ist zur
              Auftragserfüllung notwendig oder gesetzlich vorgeschrieben. Für den E-Mail-Versand
              verwenden wir den Dienst Resend (Resend Inc., USA), welcher die E-Mails in unserem
              Auftrag versendet. Für die Datenspeicherung nutzen wir Supabase (Supabase Inc., USA).
              {/* TODO: Once Auftragsbearbeitungsverträge (data processing agreements) with
                  Resend and Supabase are confirmed, replace the sentence below with:
                  "Mit diesen Dienstleistern bestehen Auftragsbearbeitungsverträge, die ein
                  angemessenes Datenschutzniveau sicherstellen." */}
              Wir stellen sicher, dass diese Dienstleister ein angemessenes Datenschutzniveau
              gewährleisten.
            </p>
          </section>

          {/* 6. Ihre Rechte */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              6. Ihre Rechte
            </h2>
            <p className="mb-3 text-sm text-warm-600">
              Nach dem Schweizer Datenschutzgesetz haben Sie folgende Rechte:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-warm-600 ml-2">
              <li>
                <span className="font-medium text-warm-700">Auskunftsrecht:</span> Sie können
                jederzeit Auskunft über die bei uns gespeicherten Personendaten verlangen.
              </li>
              <li>
                <span className="font-medium text-warm-700">Berichtigungsrecht:</span> Sie können
                die Berichtigung unrichtiger Personendaten verlangen.
              </li>
              <li>
                <span className="font-medium text-warm-700">Löschungsrecht:</span> Sie können die
                Löschung Ihrer Personendaten verlangen, sofern keine gesetzlichen
                Aufbewahrungspflichten entgegenstehen.
              </li>
              <li>
                <span className="font-medium text-warm-700">Einschränkungsrecht:</span> Sie können
                die Einschränkung der Bearbeitung Ihrer Personendaten verlangen.
              </li>
              <li>
                <span className="font-medium text-warm-700">Widerspruchsrecht:</span> Sie können
                der Bearbeitung Ihrer Personendaten widersprechen.
              </li>
            </ul>
          </section>

          {/* 7. Kontakt */}
          <section>
            <h2 className="font-semibold text-warm-800 text-lg mb-3 border-b border-warm-200 pb-2">
              7. Kontakt & Beschwerden
            </h2>
            <p className="text-sm text-warm-600 mb-3">
              Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an:
            </p>
            <p className="text-sm">
              <a href={`mailto:${email}`} className="text-warm-700 hover:text-warm-800 underline">
                {email}
              </a>
            </p>
            <p className="text-sm text-warm-600 mt-3">
              Sie haben ausserdem das Recht, beim Eidgenössischen Datenschutz- und
              Öffentlichkeitsbeauftragten (EDÖB) Beschwerde einzureichen:{" "}
              <a
                href="https://www.edoeb.admin.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-700 hover:text-warm-800 underline"
              >
                www.edoeb.admin.ch
              </a>
            </p>
          </section>

          {/* Last updated */}
          <p className="text-xs text-warm-400 pt-4 border-t border-warm-200">
            Stand: {POLICY_DATE}
          </p>

        </div>
      </div>
    </main>
  );
}
