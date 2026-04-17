# Template Status — Kat2 Handwerker

Iterations-Log. Score = subjektive Produktionsreife (0-100) nach jedem Pass.

## Baseline (vor Iteration 1)

**Build:** pass (Next 16.2.1 Turbopack, 10.6s, 21 Routes)
**TypeScript:** pass (0 errors)
**Score:** 62/100

### Kritische Probleme identifiziert

| # | Problem | Severity |
|---|---------|----------|
| 1 | Upload-API fuer Kunden blockiert wenn ADMIN_PASSWORD_HASH gesetzt (requireAdminApi auf Public-Upload) | P0 |
| 2 | Konfigurator speichert `answers[step.id]` (UUID) statt Fragen-Label → E-Mail zeigt UUIDs | P0 |
| 3 | Keine Mobile-Navigation (`hidden md:flex` ohne Burger-Menu) | P0 |
| 4 | Kein LocalBusiness JSON-LD Schema → SEO-Luecke fuer Handwerker | P0 |
| 5 | Keine Branchen-Presets (nur Maler hardcoded) | P0 |
| 6 | Kein prominenter "Anrufen"-CTA (tel:) in Hero / Sticky-Bar | P1 |
| 7 | `viewport`-Export fehlt (Next 16 best practice) | P1 |
| 8 | Hero hat kein Bild, nur Gradient — Handwerker-Branche braucht Visuals | P1 |
| 9 | Gallery-Slider nutzt `<img>`, nicht `next/image` | P1 |
| 10 | Touch-Targets teilweise < 44px (options: `py-2.5`, opts in konfigurator) | P1 |
| 11 | `SITE_URL` nicht in env-Schema | P2 |
| 12 | `.env.local.example` unvollstaendig (FROM_EMAIL, SITE_URL, kein Kommentar zu ADMIN_PASSWORD_HASH) | P2 |
| 13 | Resend: kein Retry/Backoff bei transienten Fehlern | P2 |
| 14 | `lib/upload.ts` nicht benutzt, dupliziert Logik | P2 |
| 15 | OG-Image fehlt (Social-Sharing generic) | P2 |

Iterationen folgen unten.

---

## Iteration 1 — P0 Bugs + Branchen-Presets

**Score:** 72/100

### Done
- P0 Fix: Upload-API entkoppelt von Admin-Auth (Public-Konfigurator kann jetzt Fotos hochladen, auch bei aktivem ADMIN_PASSWORD_HASH)
- P0 Fix: Upload-API mit Rate-Limit (15/Min pro IP), cacheControl-Header, Demo-Mode 503-Response
- P0 Fix: Konfigurator speichert Frage-Label (`currentStep.question`) statt UUID als answers-Key → E-Mail zeigt lesbare Fragen
- P0 Feature: `lib/config.ts` mit Branchen-Presets fuer Elektriker, Sanitaer, Maler, Schreiner (je Services, Chat-Flow, Hero, CTA)
- `lib/fallback-data.ts` nutzt Preset aus `NEXT_PUBLIC_BRANCHE`
- `lib/env.ts` erweitert (FROM_EMAIL, RECIPIENT_EMAIL, SITE_URL, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_BRANCHE, GOOGLE_PLACE_ID)
- `.env.local.example` dokumentiert alle Variablen mit Beschreibung

### Verification
- `npx tsc --noEmit`: 0 Fehler

---

## Iteration 2 — SEO, Mobile-Navigation, prominenter Anrufen-CTA

**Score:** 82/100

### Done
- `components/seo/local-business-schema.tsx` mit JSON-LD Schema (Electrician/Plumber/HousePainter/GeneralContractor), AreaServed als GeoCircle oder City-Liste, AggregateRating (wenn Reviews da), OfferCatalog mit allen Services
- XSS-sicher: JSON-LD escaped `<`, `>`, `&`, U+2028, U+2029
- Root-Layout: `generateMetadata` mit Title-Template, OpenGraph, Twitter Cards, Keywords, Locale `de-CH`, metadataBase
- Viewport-Export separat (Next.js 16 best practice) mit maximumScale=5, themeColor light/dark
- Public-Layout: Skip-Link verbessert, Logo in sticky Nav mit Backdrop-Blur, Desktop-Nav mit prominenter Telefonnummer und Konfigurator-Button, Mobile-Nav-Komponente (Burger → Full-Screen Drawer)
- `MobileNav`: Body-Scroll-Lock, 48px Touch-Targets, Safe-Area-Inset unten
- `MobileCTABar`: Sticky Bottom-Bar (Anrufen | WhatsApp | Anfragen), 60px min-height, `env(safe-area-inset-bottom)`
- Hero: Badge konfigurierbar, Dual-CTA (Anfrage + tel:), Vorteils-Liste, Backdrop-Overlay fuer optionales Hero-Image
- About: `next/image` vermieden (Remote-Image ohne Config), semantische `<dl>/<dt>/<dd>` Stats
- HowItWorks: semantische `<ol>`, Branchen-Labels
- Footer: drei Spalten mit Kontakt, zweimal sticky keyword, tel:/mailto:
- Sitemap + robots.ts nutzen `businessDefaults.siteUrl`, `public/robots.txt` entfernt (war doppelt)

### Verification
- `npm run build`: pass (Next 16.2.1, 21 Routes)


