# Kat2 Handwerker Website Template — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable Next.js website template for tradespeople with a conversational inquiry configurator, admin dashboard, and warm handcraft design.

**Architecture:** Monolith Next.js app with public website (Landingpage + Konfigurator), admin area (Anfragen + Content-Pflege), and API routes (inquiry submission, photo upload, Google Reviews proxy). Supabase for DB + Storage, Resend for email.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase, Resend, React Email, Google Places API

---

## File Structure

```
kat2-templates/
├── app/
│   ├── layout.tsx                          # Root layout + fonts + metadata
│   ├── globals.css                         # Tailwind + custom design tokens
│   ├── (public)/
│   │   ├── page.tsx                        # Landingpage (all sections)
│   │   ├── konfigurator/
│   │   │   └── page.tsx                    # Konfigurator page wrapper
│   │   ├── impressum/
│   │   │   └── page.tsx                    # Impressum
│   │   └── datenschutz/
│   │       └── page.tsx                    # Datenschutz
│   ├── admin/
│   │   ├── layout.tsx                      # Admin layout (noindex meta)
│   │   ├── page.tsx                        # Anfragen-Übersicht
│   │   ├── anfragen/
│   │   │   └── [id]/
│   │   │       └── page.tsx               # Anfrage-Detail
│   │   └── inhalte/
│   │       └── page.tsx                    # Content-Pflege
│   └── api/
│       ├── anfrage/
│       │   └── route.ts                    # POST: save inquiry + send emails
│       ├── reviews/
│       │   └── route.ts                    # GET: Google Reviews proxy + cache
│       └── upload/
│           └── route.ts                    # POST: photo upload to Supabase
├── components/
│   ├── landing/
│   │   ├── hero.tsx                        # Hero section
│   │   ├── services.tsx                    # Leistungen grid
│   │   ├── how-it-works.tsx               # 3-step process
│   │   ├── gallery.tsx                     # Vorher/Nachher slider gallery
│   │   ├── gallery-slider.tsx             # Single slider component (client)
│   │   ├── reviews.tsx                     # Google Reviews section
│   │   ├── about.tsx                       # Über uns section
│   │   ├── cta.tsx                         # Contact CTA section
│   │   └── footer.tsx                      # Footer
│   ├── konfigurator/
│   │   ├── chat-container.tsx             # Chat UI wrapper (client)
│   │   ├── chat-message.tsx               # Single message bubble
│   │   ├── chat-options.tsx               # Button options for answers
│   │   ├── chat-photo-upload.tsx          # Photo upload step
│   │   ├── chat-calendar.tsx              # Date picker step
│   │   ├── chat-contact-form.tsx          # Final contact form
│   │   └── chat-engine.ts                # Decision-tree state machine
│   ├── admin/
│   │   ├── inquiry-table.tsx              # Anfragen table (client)
│   │   ├── inquiry-detail.tsx             # Detail view
│   │   ├── content-editor.tsx             # Content-Pflege tabs
│   │   ├── services-editor.tsx            # CRUD for services
│   │   ├── chat-flow-editor.tsx           # Edit chat questions/options
│   │   └── gallery-editor.tsx             # Upload/delete gallery images
│   ├── ui/                                 # shadcn/ui components (as needed)
│   └── whatsapp-button.tsx                # Floating WhatsApp button
├── lib/
│   ├── supabase.ts                        # Supabase client (server + browser)
│   ├── queries.ts                         # DB query functions
│   ├── upload.ts                          # File upload helper
│   └── resend.ts                          # Email send helper
├── emails/
│   ├── inquiry-confirmation.tsx           # Customer confirmation email
│   └── inquiry-notification.tsx           # Tradesperson notification email
├── supabase/
│   └── seed.sql                           # Schema + seed data (Maler example)
├── public/
│   └── robots.txt                         # Disallow /admin
├── .env.local.example                     # Required env vars template
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Task 1: Project Setup + Design Tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`
- Create: `app/globals.css`, `app/layout.tsx`
- Create: `.env.local.example`, `public/robots.txt`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd C:/Users/julie/projects
npx create-next-app@latest kat2-templates --typescript --tailwind --eslint --app --src=false --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Install dependencies**

```bash
cd C:/Users/julie/projects/kat2-templates
npm install @supabase/supabase-js resend react-email @react-email/components
npm install -D @types/node
```

- [ ] **Step 3: Init shadcn/ui**

```bash
npx shadcn@latest init
```

Select: New York style, Zinc base color, CSS variables.

- [ ] **Step 4: Add shadcn components needed**

```bash
npx shadcn@latest add button card input textarea select table badge tabs dialog dropdown-menu calendar
```

- [ ] **Step 5: Create design tokens in `app/globals.css`**

Replace default content with warm-handcraft theme tokens:

```css
@import "tailwindcss";

@theme {
  --color-warm-50: #fdf8f0;
  --color-warm-100: #f5ead6;
  --color-warm-200: #e8d5b0;
  --color-warm-300: #d4b886;
  --color-warm-400: #c49a5c;
  --color-warm-500: #a67c3c;
  --color-warm-600: #8b6330;
  --color-warm-700: #6b4a24;
  --color-warm-800: #4a3218;
  --color-warm-900: #2d1e0e;
  --color-green-600: #4a7c59;
  --color-green-700: #3a6347;
  --font-serif: "DM Serif Display", serif;
  --font-sans: "Inter", sans-serif;
}
```

- [ ] **Step 6: Set up root layout with fonts**

Update `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
```

- [ ] **Step 7: Create `public/robots.txt`**

```
User-agent: *
Disallow: /admin
```

- [ ] **Step 8: Create `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
RECIPIENT_EMAIL=
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on localhost:3000 without errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with design tokens and warm-handcraft theme"
```

---

## Task 2: Supabase Schema + Lib Layer

**Files:**
- Create: `supabase/seed.sql`
- Create: `lib/supabase.ts`, `lib/queries.ts`, `lib/upload.ts`, `lib/resend.ts`

- [ ] **Step 1: Create Supabase schema SQL**

Create `supabase/seed.sql`:

