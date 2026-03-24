# Kat2 — Handwerker Website Template (Anfrage Automatisierung)

## Übersicht

Ein flexibles, wiederverwendbares Website-Template für Handwerker (Maler, Gärtner, Elektriker, Umzugsfirmen, Schreiner, Reinigungsfirmen). Preisklasse 799–1499 EUR. Kernfeature: Conversational Anfrage-Konfigurator mit automatisierter E-Mail-Bestätigung.

**Zielgruppe:** Schweizer/deutschsprachige lokale Handwerksbetriebe
**Betriebsmodell:** Agentur-verwaltet — Gottfried Media pflegt Inhalte für den Kunden, kein Kunden-Login

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Postgres DB, Storage, Auth unused)
- **E-Mail:** Resend + React Email Templates
- **Reviews:** Google Places API (server-seitig gecached)
- **Hosting:** Vercel (Free Tier pro Kunde)

## Architektur

Monolith — Kundenwebsite und Agentur-Dashboard in einem Next.js-Projekt.

```
/app
  /(public)/
    page.tsx                → Landingpage (One-Pager)
    konfigurator/page.tsx   → Conversational Anfrage-Konfigurator
    impressum/page.tsx
    datenschutz/page.tsx
  /admin/
    page.tsx                → Anfragen-Übersicht
    anfragen/[id]/page.tsx  → Anfrage-Detail
    inhalte/page.tsx        → Content-Pflege
  /api/
    anfrage/route.ts        → Anfrage speichern + E-Mail senden
    reviews/route.ts        → Google Places API Proxy
    upload/route.ts         → Foto-Upload → Supabase Storage
```

Admin-Bereich ohne Auth — Zugang nur über direkte URL (Agentur-intern). Admin-Routes via `robots.txt` und `noindex` Meta-Tag von Suchmaschinen ausschliessen.

## Landingpage-Sektionen

| # | Sektion | Beschreibung |
|---|---------|-------------|
| 1 | **Hero** | Grosses Bild, Headline, Subline, Google-Rating Badge, CTA → Konfigurator |
| 2 | **Leistungen** | 3–6 Karten mit Icon, Titel, Kurzbeschreibung, "ab CHF X". Konfigurierbar pro Kunde. |
| 3 | **So funktioniert's** | 3 Schritte: Anfrage stellen → Offerte erhalten → Auftrag erledigt |
| 4 | **Vorher/Nachher Galerie** | Slider-Vergleich (Regler hin/her ziehen). 3–6 Projekte. Bilder aus Supabase Storage. |
| 5 | **Google Reviews** | Sterne-Durchschnitt + 3–5 neueste Bewertungen. Live via Places API, server-seitig gecached. |
| 6 | **Über uns** | Foto, Text, Gründungsjahr, Team-Grösse, Kennzahlen |
| 7 | **Kontakt / CTA** | CTA zum Konfigurator + Telefon + E-Mail + WhatsApp |
| 8 | **Footer** | Links, Impressum, Datenschutz |

WhatsApp-Button schwebt als Floating-Element unten rechts auf allen Seiten.

## Conversational Konfigurator

Chat-ähnlicher Flow mit vorgeskriptetem Decision-Tree (kein KI). Nachrichten erscheinen gestaffelt mit Typing-Indikator.

### Flow

```
Bot: "Hallo! Was können wir für Sie tun?"
→ Buttons: [Leistung A] [Leistung B] [Leistung C] [Anderes]

Bot: "Wie gross ist die Fläche ungefähr?"
→ Buttons: [1-2 Zimmer] [3-4 Zimmer] [5+ Zimmer] [Weiss ich nicht]

Bot: "Haben Sie Fotos? Das hilft uns bei der Einschätzung."
→ [Fotos hochladen] [Überspringen]

Bot: "Wann soll's losgehen?"
→ Kalender-Widget für Wunschtermin

Bot: "Richtwert für diesen Auftrag: ab CHF X"
Bot: "Fast geschafft! Wie erreichen wir Sie?"
→ Formularfelder: Name, Telefon, E-Mail, Nachricht (optional)

Bot: "Danke! Ihre Anfrage ist raus. Wir melden uns innert 24h."
→ Bestätigungsmail an Kunde + strukturierte Anfrage an Handwerker
```

### Technische Umsetzung

- Fragen, Antwort-Optionen und Richtpreise als **JSON-Konfiguration** in Supabase (`chat_flow`-Tabelle)
- Pro Kunde anpassbar über Admin-Panel
- Typing-Indikator + gestaffelte Nachrichten-Animation
- Foto-Upload direkt in Supabase Storage
- Am Ende: API-Call → DB-Eintrag + Resend E-Mail

### Richtpreis-Anzeige

Einfache Spanne pro Leistungskategorie ("ab CHF X"), statisch in `services`-Tabelle hinterlegt. Keine dynamische Berechnung.

## Admin-Bereich

