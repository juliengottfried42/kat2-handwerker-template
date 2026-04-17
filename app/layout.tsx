import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/lib/env";
import "./globals.css";
import { getSiteConfig } from "@/lib/queries";
import { businessDefaults, getActivePreset } from "@/lib/config";

const serif = localFont({
  src: "../public/fonts/dm-serif-display-latin.woff2",
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const sans = localFont({
  src: "../public/fonts/inter-latin.woff2",
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const preset = getActivePreset();
  const companyName = config.company_name ?? `${preset.label} Betrieb`;
  const title = config.seo_title ?? `${companyName} — ${preset.label} in Ihrer Region`;
  const description =
    config.seo_description ??
    config.hero_subtitle ??
    preset.hero.subtitle;

  return {
    metadataBase: new URL(businessDefaults.siteUrl),
    title: {
      default: title,
      template: `%s | ${companyName}`,
    },
    description,
    applicationName: companyName,
    authors: [{ name: companyName }],
    generator: "Next.js",
    referrer: "strict-origin-when-cross-origin",
    keywords: [
      preset.label,
      "Handwerker",
      "Offerte",
      "Schweiz",
      ...preset.services.map((s) => s.title),
    ],
    openGraph: {
      type: "website",
      locale: businessDefaults.locale,
      url: businessDefaults.siteUrl,
      siteName: companyName,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: businessDefaults.siteUrl,
    },
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf8f0" },
    { media: "(prefers-color-scheme: dark)", color: "#2d1e0e" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans bg-warm-50 text-warm-900 antialiased">
        {children}
      </body>
    </html>
  );
}