```sql
-- Site Config
create table site_config (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  type text not null default 'text'
);

-- Services
create table services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  icon text not null default '🔧',
  price_from integer,
  sort_order integer not null default 0
);

-- Chat Flow
create table chat_flow (
  id uuid default gen_random_uuid() primary key,
  step_order integer not null,
  question text not null,
  options jsonb not null default '[]',
  next_step integer,
  show_upload boolean not null default false,
  show_calendar boolean not null default false
);

-- Inquiries
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  email text not null,
  message text,
  answers jsonb not null default '{}',
  photos text[] not null default '{}',
  preferred_date date,
  status text not null default 'neu',
  notes text,
  created_at timestamptz not null default now()
);

-- Gallery Items
create table gallery_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  before_image text not null,
  after_image text not null,
  sort_order integer not null default 0
);

-- Seed: Example Maler data
insert into site_config (key, value, type) values
  ('hero_title', 'Ihr Maler in Zürich und Umgebung', 'text'),
  ('hero_subtitle', 'Professionelle Malerarbeiten mit Herzblut. Von der Wohnungsrenovation bis zur Fassadengestaltung.', 'text'),
  ('company_name', 'Malermeister Brunner', 'text'),
  ('phone', '076 123 45 67', 'text'),
  ('email', 'info@maler-brunner.ch', 'text'),
  ('whatsapp', '41761234567', 'text'),
  ('about_title', 'Malermeister mit Leidenschaft', 'text'),
  ('about_text', 'Seit 2008 verschönern wir Zürich — Wohnung für Wohnung, Fassade für Fassade. Als Familienbetrieb stehen wir für persönliche Betreuung und handwerkliche Qualität.', 'text'),
  ('about_years', '15+', 'text'),
  ('about_projects', '800+', 'text'),
  ('google_reviews_cache', '{}', 'json');

insert into services (title, description, icon, price_from, sort_order) values
  ('Innenanstrich', 'Wände, Decken, Türen und Fensterrahmen — frische Farbe für Ihr Zuhause.', '🎨', 800, 1),
  ('Fassadengestaltung', 'Wetterfeste Anstriche und kreative Fassadengestaltung.', '🏠', 3500, 2),
  ('Tapezierarbeiten', 'Von klassisch bis modern — wir tapezieren mit Präzision.', '✨', 600, 3),
  ('Spachtelarbeiten', 'Glatte Wände, perfekte Oberflächen.', '🔨', 500, 4),
  ('Holzschutz', 'Lasuren, Lacke und Öle für Ihre Holzflächen.', '🪵', 400, 5),
  ('Gewerbe & Büro', 'Professionelle Malerarbeiten für Geschäftsräume.', '🏢', null, 6);

insert into chat_flow (step_order, question, options, next_step, show_upload, show_calendar) values
  (1, 'Hallo! Was können wir für Sie tun?',
   '[{"label":"Innenanstrich","value":"innenanstrich"},{"label":"Fassade","value":"fassade"},{"label":"Tapezieren","value":"tapezieren"},{"label":"Anderes","value":"anderes"}]',
   2, false, false),
  (2, 'Wie gross ist die Fläche ungefähr?',
   '[{"label":"1-2 Zimmer","value":"1-2"},{"label":"3-4 Zimmer","value":"3-4"},{"label":"5+ Zimmer","value":"5+"},{"label":"Weiss ich nicht","value":"unbekannt"}]',
   3, false, false),
  (3, 'Haben Sie Fotos? Das hilft uns bei der Einschätzung.',
   '[{"label":"Fotos hochladen","value":"upload"},{"label":"Überspringen","value":"skip"}]',
   4, true, false),
  (4, 'Wann soll''s losgehen?',
   '[]',
   5, false, true),
  (5, 'Fast geschafft! Wie erreichen wir Sie?',
   '[]',
   null, false, false);
```

- [ ] **Step 2: Run schema in Supabase**

Go to Supabase Dashboard → SQL Editor → paste and run `seed.sql`.
Also create Storage Buckets: `photos`, `gallery`, `assets` (all public).

- [ ] **Step 3: Create Supabase client**

Create `lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function supabaseAdmin() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

- [ ] **Step 4: Create query helpers**

Create `lib/queries.ts`:

```typescript
import { supabase, supabaseAdmin } from "./supabase";

export async function getSiteConfig() {
  const { data } = await supabase
    .from("site_config")
    .select("key, value, type");
  if (!data) return {};
  return Object.fromEntries(data.map((r) => [r.key, r.value]));
}

