import { businessDefaults, getActivePreset } from "@/lib/config";

interface SchemaProps {
  companyName: string;
  phone: string;
  email: string;
  address?: string;
  serviceArea?: string;
  serviceRadiusKm?: string;
  latitude?: string;
  longitude?: string;
  openingHours?: string;
  ratingAverage?: number;
  ratingCount?: number;
  url?: string;
}

function parseOpeningHours(raw: string | undefined): string[] {
  if (!raw) return ["Mo-Fr 08:00-17:00"];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function parseAddress(raw: string | undefined) {
  if (!raw) return undefined;
  const match = raw.match(/^(.+?),\s*(\d{4,5})\s+(.+)$/);
  if (!match) {
    return { streetAddress: raw, postalCode: "", addressLocality: "", addressCountry: businessDefaults.country };
  }
  return {
    streetAddress: match[1].trim(),
    postalCode: match[2].trim(),
    addressLocality: match[3].trim(),
    addressCountry: businessDefaults.country,
  };
}

function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function LocalBusinessSchema({
  companyName,
  phone,
  email,
  address,
  serviceArea,
  serviceRadiusKm,
  latitude,
  longitude,
  openingHours,
  ratingAverage,
  ratingCount,
  url,
}: SchemaProps) {
  const preset = getActivePreset();

  const businessType = preset.schemaType;

  const postalAddress = parseAddress(address);
  const openings = parseOpeningHours(openingHours);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": businessType,
    name: companyName,
    telephone: phone,
    email,
    url: url ?? businessDefaults.siteUrl,
    priceRange: "$$",
    currenciesAccepted: businessDefaults.currency,
    paymentAccepted: "Cash, Invoice, Bank Transfer, TWINT",
    openingHours: openings,
  };

  if (postalAddress) {
    schema.address = {
      "@type": "PostalAddress",
      ...postalAddress,
    };
  }

  if (latitude && longitude) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      schema.geo = { "@type": "GeoCoordinates", latitude: lat, longitude: lng };

      if (serviceRadiusKm) {
        const radius = Number(serviceRadiusKm);
        if (Number.isFinite(radius) && radius > 0) {
          schema.areaServed = {
            "@type": "GeoCircle",
            geoMidpoint: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
            geoRadius: `${radius * 1000}`,
          };
        }
      }
    }
  }

  if (!schema.areaServed && serviceArea) {
    schema.areaServed = serviceArea
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((locality) => ({ "@type": "City", name: locality }));
  }

  if (ratingAverage && ratingCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingAverage,
      reviewCount: ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  schema.hasOfferCatalog = {
    "@type": "OfferCatalog",
    name: "Leistungen",
    itemListElement: preset.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.description },
      priceCurrency: businessDefaults.currency,
      ...(s.price_from ? { price: s.price_from } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(schema) }}
    />
  );
}