### Anfragen-Übersicht (`/admin`)

Tabelle mit: Datum, Name, Leistung, Status (Neu/Beantwortet/Erledigt als Dropdown). Sortiert nach Datum (neuste zuerst), filterbar nach Status.

### Anfrage-Detail (`/admin/anfragen/[id]`)

- Alle Chat-Antworten übersichtlich dargestellt
- Hochgeladene Fotos als Galerie
- Kontaktdaten mit klickbarem Tel/Mail/WhatsApp
- Status ändern + Notizfeld

### Content-Pflege (`/admin/inhalte`)

- **Leistungen:** Titel, Beschreibung, Icon, Richtpreis (CRUD)
- **Chat-Flow:** Fragen und Antwort-Optionen bearbeiten
- **Galerie:** Vorher/Nachher Bilder hochladen/löschen
- **Texte:** Hero-Headline, Über-uns-Text, Kontaktdaten
- **Branding:** Logo, Farben (Primär/Sekundär), Telefon, WhatsApp-Nummer

## Datenmodell (Supabase)

### Tabellen

**`site_config`** — Branding, Texte, Kontaktdaten
- `id` (uuid, PK)
- `key` (text, unique) — z.B. "hero_title", "phone", "primary_color"
- `value` (text)
- `type` (text) — "text" | "image" | "color" | "json"

**`services`** — Leistungen + Richtpreise
- `id` (uuid, PK)
- `title` (text)
- `description` (text)
- `icon` (text) — Emoji oder Icon-Name
- `price_from` (integer, nullable) — Richtpreis in CHF, null = "auf Anfrage"
- `sort_order` (integer)

**`chat_flow`** — Konfigurator Decision-Tree
- `id` (uuid, PK)
- `step_order` (integer)
- `question` (text)
- `options` (jsonb) — Array von {label, value, next_step?}
- `next_step` (integer, nullable) — Default nächster Schritt. Wird verwendet, wenn die gewählte Option kein eigenes `next_step` definiert. Option-Level `next_step` überschreibt Row-Level.
- `show_upload` (boolean, default false)
- `show_calendar` (boolean, default false)

**`inquiries`** — Eingehende Anfragen
- `id` (uuid, PK)
- `name` (text)
- `phone` (text)
- `email` (text)
- `message` (text, nullable)
- `answers` (jsonb) — Alle Chat-Antworten als Key-Value
- `photos` (text[]) — URLs zu Supabase Storage
- `preferred_date` (date, nullable)
- `status` (text) — "neu" | "beantwortet" | "erledigt"
- `notes` (text, nullable) — Interne Notizen
- `created_at` (timestamptz)

**`gallery_items`** — Vorher/Nachher Bilder
- `id` (uuid, PK)
- `title` (text)
- `before_image` (text) — URL
- `after_image` (text) — URL
- `sort_order` (integer)

### Storage Buckets

- `photos` — Kunden-Uploads aus dem Konfigurator
- `gallery` — Vorher/Nachher Projektbilder
- `assets` — Logo, Hero-Bild, sonstige Bilder

## E-Mail-System

Via Resend + React Email Templates, versendet über Next.js API Route (`/api/anfrage`).

| Trigger | Empfänger | Inhalt |
|---------|-----------|--------|
| Neue Anfrage | Kunde | Bestätigung mit Zusammenfassung aller Chat-Antworten |
| Neue Anfrage | Handwerker | Strukturierte Anfrage mit Fotos, Kontaktdaten, Wunschtermin |

## Google Reviews

- Server-seitig via Google Places API
- Gecached: 1x pro Tag aktualisieren (nicht bei jedem Seitenaufruf)
- Cache als JSON in `site_config` (Key: `google_reviews_cache`)
- Fallback: Letzte gecachte Reviews anzeigen bei API-Limit

## Design

**Stil:** Handwerklich-warm
- Erdtöne (warmes Braun, Beige, Creme)
- Grüne Akzentfarbe für CTAs
- Serif-Font für Überschriften (DM Serif Display)
- Sans-Serif für Fliesstext (Inter)
- Abgerundete Ecken, sanfte Schatten
- Organisch, nahbar, vertrauenswürdig

## Externe Abhängigkeiten

| Service | Zweck | Kosten |
|---------|-------|--------|
| Supabase | DB, Storage | Free Tier |
| Resend | E-Mail-Versand | Free bis 100 Mails/Tag |
| Google Places API | Reviews | ~0 bei 1 Request/Tag |
| Vercel | Hosting | Free Tier pro Kunde |

## Nicht im Scope

- Kunden-Login / Auth
- Einsatzgebiet-Anzeige / PLZ-Check
- Lokales SEO Paket (Schema, Meta)
- Notfall-/Express-Anfrage Button
- KI-gestützter Konfigurator
- Dynamische Preisberechnung
- Mehrsprachigkeit
- Zahlungsintegration
