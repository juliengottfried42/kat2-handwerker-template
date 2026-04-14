import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/lib/env";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Handwerker Website",
  description: "Professionelle Handwerker-Website mit Anfrage-Konfigurator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans bg-warm-50 text-warm-900 antialiased">
        {children}
      </body>
    </html>
  );
}
