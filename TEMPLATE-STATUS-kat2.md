# Template Status — Kat2 Handwerker

Stand: 2026-04-17 — Score 92/100

## Iterationen (1-10)

| # | Fokus | Status |
|---|-------|--------|
| 1 | Baseline SEO Schema + Mobile Nav + Call CTA | commit 6d32efc |
| 2 | Upload access, answer labels, branche presets | commit 416097c |
| 3 | Chat Demo-Mode Banner, Upload-Fehler, Reviews API demo-safe | commit 29f8e39 |
| 4 | Resend retry (exp backoff), demo-safe fallbacks | commit 8154b63 |
| 5 | SEO: robots, OG image, keyword-Boost per Service-Area | commit afcf4c1 |
| 6 | A11y: Gallery-Slider Keyboard + 48px Touch-Target | commit 67f02ca |
| 7 | Performance: AVIF/WebP, remotePatterns, Hero-Preload | commit cda9649 |
| 8 | Config: `emergency24h` + typed `schemaType` pro Preset | commit 424fea9 |
| 9 | Emergency 24h tel:-CTA im Hero (Elektriker/Sanitaer) | commit d855539 |
| 10 | Build-Verifikation (Next.js 16.2.1 Turbopack) | ok |

## Kernmerkmale

- **Next.js 16.2.1** + React 19.2.4, Turbopack Build ok
- **Demo-Mode**: Ohne Supabase/Resend lauffaehig — Fallback-Daten, kein API-Crash
- **Prod-Mode**: Supabase + Resend mit Retry/Backoff (3 Versuche, 1s/2s/4s, 401 abort)
- **Mobile-First**: Sticky CTA-Bar, Mobile-Nav Drawer, Touch-Targets >=48px
- **SEO**: LocalBusiness Schema (Electrician/Plumber/HousePainter/GeneralContractor), Service-Area als GeoCircle oder City-Array, AggregateRating, OfferCatalog, sitemap, robots, OG
- **A11y**: skip-link, ARIA live-region Chat, Slider role+keyboard, focus-visible ring ueberall, aria-labels
- **Performance**: Image formats AVIF/WebP, Hero preload fetchPriority=high, static+immutable Cache fuer Assets, Font local woff2 mit display:swap
- **Security Headers**: X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy

## Branchen-Presets

- elektriker (emergency24h) — Electrician, blau
- sanitaer (emergency24h) — Plumber, hellblau
- maler — HousePainter, gruen
- schreiner — GeneralContractor, braun

`NEXT_PUBLIC_BRANCHE` schaltet Preset. Fallback: `maler`.

## Env Vars

| Pflicht (Prod) | Optional |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | GOOGLE_PLACES_API_KEY |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | GOOGLE_PLACE_ID |
| SUPABASE_SERVICE_ROLE_KEY | NEXT_PUBLIC_BRANCHE |
| RESEND_API_KEY | SITE_URL |
| FROM_EMAIL | ADMIN_PASSWORD_HASH |
| RECIPIENT_EMAIL | |

## Offene Punkte (Post-MVP)

- Lighthouse-Benchmark in CI automatisieren
- `next/image` fuer Gallery-Before/After (Slider-Logik anpassen)
- Video-Hero Option
- Service-Detail-Seiten pro Leistung (deep SEO)
- i18n fr-CH/it-CH via route groups
