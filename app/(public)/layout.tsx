import Link from "next/link";
import { getSiteConfig } from "@/lib/queries";
import { MobileNav } from "@/components/landing/mobile-nav";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import { businessDefaults } from "@/lib/config";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  let ratingAverage: number | undefined;
  let ratingCount: number | undefined;
  try {
    const cache = JSON.parse(config.google_reviews_cache ?? "null");
    if (cache && typeof cache.rating === "number" && typeof cache.total === "number" && cache.total > 0) {
      ratingAverage = cache.rating;
      ratingCount = cache.total;
    }
  } catch {
    // ignore
  }

  const phone = config.phone ?? "";
  const telHref = phone ? `tel:${phone.replace(/[^+0-9]/g, "")}` : undefined;

  return (
    <>
      <LocalBusinessSchema
        companyName={config.company_name ?? "Handwerker Betrieb"}
        phone={phone}
        email={config.email ?? ""}
        address={config.address}
        serviceArea={config.service_area}
        serviceRadiusKm={config.service_radius_km}
        latitude={config.latitude}
        longitude={config.longitude}
        openingHours={config.opening_hours}
        ratingAverage={ratingAverage}
        ratingCount={ratingCount}
        url={businessDefaults.siteUrl}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-green-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
      >
        Zum Inhalt springen
      </a>
      <nav
        role="navigation"
        aria-label="Hauptnavigation"
        className="flex justify-between items-center gap-3 px-4 md:px-12 py-3 bg-white/95 backdrop-blur shadow-sm sticky top-0 z-50 border-b border-warm-100"
      >
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl text-warm-800 truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:rounded-sm"
        >
          {config.company_name}
        </Link>
        <ul className="hidden md:flex items-center gap-7">
          <li><a href="#leistungen" className="text-sm font-medium text-warm-600 hover:text-warm-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:rounded-sm">Leistungen</a></li>
          <li><a href="#galerie" className="text-sm font-medium text-warm-600 hover:text-warm-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:rounded-sm">Arbeiten</a></li>
          <li><a href="#bewertungen" className="text-sm font-medium text-warm-600 hover:text-warm-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:rounded-sm">Bewertungen</a></li>
          <li><a href="#ueber" className="text-sm font-medium text-warm-600 hover:text-warm-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:rounded-sm">Ueber uns</a></li>
          {telHref && (
            <li>
              <a
                href={telHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-700 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:rounded-sm"
                aria-label={`Anrufen: ${phone}`}
              >
                <span aria-hidden="true">📞</span> {phone}
              </a>
            </li>
          )}
          <li>
            <Link
              href="/konfigurator"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600"
            >
              Jetzt anfragen
            </Link>
          </li>
        </ul>
        <MobileNav companyName={config.company_name ?? ""} phone={phone} />
      </nav>
      <div id="main-content" className="pb-20 md:pb-0">
        {children}
      </div>
    </>
  );
}
