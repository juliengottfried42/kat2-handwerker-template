# Kat2 Handwerker Template — Setup-Checkliste für neuen Kunden

## 1. Supabase Projekt erstellen
- [ ] Neues Projekt auf [supabase.com](https://supabase.com) anlegen
- [ ] SQL aus `supabase/seed.sql` im SQL-Editor ausführen (erstellt Tabellen + Beispieldaten)
- [ ] Storage Buckets erstellen: `photos`, `gallery`, `assets` (alle public)
- [ ] Project URL, Anon Key und Service Role Key notieren

## 2. Environment Variables konfigurieren
- [ ] `.env.local.example` nach `.env.local` kopieren
- [ ] Alle Werte ausfüllen:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  RESEND_API_KEY=re_...
  GOOGLE_PLACES_API_KEY=AIza...
  GOOGLE_PLACE_ID=ChIJ...
  RECIPIENT_EMAIL=handwerker@example.ch
  ```

## 3. Resend einrichten
- [ ] Account auf [resend.com](https://resend.com) erstellen
- [ ] Kunden-Domain verifizieren (DNS-Einträge setzen)
- [ ] API Key generieren → `RESEND_API_KEY`
- [ ] `FROM_EMAIL` in `.env.local` setzen (z.B. `noreply@kunde-domain.ch`)

## 4. Google Reviews einrichten
- [ ] Google Places API aktivieren in Google Cloud Console
- [ ] API Key erstellen → `GOOGLE_PLACES_API_KEY`
- [ ] Place ID des Kunden-Geschäfts finden → `GOOGLE_PLACE_ID`

## 5. Kundendaten anpassen
- [ ] In Supabase `site_config` Tabelle alle Werte anpassen:
  - `company_name`, `hero_title`, `hero_subtitle`
  - `phone`, `email`, `whatsapp`
  - `about_title`, `about_text`, `about_years`, `about_projects`
- [ ] `services` Tabelle: Leistungen des Kunden eintragen (Titel, Beschreibung, Icon, Richtpreis)
- [ ] `chat_flow` Tabelle: Konfigurator-Fragen an Kunde anpassen
- [ ] Hero-Bild und Logo in Supabase Storage (`assets` Bucket) hochladen

## 6. Legal Pages anpassen
- [ ] `app/(public)/impressum/page.tsx`: Handelsregister-Nr (CHE-xxx) und UID/MWST eintragen
- [ ] `app/(public)/datenschutz/page.tsx`: Auftragsbearbeitungsverträge mit Resend/Supabase prüfen
- [ ] `POLICY_DATE` in datenschutz/page.tsx aktualisieren

## 7. Design anpassen (optional)
- [ ] Farben in `app/globals.css` unter `@theme` anpassen (warm-Palette, Akzentfarbe)
- [ ] Logo austauschen
- [ ] Fonts ändern in `app/layout.tsx` (lokale woff2-Dateien in `public/fonts/`)

## 8. Deployment
- [ ] Git Repo auf GitHub pushen
- [ ] Neues Vercel-Projekt erstellen und mit Repo verbinden
- [ ] Environment Variables in Vercel Dashboard eintragen
- [ ] Custom Domain verbinden
- [ ] Testen: Landingpage, Konfigurator, Admin, E-Mails

## 9. Abschluss-Test
- [ ] Landingpage: Alle Sektionen sichtbar, Bilder laden
- [ ] Konfigurator: Kompletten Flow durchspielen inkl. Foto-Upload
- [ ] E-Mail: Bestätigung an Kunde + Benachrichtigung an Handwerker
- [ ] Admin `/admin`: Anfrage erscheint, Status ändern, Notiz speichern
- [ ] Admin `/admin/inhalte`: Leistung bearbeiten, Chat-Flow anpassen
- [ ] Google Reviews: Bewertungen laden korrekt
- [ ] WhatsApp-Button funktioniert
- [ ] Impressum + Datenschutz: Daten korrekt

---

## Dev-Befehle

```bash
# Entwicklung starten (ohne Supabase — zeigt Demodaten)
npm run dev

# Entwicklung starten (bei Font-Problemen mit Turbopack)
npx next dev --webpack

# TypeScript prüfen
npx tsc --noEmit

# Build testen
npm run build
```

## Projektstruktur

```
app/
  (public)/          → Kundenwebsite (Landingpage, Konfigurator, Legal)
  admin/             → Agentur-Dashboard (Anfragen, Inhalte)
  api/               → API Routes (Anfrage, Upload, Reviews, Admin CRUD)
components/
  landing/           → Landingpage-Sektionen
  konfigurator/      → Chat-Konfigurator Komponenten
  admin/             → Admin-Bereich Komponenten
  ui/                → shadcn/ui Basiskomponenten
lib/
  queries.ts         → Alle Datenbankabfragen
  supabase.ts        → Supabase Client
  resend.ts          → E-Mail-Versand
  fallback-data.ts   → Demo-Daten ohne Supabase
emails/              → React Email Templates
supabase/
  seed.sql           → Datenbankschema + Beispieldaten
```