export async function getServices() {
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getChatFlow() {
  const { data } = await supabase
    .from("chat_flow")
    .select("*")
    .order("step_order");
  return data ?? [];
}

export async function getGalleryItems() {
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getInquiries(status?: string) {
  let query = supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return data ?? [];
}

export async function getInquiry(id: string) {
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function createInquiry(inquiry: {
  name: string;
  phone: string;
  email: string;
  message?: string;
  answers: Record<string, string>;
  photos: string[];
  preferred_date?: string;
}) {
  const { data, error } = await supabaseAdmin()
    .from("inquiries")
    .insert(inquiry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateInquiry(id: string, updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin()
    .from("inquiries")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

// --- Admin CRUD helpers ---

export async function upsertService(service: {
  id?: string;
  title: string;
  description: string;
  icon: string;
  price_from: number | null;
  sort_order: number;
}) {
  const { error } = await supabaseAdmin()
    .from("services")
    .upsert(service);
  if (error) throw error;
}

export async function deleteService(id: string) {
  const { error } = await supabaseAdmin()
    .from("services")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function upsertChatStep(step: {
  id?: string;
  step_order: number;
  question: string;
  options: { label: string; value: string; next_step?: number }[];
  next_step: number | null;
  show_upload: boolean;
  show_calendar: boolean;
}) {
  const { error } = await supabaseAdmin()
    .from("chat_flow")
    .upsert(step);
  if (error) throw error;
}

export async function deleteChatStep(id: string) {
  const { error } = await supabaseAdmin()
    .from("chat_flow")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function upsertGalleryItem(item: {
  id?: string;
  title: string;
  before_image: string;
  after_image: string;
  sort_order: number;
}) {
  const { error } = await supabaseAdmin()
    .from("gallery_items")
    .upsert(item);
  if (error) throw error;
}

export async function deleteGalleryItem(id: string) {
  const { error } = await supabaseAdmin()
    .from("gallery_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function updateSiteConfig(key: string, value: string) {
  const { error } = await supabaseAdmin()
    .from("site_config")
    .update({ value })
    .eq("key", key);
  if (error) throw error;
}
```

- [ ] **Step 5: Create upload helper**

Create `lib/upload.ts`:

```typescript
import { supabaseAdmin } from "./supabase";

export async function uploadPhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin()
    .storage
    .from("photos")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabaseAdmin()
    .storage
    .from("photos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
```

- [ ] **Step 6: Create email helper**

Create `lib/resend.ts`:

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryConfirmation(to: string, data: {
  name: string;
  answers: Record<string, string>;
  preferredDate?: string;
}) {
  await resend.emails.send({
    from: "Anfrage <noreply@gottfriedmedia.ch>",
    to,
    subject: "Ihre Anfrage ist eingegangen",
    html: `
      <h2>Danke für Ihre Anfrage, ${data.name}!</h2>
      <p>Wir haben Ihre Anfrage erhalten und melden uns innert 24 Stunden.</p>
      <h3>Ihre Angaben:</h3>
      <ul>${Object.entries(data.answers).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}</ul>
      ${data.preferredDate ? `<p><strong>Wunschtermin:</strong> ${data.preferredDate}</p>` : ""}
    `,
  });
}

export async function sendInquiryNotification(data: {
  name: string;
  phone: string;
  email: string;
  message?: string;
  answers: Record<string, string>;
  photos: string[];
  preferredDate?: string;
}) {
  const recipientEmail = process.env.RECIPIENT_EMAIL!;
  await resend.emails.send({
    from: "Website <noreply@gottfriedmedia.ch>",
    to: recipientEmail,
    subject: `Neue Anfrage von ${data.name}`,
    html: `
      <h2>Neue Anfrage</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>E-Mail:</strong> ${data.email}</p>
      ${data.message ? `<p><strong>Nachricht:</strong> ${data.message}</p>` : ""}
      ${data.preferredDate ? `<p><strong>Wunschtermin:</strong> ${data.preferredDate}</p>` : ""}
      <h3>Antworten:</h3>
      <ul>${Object.entries(data.answers).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}</ul>
      ${data.photos.length > 0 ? `<h3>Fotos:</h3>${data.photos.map((url) => `<p><a href="${url}">${url}</a></p>`).join("")}` : ""}
    `,
  });
}
```

- [ ] **Step 7: Commit**

```bash
git add supabase/seed.sql lib/
git commit -m "feat: add Supabase schema, seed data, and lib layer (queries, upload, email)"
```

---

## Task 3: Landingpage — Hero + Leistungen + So funktioniert's

**Files:**
- Create: `components/landing/hero.tsx`
- Create: `components/landing/services.tsx`
- Create: `components/landing/how-it-works.tsx`
- Create: `components/whatsapp-button.tsx`
- Modify: `app/(public)/page.tsx`

- [ ] **Step 1: Create Hero component**

Create `components/landing/hero.tsx`:

```tsx
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  companyName: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-warm-800 to-warm-700">
      <div className="relative px-6 md:px-12 py-20 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm text-warm-200 backdrop-blur-sm mb-6">
          ⭐ Bestbewertet auf Google
        </div>
        <h1 className="font-serif text-4xl md:text-6xl text-warm-100 leading-tight mb-5">
          {title}
        </h1>
        <p className="text-lg text-warm-200 mb-9 max-w-lg">
          {subtitle}
        </p>
        <Link
          href="/konfigurator"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-9 py-4 rounded-xl text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Kostenlose Anfrage starten →
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Services component**

Create `components/landing/services.tsx`:

```tsx
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price_from: number | null;
}

export function Services({ services }: { services: Service[] }) {
  return (
    <section className="py-20 px-6 md:px-12 bg-white" id="leistungen">
      <h2 className="font-serif text-4xl text-center text-warm-800 mb-3">
        Unsere Leistungen
      </h2>
      <p className="text-center text-warm-600 mb-12">
        Qualität, die man sieht
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-warm-50 border border-warm-100 rounded-2xl p-8 text-center hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 bg-warm-200 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
              {s.icon}
            </div>
            <h3 className="text-lg font-semibold text-warm-800 mb-2">{s.title}</h3>
            <p className="text-sm text-warm-600 mb-3">{s.description}</p>
            <div className="font-semibold text-green-600">
              {s.price_from ? `ab CHF ${s.price_from.toLocaleString("de-CH")}` : "auf Anfrage"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create HowItWorks component**

Create `components/landing/how-it-works.tsx`:

```tsx
const steps = [
  { number: 1, title: "Anfrage stellen", desc: "Erzählen Sie uns in unserem Chat, was Sie brauchen. Fotos helfen bei der Einschätzung." },
  { number: 2, title: "Offerte erhalten", desc: "Wir melden uns innert 24h mit einer unverbindlichen Offerte." },
  { number: 3, title: "Auftrag erledigt", desc: "Wir kommen zum vereinbarten Termin und liefern Qualitätsarbeit." },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-6 md:px-12 bg-warm-50">
      <h2 className="font-serif text-4xl text-center text-warm-800 mb-3">
        So einfach geht&apos;s
      </h2>
      <p className="text-center text-warm-600 mb-12">
        In 3 Schritten zu Ihrem Auftrag
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-12 max-w-4xl mx-auto">
        {steps.map((s) => (
          <div key={s.number} className="text-center flex-1">
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {s.number}
            </div>
            <h3 className="text-lg font-semibold text-warm-800 mb-2">{s.title}</h3>
            <p className="text-sm text-warm-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create WhatsApp floating button**

Create `components/whatsapp-button.tsx`:

```tsx
"use client";

interface WhatsAppButtonProps {
  number: string;
}

export function WhatsAppButton({ number }: WhatsAppButtonProps) {
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-7 right-7 w-15 h-15 bg-[#25d366] rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:scale-110 transition-transform z-50"
      aria-label="WhatsApp"
    >
      💬
    </a>
  );
}
```

- [ ] **Step 5: Create Landingpage with first 3 sections**

Update `app/(public)/page.tsx`:

```tsx
import { getSiteConfig, getServices } from "@/lib/queries";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default async function Home() {
  const config = await getSiteConfig();
  const services = await getServices();

  return (
    <main>
      <Hero
        title={config.hero_title}
        subtitle={config.hero_subtitle}
        companyName={config.company_name}
      />
      <Services services={services} />
      <HowItWorks />
      <WhatsAppButton number={config.whatsapp} />
    </main>
  );
}
```

- [ ] **Step 6: Verify page renders**

```bash
npm run dev
```

Open localhost:3000 — Hero, Leistungen, and So funktioniert's should render.

- [ ] **Step 7: Commit**

```bash
git add components/landing/ components/whatsapp-button.tsx app/\(public\)/page.tsx
git commit -m "feat: add Hero, Services, HowItWorks sections and WhatsApp button"
```

---

## Task 4: Landingpage — Gallery + Reviews + About + CTA + Footer

**Files:**
- Create: `components/landing/gallery.tsx`, `components/landing/gallery-slider.tsx`
- Create: `components/landing/reviews.tsx`
- Create: `components/landing/about.tsx`
- Create: `components/landing/cta.tsx`, `components/landing/footer.tsx`
- Create: `app/(public)/layout.tsx`
- Modify: `app/(public)/page.tsx`

- [ ] **Step 1: Create Vorher/Nachher Slider component**

Create `components/landing/gallery-slider.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";

interface GallerySliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
}

export function GallerySlider({ beforeImage, afterImage, title }: GallerySliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);

  function handleMove(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-col-resize select-none"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      aria-label={`Vorher/Nachher: ${title}`}
    >
      {/* After (full background) */}
      <img src={afterImage} alt={`${title} nachher`} className="absolute inset-0 w-full h-full object-cover" />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
        <img src={beforeImage} alt={`${title} vorher`} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current?.offsetWidth }} />
      </div>
      {/* Slider line + handle */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10" style={{ left: `${sliderPos}%` }} />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center text-sm shadow-lg z-20"
        style={{ left: `${sliderPos}%` }}
      >
        ↔
      </div>
      <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/50 px-2.5 py-1 rounded-md z-10">Vorher</span>
      <span className="absolute bottom-3 right-3 text-xs font-semibold text-white bg-black/50 px-2.5 py-1 rounded-md z-10">Nachher</span>
    </div>
  );
}
```

- [ ] **Step 2: Create Gallery section**

Create `components/landing/gallery.tsx`:

```tsx
import { GallerySlider } from "./gallery-slider";

interface GalleryItem {
  id: string;
  title: string;
  before_image: string;
  after_image: string;
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="py-20 px-6 md:px-12 bg-white" id="galerie">
      <h2 className="font-serif text-4xl text-center text-warm-800 mb-3">Unsere Arbeiten</h2>
      <p className="text-center text-warm-600 mb-12">Vorher/Nachher — sehen Sie den Unterschied</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item) => (
          <GallerySlider key={item.id} beforeImage={item.before_image} afterImage={item.after_image} title={item.title} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create Reviews section**

Create `components/landing/reviews.tsx`:

```tsx
interface Review {
  author_name: string;
  rating: number;
  text: string;
}

interface ReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function Reviews({ reviews, averageRating, totalReviews }: ReviewsProps) {
  return (
    <section className="py-20 px-6 md:px-12 bg-warm-50" id="bewertungen">
      <h2 className="font-serif text-4xl text-center text-warm-800 mb-3">Was unsere Kunden sagen</h2>
      <div className="text-center mb-8">
        <div className="text-3xl text-amber-500 tracking-widest">{"★".repeat(Math.round(averageRating))}</div>
        <p className="text-sm text-warm-600 mt-1">{averageRating} von 5 — basierend auf {totalReviews} Google-Bewertungen</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reviews.slice(0, 5).map((r, i) => (
          <div key={i} className="bg-white rounded-2xl p-7 shadow-sm">
            <div className="text-amber-500 text-sm mb-3">{"★".repeat(r.rating)}</div>
            <p className="text-sm text-warm-800 italic leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
            <div className="text-sm font-semibold text-warm-600">{r.author_name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create About section**

Create `components/landing/about.tsx`:

```tsx
interface AboutProps {
  title: string;
  text: string;
  years: string;
  projects: string;
}

export function About({ title, text, years, projects }: AboutProps) {
  return (
    <section className="py-20 px-6 md:px-12 bg-white" id="ueber">
      <div className="flex flex-col md:flex-row gap-12 max-w-4xl mx-auto items-center">
        <div className="w-72 h-80 bg-warm-200 rounded-2xl flex-shrink-0 flex items-center justify-center text-warm-500 text-sm">
          📷 Foto
        </div>
        <div>
          <h3 className="font-serif text-3xl text-warm-800 mb-4">{title}</h3>
          <p className="text-warm-600 mb-6 leading-relaxed">{text}</p>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="font-serif text-3xl text-green-600">{years}</div>
              <div className="text-xs text-warm-600">Jahre Erfahrung</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-green-600">{projects}</div>
              <div className="text-xs text-warm-600">Projekte</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create CTA section**

Create `components/landing/cta.tsx`:

```tsx
import Link from "next/link";

interface CTAProps {
  phone: string;
  email: string;
}

export function CTA({ phone, email }: CTAProps) {
  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-warm-700 to-green-700 text-center" id="kontakt">
      <h2 className="font-serif text-4xl text-warm-100 mb-4">Bereit für frische Farbe?</h2>
      <p className="text-warm-200 mb-8">Starten Sie jetzt Ihre kostenlose Anfrage — wir melden uns innert 24 Stunden.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/konfigurator" className="inline-block bg-green-600 hover:bg-green-700 text-white px-9 py-4 rounded-xl font-semibold transition-all">
          Anfrage starten →
        </Link>
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 bg-white/10 text-warm-100 px-7 py-4 rounded-xl border border-white/15 hover:bg-white/20 transition-all">
          📞 {phone}
        </a>
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 bg-white/10 text-warm-100 px-7 py-4 rounded-xl border border-white/15 hover:bg-white/20 transition-all">
          ✉️ {email}
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create Footer**

Create `components/landing/footer.tsx`:

```tsx
import Link from "next/link";

export function Footer({ companyName }: { companyName: string }) {
  return (
    <footer className="bg-warm-900 text-warm-300 py-10 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
      <div>© {new Date().getFullYear()} {companyName}</div>
      <div className="flex gap-6">
        <Link href="/impressum" className="hover:text-warm-100 transition-colors">Impressum</Link>
        <Link href="/datenschutz" className="hover:text-warm-100 transition-colors">Datenschutz</Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Create public layout with Navbar**

Create `app/(public)/layout.tsx`:

```tsx
import Link from "next/link";
import { getSiteConfig } from "@/lib/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  return (
    <>
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white shadow-sm sticky top-0 z-50">
        <Link href="/" className="font-serif text-xl text-warm-700">
          {config.company_name}
        </Link>
        <ul className="hidden md:flex items-center gap-7">
          <li><a href="#leistungen" className="text-sm font-medium text-warm-600 hover:text-warm-500">Leistungen</a></li>
          <li><a href="#galerie" className="text-sm font-medium text-warm-600 hover:text-warm-500">Arbeiten</a></li>
          <li><a href="#bewertungen" className="text-sm font-medium text-warm-600 hover:text-warm-500">Bewertungen</a></li>
          <li><a href="#ueber" className="text-sm font-medium text-warm-600 hover:text-warm-500">Über uns</a></li>
          <li>
            <Link href="/konfigurator" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Jetzt anfragen
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
}
```

- [ ] **Step 8: Update page.tsx with all sections**

Update `app/(public)/page.tsx` to include Gallery, Reviews, About, CTA, and Footer — importing from `@/lib/queries` and passing data from `getSiteConfig()`, `getGalleryItems()`.

For Reviews: parse `config.google_reviews_cache` as JSON. If empty, show placeholder data.

- [ ] **Step 9: Verify full page renders**

```bash
npm run dev
```

All 8 sections should render on localhost:3000.

- [ ] **Step 10: Commit**

```bash
git add components/landing/ app/\(public\)/
git commit -m "feat: complete Landingpage with Gallery, Reviews, About, CTA, Footer, and Navbar"
```

---

## Task 5: Conversational Konfigurator

**Files:**
- Create: `components/konfigurator/chat-engine.ts`
- Create: `components/konfigurator/chat-container.tsx`
- Create: `components/konfigurator/chat-message.tsx`
- Create: `components/konfigurator/chat-options.tsx`
- Create: `components/konfigurator/chat-photo-upload.tsx`
- Create: `components/konfigurator/chat-calendar.tsx`
- Create: `components/konfigurator/chat-contact-form.tsx`
- Create: `app/(public)/konfigurator/page.tsx`

- [ ] **Step 1: Create chat engine (decision-tree state machine)**

Create `components/konfigurator/chat-engine.ts`:

```typescript
export interface ChatStep {
  id: string;
  step_order: number;
  question: string;
  options: { label: string; value: string; next_step?: number }[];
  next_step: number | null;
  show_upload: boolean;
  show_calendar: boolean;
}

export interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  currentStep: number;
  answers: Record<string, string>;
  photos: string[];
  preferredDate: string | null;
  isComplete: boolean;
  isTyping: boolean;
}

export function getInitialState(): ChatState {
  return {
    messages: [],
    currentStep: 1,
    answers: {},
    photos: [],
    preferredDate: null,
    isComplete: false,
    isTyping: false,
  };
}

export function findStep(steps: ChatStep[], stepOrder: number): ChatStep | undefined {
  return steps.find((s) => s.step_order === stepOrder);
}

export function getNextStepOrder(step: ChatStep, selectedValue?: string): number | null {
  if (selectedValue) {
    const option = step.options.find((o) => o.value === selectedValue);
    if (option?.next_step !== undefined) return option.next_step;
  }
  return step.next_step;
}

export function createBotMessage(text: string): ChatMessage {
  return { id: crypto.randomUUID(), type: "bot", text, timestamp: Date.now() };
}

export function createUserMessage(text: string): ChatMessage {
  return { id: crypto.randomUUID(), type: "user", text, timestamp: Date.now() };
}
```

- [ ] **Step 2: Create ChatMessage component**

Create `components/konfigurator/chat-message.tsx`:

```tsx
interface ChatMessageProps {
  type: "bot" | "user";
  text: string;
}

export function ChatMessageBubble({ type, text }: ChatMessageProps) {
  return (
    <div className={`flex ${type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
        type === "bot"
          ? "bg-warm-100 text-warm-800 rounded-bl-sm"
          : "bg-green-600 text-white rounded-br-sm"
      }`}>
        {text}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-warm-100 px-5 py-3 rounded-2xl rounded-bl-sm flex gap-1.5">
        <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ChatOptions component**

Create `components/konfigurator/chat-options.tsx`:

```tsx
interface ChatOptionsProps {
  options: { label: string; value: string }[];
  onSelect: (value: string, label: string) => void;
}

export function ChatOptions({ options, onSelect }: ChatOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value, opt.label)}
          className="px-5 py-2.5 bg-white border border-warm-200 rounded-full text-sm font-medium text-warm-700 hover:bg-warm-100 hover:border-warm-300 transition-all"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create ChatPhotoUpload component**

Create `components/konfigurator/chat-photo-upload.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";

interface ChatPhotoUploadProps {
  onUpload: (urls: string[]) => void;
  onSkip: () => void;
}

export function ChatPhotoUpload({ onUpload, onSkip }: ChatPhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    setUploading(false);
    onUpload(urls);
  }

  return (
    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="px-5 py-2.5 bg-white border border-warm-200 rounded-full text-sm font-medium text-warm-700 hover:bg-warm-100 transition-all disabled:opacity-50"
      >
        {uploading ? "Wird hochgeladen..." : "📷 Fotos hochladen"}
      </button>
      <button
        onClick={onSkip}
        disabled={uploading}
        className="px-5 py-2.5 bg-white border border-warm-200 rounded-full text-sm font-medium text-warm-700 hover:bg-warm-100 transition-all disabled:opacity-50"
      >
        Überspringen
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Create ChatCalendar component**

Create `components/konfigurator/chat-calendar.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface ChatCalendarProps {
  onSelect: (date: string) => void;
}

export function ChatCalendar({ onSelect }: ChatCalendarProps) {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ before: new Date() }}
        className="rounded-xl border border-warm-200 bg-white"
      />
      <Button
        onClick={() => date && onSelect(date.toISOString().split("T")[0])}
        disabled={!date}
        className="mt-3 bg-green-600 hover:bg-green-700"
      >
        Termin bestätigen
      </Button>
    </div>
  );
}
```

- [ ] **Step 6: Create ChatContactForm component**

Create `components/konfigurator/chat-contact-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatContactFormProps {
  onSubmit: (data: { name: string; phone: string; email: string; message?: string }) => void;
  submitting: boolean;
}

export function ChatContactForm({ onSubmit, submitting }: ChatContactFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) return;
    onSubmit({ ...form, message: form.message || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-white" />
      <Input placeholder="Telefon *" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="bg-white" />
      <Input placeholder="E-Mail *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-white" />
      <Textarea placeholder="Nachricht (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-white" />
      <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700">
        {submitting ? "Wird gesendet..." : "Anfrage absenden"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 7: Create ChatContainer (main orchestrator)**

Create `components/konfigurator/chat-container.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ChatStep, type ChatState,
  getInitialState, findStep, getNextStepOrder,
  createBotMessage, createUserMessage,
} from "./chat-engine";
import { ChatMessageBubble, TypingIndicator } from "./chat-message";
import { ChatOptions } from "./chat-options";
import { ChatPhotoUpload } from "./chat-photo-upload";
import { ChatCalendar } from "./chat-calendar";
import { ChatContactForm } from "./chat-contact-form";

interface ChatContainerProps {
  steps: ChatStep[];
  services: { title: string; price_from: number | null }[];
}

export function ChatContainer({ steps, services }: ChatContainerProps) {
  const [state, setState] = useState<ChatState>(getInitialState);
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  // Show first question on mount
  useEffect(() => {
    const step = findStep(steps, 1);
    if (!step) return;
    setState((s) => ({ ...s, isTyping: true }));
    const timer = setTimeout(() => {
      setState((s) => ({
        ...s,
        isTyping: false,
        messages: [...s.messages, createBotMessage(step.question)],
      }));
      scrollToBottom();
    }, 800);
    return () => clearTimeout(timer);
  }, [steps, scrollToBottom]);

  function advanceToStep(stepOrder: number) {
    const step = findStep(steps, stepOrder);
    if (!step) return;
    setState((s) => ({ ...s, isTyping: true, currentStep: stepOrder }));
    setTimeout(() => {
      setState((s) => ({
        ...s,
        isTyping: false,
        messages: [...s.messages, createBotMessage(step.question)],
      }));
      scrollToBottom();
    }, 1000);
  }

  function handleOptionSelect(value: string, label: string) {
    const currentStepData = findStep(steps, state.currentStep);
    if (!currentStepData) return;

    setState((s) => ({
      ...s,
      messages: [...s.messages, createUserMessage(label)],
      answers: { ...s.answers, [currentStepData.question]: label },
    }));
    scrollToBottom();

    const next = getNextStepOrder(currentStepData, value);
    if (next) {
      advanceToStep(next);
    }
  }

  function handlePhotoUpload(urls: string[]) {
    const currentStepData = findStep(steps, state.currentStep);
    if (!currentStepData) return;

    setState((s) => ({
      ...s,
      messages: [...s.messages, createUserMessage(`${urls.length} Foto(s) hochgeladen`)],
      photos: [...s.photos, ...urls],
    }));
    scrollToBottom();

    const next = getNextStepOrder(currentStepData);
    if (next) advanceToStep(next);
  }

  function handlePhotoSkip() {
    const currentStepData = findStep(steps, state.currentStep);
    if (!currentStepData) return;

    setState((s) => ({
      ...s,
      messages: [...s.messages, createUserMessage("Übersprungen")],
    }));
    scrollToBottom();

    const next = getNextStepOrder(currentStepData);
    if (next) advanceToStep(next);
  }

  function handleDateSelect(date: string) {
    const currentStepData = findStep(steps, state.currentStep);
    if (!currentStepData) return;

    setState((s) => ({
      ...s,
      messages: [...s.messages, createUserMessage(date)],
      preferredDate: date,
    }));
    scrollToBottom();

    // Show price estimate based on first answer
    const firstAnswer = Object.values(state.answers)[0];
    const service = services.find((svc) => svc.title.toLowerCase().includes((firstAnswer || "").toLowerCase()));
    const priceMsg = service?.price_from
      ? `Richtwert für diesen Auftrag: ab CHF ${service.price_from.toLocaleString("de-CH")}`
      : "Wir erstellen Ihnen gerne eine individuelle Offerte.";

    setState((s) => ({ ...s, isTyping: true }));
    setTimeout(() => {
      setState((s) => ({
        ...s,
        isTyping: false,
        messages: [...s.messages, createBotMessage(priceMsg)],
      }));
      // Then show contact form step
      const next = getNextStepOrder(currentStepData!);
      if (next) advanceToStep(next);
    }, 1000);
  }

  async function handleContactSubmit(data: { name: string; phone: string; email: string; message?: string }) {
    setSubmitting(true);
    setState((s) => ({
      ...s,
      messages: [...s.messages, createUserMessage(`${data.name} — ${data.email}`)],
    }));

    try {
      await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          answers: state.answers,
          photos: state.photos,
          preferred_date: state.preferredDate,
        }),
      });

      setState((s) => ({
        ...s,
        isComplete: true,
        messages: [...s.messages, createBotMessage("Danke! Ihre Anfrage ist raus. Wir melden uns innert 24h. 🎉")],
      }));
    } catch {
      setState((s) => ({
        ...s,
        messages: [...s.messages, createBotMessage("Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.")],
      }));
    }

    setSubmitting(false);
    scrollToBottom();
  }

  const currentStepData = findStep(steps, state.currentStep);
  const showOptions = currentStepData && currentStepData.options.length > 0 && !state.isTyping && !state.isComplete;
  const showUpload = currentStepData?.show_upload && !state.isTyping && !state.isComplete && !state.photos.length;
  const showCalendar = currentStepData?.show_calendar && !state.isTyping && !state.isComplete && !state.preferredDate;
  const showContactForm = currentStepData && !currentStepData.options.length && !currentStepData.show_upload && !currentStepData.show_calendar && !state.isTyping && !state.isComplete;

  return (
    <div className="max-w-lg mx-auto min-h-[70vh] flex flex-col">
      <div className="flex-1 space-y-4 p-4">
        {state.messages.map((msg) => (
          <ChatMessageBubble key={msg.id} type={msg.type} text={msg.text} />
        ))}
        {state.isTyping && <TypingIndicator />}
        {showOptions && <ChatOptions options={currentStepData!.options} onSelect={handleOptionSelect} />}
        {showUpload && <ChatPhotoUpload onUpload={handlePhotoUpload} onSkip={handlePhotoSkip} />}
        {showCalendar && <ChatCalendar onSelect={handleDateSelect} />}
        {showContactForm && <ChatContactForm onSubmit={handleContactSubmit} submitting={submitting} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Create Konfigurator page**

Create `app/(public)/konfigurator/page.tsx`:

```tsx
import { getChatFlow, getServices } from "@/lib/queries";
import { ChatContainer } from "@/components/konfigurator/chat-container";

export const metadata = { title: "Anfrage starten" };

export default async function KonfiguratorPage() {
  const steps = await getChatFlow();
  const services = await getServices();

  return (
    <main className="min-h-screen bg-warm-50 py-8">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-warm-800">Anfrage starten</h1>
        <p className="text-warm-600 mt-2">Erzählen Sie uns, was Sie brauchen</p>
      </div>
      <ChatContainer steps={steps} services={services} />
    </main>
  );
}
```

- [ ] **Step 9: Verify Konfigurator renders and flow works**

```bash
npm run dev
```

Open localhost:3000/konfigurator — chat messages should appear with typing animation, buttons should advance the flow.

- [ ] **Step 10: Commit**

```bash
git add components/konfigurator/ app/\(public\)/konfigurator/
git commit -m "feat: add conversational inquiry configurator with decision-tree chat flow"
```

---

## Task 6: API Routes (Anfrage, Upload, Reviews)

**Files:**
- Create: `app/api/anfrage/route.ts`
- Create: `app/api/upload/route.ts`
- Create: `app/api/reviews/route.ts`

- [ ] **Step 1: Create inquiry API route**

Create `app/api/anfrage/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/queries";
import { sendInquiryConfirmation, sendInquiryNotification } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, message, answers, photos, preferred_date } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Name, Telefon und E-Mail sind Pflichtfelder." }, { status: 400 });
    }

    const inquiry = await createInquiry({
      name,
      phone,
      email,
      message,
      answers: answers ?? {},
      photos: photos ?? [],
      preferred_date,
    });

    // Send emails (fire and forget — don't block response)
    Promise.all([
      sendInquiryConfirmation(email, { name, answers, preferredDate: preferred_date }),
      sendInquiryNotification({ name, phone, email, message, answers, photos, preferredDate: preferred_date }),
    ]).catch(console.error);

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ error: "Anfrage konnte nicht gespeichert werden." }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create upload API route**

Create `app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei hochgeladen." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Datei zu gross (max. 5 MB)." }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin()
      .storage
      .from("photos")
      .upload(fileName, buffer, { contentType: file.type });

    if (error) throw error;

    const { data } = supabaseAdmin()
      .storage
      .from("photos")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create reviews API route**

Create `app/api/reviews/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Check cache first
    const { data: cached } = await supabaseAdmin()
      .from("site_config")
      .select("value")
      .eq("key", "google_reviews_cache")
      .single();

    if (cached?.value && cached.value !== "{}") {
      const parsed = JSON.parse(cached.value);
      const cacheAge = Date.now() - (parsed.cached_at ?? 0);
      // Return cache if less than 24h old
      if (cacheAge < 24 * 60 * 60 * 1000) {
        return NextResponse.json(parsed);
      }
    }

    // Fetch from Google Places API
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
      return NextResponse.json({ reviews: [], rating: 0, total: 0 });
    }

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=de&key=${apiKey}`
    );
    const data = await res.json();

    const result = {
      reviews: data.result?.reviews ?? [],
      rating: data.result?.rating ?? 0,
      total: data.result?.user_ratings_total ?? 0,
      cached_at: Date.now(),
    };

    // Update cache
    await supabaseAdmin()
      .from("site_config")
      .update({ value: JSON.stringify(result) })
      .eq("key", "google_reviews_cache");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Reviews error:", error);
    return NextResponse.json({ reviews: [], rating: 0, total: 0 });
  }
}
```

- [ ] **Step 4: Verify API routes respond**

```bash
npm run dev
# Test upload: curl -X POST http://localhost:3000/api/upload -F "file=@test.jpg"
# Test reviews: curl http://localhost:3000/api/reviews
```

- [ ] **Step 5: Commit**

```bash
git add app/api/
git commit -m "feat: add API routes for inquiry submission, photo upload, and Google Reviews"
```

---

## Task 7: Admin — Anfragen-Übersicht + Detail

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/anfragen/[id]/page.tsx`
- Create: `components/admin/inquiry-table.tsx`
- Create: `components/admin/inquiry-detail.tsx`

- [ ] **Step 1: Create admin layout with noindex**

Create `app/admin/layout.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-50">
      <nav className="bg-warm-800 text-warm-100 px-6 py-3 flex items-center gap-6 text-sm">
        <span className="font-serif text-lg">Admin</span>
        <a href="/admin" className="hover:text-white">Anfragen</a>
        <a href="/admin/inhalte" className="hover:text-white">Inhalte</a>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create InquiryTable component**

Create `components/admin/inquiry-table.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  answers: Record<string, string>;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  neu: "bg-blue-100 text-blue-800",
  beantwortet: "bg-yellow-100 text-yellow-800",
  erledigt: "bg-green-100 text-green-800",
};

export function InquiryTable({ inquiries: initial }: { inquiries: Inquiry[] }) {
  const [filter, setFilter] = useState("alle");
  const filtered = filter === "alle" ? initial : initial.filter((i) => i.status === filter);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle</SelectItem>
            <SelectItem value="neu">Neu</SelectItem>
            <SelectItem value="beantwortet">Beantwortet</SelectItem>
            <SelectItem value="erledigt">Erledigt</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-warm-600">{filtered.length} Anfragen</span>
      </div>
      <div className="bg-white rounded-xl border border-warm-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-warm-50 text-warm-600">
            <tr>
              <th className="text-left px-4 py-3">Datum</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Leistung</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inq) => (
              <tr key={inq.id} className="border-t border-warm-100 hover:bg-warm-50">
                <td className="px-4 py-3">{new Date(inq.created_at).toLocaleDateString("de-CH")}</td>
                <td className="px-4 py-3 font-medium">{inq.name}</td>
                <td className="px-4 py-3">{Object.values(inq.answers)[0] ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge className={statusColors[inq.status]}>{inq.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/anfragen/${inq.id}`} className="text-green-600 hover:underline">Details →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create admin overview page**

Create `app/admin/page.tsx`:

```tsx
import { getInquiries } from "@/lib/queries";
import { InquiryTable } from "@/components/admin/inquiry-table";

export default async function AdminPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <h1 className="font-serif text-2xl text-warm-800 mb-6">Anfragen</h1>
      <InquiryTable inquiries={inquiries} />
    </div>
  );
}
```

- [ ] **Step 4: Create InquiryDetail component**

Create `components/admin/inquiry-detail.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  answers: Record<string, string>;
  photos: string[];
  preferred_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
  const [status, setStatus] = useState(inquiry.status);
  const [notes, setNotes] = useState(inquiry.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/anfrage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inquiry.id, status, notes }),
    });
    setSaving(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="font-serif text-2xl text-warm-800">{inquiry.name}</h1>
        <Badge>{status}</Badge>
      </div>

      <div className="bg-white rounded-xl border border-warm-100 p-6 space-y-3">
        <h3 className="font-semibold text-warm-800">Kontakt</h3>
        <p><a href={`tel:${inquiry.phone}`} className="text-green-600 hover:underline">📞 {inquiry.phone}</a></p>
        <p><a href={`mailto:${inquiry.email}`} className="text-green-600 hover:underline">✉️ {inquiry.email}</a></p>
        <p><a href={`https://wa.me/${inquiry.phone.replace(/\s/g, "").replace("+", "")}`} className="text-green-600 hover:underline">💬 WhatsApp</a></p>
        {inquiry.preferred_date && <p>📅 Wunschtermin: {inquiry.preferred_date}</p>}
        {inquiry.message && <p>💬 {inquiry.message}</p>}
      </div>

      <div className="bg-white rounded-xl border border-warm-100 p-6 space-y-3">
        <h3 className="font-semibold text-warm-800">Antworten</h3>
        {Object.entries(inquiry.answers).map(([q, a]) => (
          <div key={q}><span className="text-warm-600">{q}:</span> <strong>{a}</strong></div>
        ))}
      </div>

      {inquiry.photos.length > 0 && (
        <div className="bg-white rounded-xl border border-warm-100 p-6">
          <h3 className="font-semibold text-warm-800 mb-3">Fotos</h3>
          <div className="grid grid-cols-2 gap-3">
            {inquiry.photos.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt={`Foto ${i + 1}`} className="rounded-lg w-full h-40 object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-warm-100 p-6 space-y-4">
        <h3 className="font-semibold text-warm-800">Bearbeiten</h3>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="neu">Neu</SelectItem>
            <SelectItem value="beantwortet">Beantwortet</SelectItem>
            <SelectItem value="erledigt">Erledigt</SelectItem>
          </SelectContent>
        </Select>
        <Textarea placeholder="Interne Notizen..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button onClick={save} disabled={saving} className="bg-green-600 hover:bg-green-700">
          {saving ? "Speichern..." : "Speichern"}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create inquiry detail page**

Create `app/admin/anfragen/[id]/page.tsx`:

```tsx
import { getInquiry } from "@/lib/queries";
import { InquiryDetail } from "@/components/admin/inquiry-detail";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm text-green-600 hover:underline mb-4 block">← Zurück</Link>
      <InquiryDetail inquiry={inquiry} />
    </div>
  );
}
```

- [ ] **Step 6: Add PATCH handler to inquiry API**

Add to `app/api/anfrage/route.ts`:

```typescript
export async function PATCH(req: NextRequest) {
  const { id, status, notes } = await req.json();
  if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
  await updateInquiry(id, { status, notes });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 7: Verify admin pages render**

```bash
npm run dev
```

Open localhost:3000/admin — table should display, clicking an inquiry should show the detail page.

- [ ] **Step 8: Commit**

```bash
git add app/admin/ components/admin/ app/api/anfrage/route.ts
git commit -m "feat: add admin inquiry overview and detail pages"
```

---

## Task 8: Admin — Content-Pflege

**Files:**
- Create: `app/admin/inhalte/page.tsx`
- Create: `components/admin/content-editor.tsx`
- Create: `components/admin/services-editor.tsx`
- Create: `components/admin/chat-flow-editor.tsx`
- Create: `components/admin/gallery-editor.tsx`

- [ ] **Step 1: Create ServicesEditor**

Create `components/admin/services-editor.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { upsertService, deleteService } from "@/lib/queries";

interface Service {
  id?: string;
  title: string;
  description: string;
  icon: string;
  price_from: number | null;
  sort_order: number;
}

export function ServicesEditor({ initial }: { initial: Service[] }) {
  const [services, setServices] = useState<Service[]>(initial);
  const [saving, setSaving] = useState(false);

  function addService() {
    setServices([...services, { title: "", description: "", icon: "🔧", price_from: null, sort_order: services.length + 1 }]);
  }

  function updateField(index: number, field: keyof Service, value: string | number | null) {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  }

  async function save(index: number) {
    setSaving(true);
    await upsertService(services[index]);
    setSaving(false);
  }

  async function remove(index: number) {
    const svc = services[index];
    if (svc.id) await deleteService(svc.id);
    setServices(services.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {services.map((svc, i) => (
        <div key={svc.id ?? i} className="bg-white border border-warm-100 rounded-xl p-4 space-y-3">
          <div className="flex gap-3">
            <Input className="w-16" value={svc.icon} onChange={(e) => updateField(i, "icon", e.target.value)} placeholder="Icon" />
            <Input className="flex-1" value={svc.title} onChange={(e) => updateField(i, "title", e.target.value)} placeholder="Titel" />
            <Input className="w-32" type="number" value={svc.price_from ?? ""} onChange={(e) => updateField(i, "price_from", e.target.value ? Number(e.target.value) : null)} placeholder="ab CHF" />
            <Input className="w-20" type="number" value={svc.sort_order} onChange={(e) => updateField(i, "sort_order", Number(e.target.value))} placeholder="#" />
          </div>
          <Textarea value={svc.description} onChange={(e) => updateField(i, "description", e.target.value)} placeholder="Beschreibung" />
          <div className="flex gap-2">
            <Button onClick={() => save(i)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">Speichern</Button>
            <Button onClick={() => remove(i)} variant="outline" size="sm" className="text-red-600">Löschen</Button>
          </div>
        </div>
      ))}
      <Button onClick={addService} variant="outline">+ Leistung hinzufügen</Button>
    </div>
  );
}
```

- [ ] **Step 2: Create ChatFlowEditor**

Create `components/admin/chat-flow-editor.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { upsertChatStep, deleteChatStep } from "@/lib/queries";

interface ChatStep {
  id?: string;
  step_order: number;
  question: string;
  options: { label: string; value: string; next_step?: number }[];
  next_step: number | null;
  show_upload: boolean;
  show_calendar: boolean;
}

export function ChatFlowEditor({ initial }: { initial: ChatStep[] }) {
  const [steps, setSteps] = useState<ChatStep[]>(initial);
  const [saving, setSaving] = useState(false);

  function updateStep(index: number, field: keyof ChatStep, value: unknown) {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  }

  function addOption(stepIndex: number) {
    const updated = [...steps];
    updated[stepIndex].options = [...updated[stepIndex].options, { label: "", value: "" }];
    setSteps(updated);
  }

  function updateOption(stepIndex: number, optIndex: number, field: string, value: string) {
    const updated = [...steps];
    updated[stepIndex].options = updated[stepIndex].options.map((opt, i) =>
      i === optIndex ? { ...opt, [field]: value } : opt
    );
    setSteps(updated);
  }

  function removeOption(stepIndex: number, optIndex: number) {
    const updated = [...steps];
    updated[stepIndex].options = updated[stepIndex].options.filter((_, i) => i !== optIndex);
    setSteps(updated);
  }

  async function save(index: number) {
    setSaving(true);
    await upsertChatStep(steps[index]);
    setSaving(false);
  }

  async function remove(index: number) {
    const step = steps[index];
    if (step.id) await deleteChatStep(step.id);
    setSteps(steps.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      {steps.map((step, si) => (
        <div key={step.id ?? si} className="bg-white border border-warm-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-warm-600">Schritt {step.step_order}</span>
            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" checked={step.show_upload} onChange={(e) => updateStep(si, "show_upload", e.target.checked)} /> Upload
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" checked={step.show_calendar} onChange={(e) => updateStep(si, "show_calendar", e.target.checked)} /> Kalender
            </label>
          </div>
          <Textarea value={step.question} onChange={(e) => updateStep(si, "question", e.target.value)} placeholder="Frage" />
          <div className="space-y-2">
            {step.options.map((opt, oi) => (
              <div key={oi} className="flex gap-2 items-center">
                <Input className="flex-1" value={opt.label} onChange={(e) => updateOption(si, oi, "label", e.target.value)} placeholder="Label" />
                <Input className="w-32" value={opt.value} onChange={(e) => updateOption(si, oi, "value", e.target.value)} placeholder="Value" />
                <Button onClick={() => removeOption(si, oi)} variant="outline" size="sm" className="text-red-600">×</Button>
              </div>
            ))}
            <Button onClick={() => addOption(si)} variant="outline" size="sm">+ Option</Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => save(si)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">Speichern</Button>
            <Button onClick={() => remove(si)} variant="outline" size="sm" className="text-red-600">Löschen</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create GalleryEditor**

Create `components/admin/gallery-editor.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertGalleryItem, deleteGalleryItem } from "@/lib/queries";

interface GalleryItem {
  id?: string;
  title: string;
  before_image: string;
  after_image: string;
  sort_order: number;
}

export function GalleryEditor({ initial }: { initial: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [saving, setSaving] = useState(false);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<{ index: number; field: "before_image" | "after_image" } | null>(null);

  async function handleUpload(file: File, index: number, field: "before_image" | "after_image") {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: data.url };
      setItems(updated);
    }
  }

  function addItem() {
    setItems([...items, { title: "", before_image: "", after_image: "", sort_order: items.length + 1 }]);
  }

  async function save(index: number) {
    setSaving(true);
    await upsertGalleryItem(items[index]);
    setSaving(false);
  }

  async function remove(index: number) {
    const item = items[index];
    if (item.id) await deleteGalleryItem(item.id);
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="bg-white border border-warm-100 rounded-xl p-4 space-y-3">
          <div className="flex gap-3">
            <Input className="flex-1" value={item.title} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], title: e.target.value }; setItems(u); }} placeholder="Titel" />
            <Input className="w-20" type="number" value={item.sort_order} onChange={(e) => { const u = [...items]; u[i] = { ...u[i], sort_order: Number(e.target.value) }; setItems(u); }} placeholder="#" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-warm-600 mb-1">Vorher</p>
              {item.before_image ? <img src={item.before_image} alt="Vorher" className="h-24 w-full object-cover rounded-lg" /> : null}
              <input type="file" accept="image/*" className="text-xs mt-1" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], i, "before_image")} />
            </div>
            <div>
              <p className="text-xs text-warm-600 mb-1">Nachher</p>
              {item.after_image ? <img src={item.after_image} alt="Nachher" className="h-24 w-full object-cover rounded-lg" /> : null}
              <input type="file" accept="image/*" className="text-xs mt-1" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], i, "after_image")} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => save(i)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">Speichern</Button>
            <Button onClick={() => remove(i)} variant="outline" size="sm" className="text-red-600">Löschen</Button>
          </div>
        </div>
      ))}
      <Button onClick={addItem} variant="outline">+ Galerie-Eintrag</Button>
    </div>
  );
}
```

- [ ] **Step 4: Create ContentEditor (tabs wrapper)**

Create `components/admin/content-editor.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ServicesEditor } from "./services-editor";
import { ChatFlowEditor } from "./chat-flow-editor";
import { GalleryEditor } from "./gallery-editor";
import { updateSiteConfig } from "@/lib/queries";

interface ContentEditorProps {
  config: Record<string, string>;
  services: any[];
  chatFlow: any[];
  gallery: any[];
}

const textKeys = ["hero_title", "hero_subtitle", "company_name", "about_title", "about_text", "about_years", "about_projects"];
const brandingKeys = ["phone", "email", "whatsapp"];

export function ContentEditor({ config, services, chatFlow, gallery }: ContentEditorProps) {
  const [values, setValues] = useState<Record<string, string>>(config);
  const [saving, setSaving] = useState(false);

  async function saveConfig(key: string) {
    setSaving(true);
    await updateSiteConfig(key, values[key]);
    setSaving(false);
  }

  function ConfigField({ configKey, label, multiline }: { configKey: string; label: string; multiline?: boolean }) {
    const Component = multiline ? Textarea : Input;
    return (
      <div className="flex gap-3 items-start">
        <label className="w-40 text-sm text-warm-600 pt-2">{label}</label>
        <Component
          className="flex-1 bg-white"
          value={values[configKey] ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues({ ...values, [configKey]: e.target.value })}
        />
        <Button onClick={() => saveConfig(configKey)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">
          Speichern
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="leistungen">
      <TabsList className="mb-6">
        <TabsTrigger value="leistungen">Leistungen</TabsTrigger>
        <TabsTrigger value="chatflow">Chat-Flow</TabsTrigger>
        <TabsTrigger value="galerie">Galerie</TabsTrigger>
        <TabsTrigger value="texte">Texte</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
      </TabsList>
      <TabsContent value="leistungen"><ServicesEditor initial={services} /></TabsContent>
      <TabsContent value="chatflow"><ChatFlowEditor initial={chatFlow} /></TabsContent>
      <TabsContent value="galerie"><GalleryEditor initial={gallery} /></TabsContent>
      <TabsContent value="texte">
        <div className="space-y-4">
          <ConfigField configKey="hero_title" label="Hero Titel" />
          <ConfigField configKey="hero_subtitle" label="Hero Untertitel" multiline />
          <ConfigField configKey="company_name" label="Firmenname" />
          <ConfigField configKey="about_title" label="Über uns Titel" />
          <ConfigField configKey="about_text" label="Über uns Text" multiline />
          <ConfigField configKey="about_years" label="Jahre Erfahrung" />
          <ConfigField configKey="about_projects" label="Projekte" />
        </div>
      </TabsContent>
      <TabsContent value="branding">
        <div className="space-y-4">
          <ConfigField configKey="phone" label="Telefon" />
          <ConfigField configKey="email" label="E-Mail" />
          <ConfigField configKey="whatsapp" label="WhatsApp Nr." />
        </div>
      </TabsContent>
    </Tabs>
  );
}
```

Note: The admin editors import CRUD helpers from `@/lib/queries` (upsertService, deleteService, etc.) which were added in Task 2.

- [ ] **Step 5: Create Inhalte page**

Create `app/admin/inhalte/page.tsx`:

```tsx
import { getSiteConfig, getServices, getChatFlow, getGalleryItems } from "@/lib/queries";
import { ContentEditor } from "@/components/admin/content-editor";

export default async function InhaltePage() {
  const [config, services, chatFlow, gallery] = await Promise.all([
    getSiteConfig(),
    getServices(),
    getChatFlow(),
    getGalleryItems(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-warm-800 mb-6">Inhalte verwalten</h1>
      <ContentEditor config={config} services={services} chatFlow={chatFlow} gallery={gallery} />
    </div>
  );
}
```

- [ ] **Step 6: Verify content editor works**

```bash
npm run dev
```

Open localhost:3000/admin/inhalte — all 5 tabs should render, CRUD operations should persist to Supabase.

- [ ] **Step 7: Commit**

```bash
git add app/admin/inhalte/ components/admin/
git commit -m "feat: add content management with services, chat flow, gallery, and branding editors"
```

---

## Task 9: E-Mail Templates + Legal Pages + Final Polish

**Files:**
- Create: `emails/inquiry-confirmation.tsx`
- Create: `emails/inquiry-notification.tsx`
- Create: `app/(public)/impressum/page.tsx`
- Create: `app/(public)/datenschutz/page.tsx`

- [ ] **Step 1: Create React Email templates**

Replace the inline HTML in `lib/resend.ts` with proper React Email components in `emails/`. Import and render them with `render()` from `@react-email/components`.

- [ ] **Step 2: Create Impressum page**

Create `app/(public)/impressum/page.tsx` with placeholder legal text and configurable company details from `site_config`.

- [ ] **Step 3: Create Datenschutz page**

Create `app/(public)/datenschutz/page.tsx` with Swiss DSG-compliant privacy policy template.

- [ ] **Step 4: End-to-end test**

Full flow test:
1. Open localhost:3000 — all sections render
2. Click "Anfrage starten" → Konfigurator opens
3. Go through chat flow, upload a photo, select date, submit
4. Check Supabase — inquiry saved
5. Check email — both emails sent
6. Open /admin — inquiry appears
7. Click inquiry — detail page shows all data
8. Change status, add note, save
9. Open /admin/inhalte — edit a service, save, verify on frontend

- [ ] **Step 5: Commit**

```bash
git add emails/ app/\(public\)/impressum/ app/\(public\)/datenschutz/ lib/resend.ts
git commit -m "feat: add React Email templates, legal pages, and finalize template"
```

---

## Summary

| Task | What it builds | Estimated steps |
|------|---------------|----------------|
| 1 | Project setup + design tokens | 10 |
| 2 | Supabase schema + lib layer | 7 |
| 3 | Landingpage (Hero, Services, HowItWorks) | 7 |
| 4 | Landingpage (Gallery, Reviews, About, CTA, Footer) | 10 |
| 5 | Conversational Konfigurator | 10 |
| 6 | API Routes (Anfrage, Upload, Reviews) | 5 |
| 7 | Admin — Anfragen-Übersicht + Detail | 8 |
| 8 | Admin — Content-Pflege | 7 |
| 9 | E-Mail Templates + Legal + Polish | 5 |

**Total: 9 Tasks, 69 Steps**
