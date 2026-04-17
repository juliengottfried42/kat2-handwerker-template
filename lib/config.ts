import type { ChatStep, Service } from "./queries";

export type BrancheKey = "elektriker" | "sanitaer" | "maler" | "schreiner";

export interface BranchePreset {
  key: BrancheKey;
  label: string;
  colors: { primary: string; primaryHover: string };
  hero: { title: string; subtitle: string; badge: string };
  aboutTitle: string;
  services: Omit<Service, "id">[];
  chatFlow: Omit<ChatStep, "id">[];
  ctaHeadline: string;
  howItWorksLabels: [string, string, string];
}

const CONTACT_STEP_NEXT = null;

export const branchePresets: Record<BrancheKey, BranchePreset> = {
  elektriker: {
    key: "elektriker",
    label: "Elektriker",
    colors: { primary: "#1d4ed8", primaryHover: "#1e40af" },
    hero: {
      title: "Ihr Elektriker fuer Haus, Wohnung und Gewerbe",
      subtitle:
        "Schnell vor Ort, sauber gearbeitet. Vom Steckdosen-Tausch bis zur kompletten Sanierung.",
      badge: "24h-Notdienst verfuegbar",
    },
    aboutTitle: "Elektroprofi mit Handschlagqualitaet",
    services: [
      { title: "Steckdosen & Schalter", description: "Neuinstallation, Ersatz oder Umbau — sauber und normgerecht.", icon: "🔌", price_from: 120, sort_order: 1 },
      { title: "Beleuchtung", description: "LED-Spots, Hangelampen, Gartenbeleuchtung — wir montieren.", icon: "💡", price_from: 180, sort_order: 2 },
      { title: "Sicherungskasten", description: "Ersatz, Ausbau oder FI-Schutzschalter nachruesten.", icon: "⚡", price_from: 650, sort_order: 3 },
      { title: "E-Ladestation", description: "Wallbox fuer Ihr Elektroauto — Installation und Anmeldung.", icon: "🔋", price_from: 1800, sort_order: 4 },
      { title: "Smart Home", description: "KNX, Zigbee, Matter — Ihr Zuhause intelligent vernetzt.", icon: "🏠", price_from: null, sort_order: 5 },
      { title: "Notdienst", description: "Stoerung? Wir sind innert 60 Minuten vor Ort.", icon: "🚨", price_from: null, sort_order: 6 },
    ],
    chatFlow: [
      {
        step_order: 1,
        question: "Gruezi! Was brauchen Sie?",
        options: [
          { label: "Steckdose / Schalter", value: "steckdose" },
          { label: "Beleuchtung", value: "licht" },
          { label: "Sicherungskasten", value: "sicherung" },
          { label: "Notfall", value: "notfall" },
          { label: "Anderes", value: "anderes" },
        ],
        next_step: 2,
        show_upload: false,
        show_calendar: false,
      },
      {
        step_order: 2,
        question: "Handelt es sich um einen Neubau, eine Sanierung oder einen einzelnen Auftrag?",
        options: [
          { label: "Einzelner Auftrag", value: "einzel" },
          { label: "Sanierung", value: "sanierung" },
          { label: "Neubau", value: "neubau" },
        ],
        next_step: 3,
        show_upload: false,
        show_calendar: false,
      },
      {
        step_order: 3,
        question: "Ein Foto hilft uns bei der Einschaetzung.",
        options: [
          { label: "Foto hochladen", value: "upload" },
          { label: "Ueberspringen", value: "skip" },
        ],
        next_step: 4,
        show_upload: true,
        show_calendar: false,
      },
      { step_order: 4, question: "Wann darf es losgehen?", options: [], next_step: 5, show_upload: false, show_calendar: true },
      { step_order: 5, question: "Fast geschafft! Wie erreichen wir Sie?", options: [], next_step: CONTACT_STEP_NEXT, show_upload: false, show_calendar: false },
    ],
    ctaHeadline: "Strom-Problem? Wir helfen schnell.",
    howItWorksLabels: ["Anfrage senden", "Offerte innert 24h", "Sauber erledigt"],
  },

  sanitaer: {
    key: "sanitaer",
    label: "Sanitaer",
    colors: { primary: "#0ea5e9", primaryHover: "#0284c7" },
    hero: {
      title: "Ihr Sanitaerpartner fuer Bad, Kueche und Heizung",
      subtitle:
        "Tropfender Hahn? Verstopftes Rohr? Wir kommen schnell und loesen Ihr Problem zuverlaessig.",
      badge: "Notfall-Hotline 24/7",
    },
    aboutTitle: "Sanitaer-Profi seit Jahren im Einsatz",
    services: [
      { title: "Reparaturen & Notfall", description: "Tropfender Hahn, defekte Spuelung, verstopftes Rohr — wir helfen schnell.", icon: "🔧", price_from: 150, sort_order: 1 },
      { title: "Badsanierung", description: "Komplette Badrenovation aus einer Hand — Planung bis Fertigstellung.", icon: "🛁", price_from: 8000, sort_order: 2 },
      { title: "Armaturen-Wechsel", description: "Wasserhahn, Dusche, WC-Spuelung austauschen.", icon: "🚿", price_from: 280, sort_order: 3 },
      { title: "Boiler & Warmwasser", description: "Ersatz, Entkalkung und Wartung Ihres Warmwasserboilers.", icon: "🔥", price_from: 450, sort_order: 4 },
      { title: "Heizungsservice", description: "Service, Unterhalt und Reparaturen — fuer warme Raeume.", icon: "♨️", price_from: 220, sort_order: 5 },
      { title: "Wasserschaden", description: "Schnelle Ortung und fachgerechte Behebung.", icon: "💧", price_from: null, sort_order: 6 },
    ],
    chatFlow: [
      {
        step_order: 1,
        question: "Gruezi! Was ist das Problem?",
        options: [
          { label: "Tropft / laeuft aus", value: "leck" },
          { label: "Verstopfung", value: "verstopfung" },
          { label: "Kein Warmwasser", value: "warmwasser" },
          { label: "Badsanierung geplant", value: "sanierung" },
          { label: "Anderes", value: "anderes" },
        ],
        next_step: 2,
        show_upload: false,
        show_calendar: false,
      },
      {
        step_order: 2,
        question: "Wie dringend ist es?",
        options: [
          { label: "Notfall (heute)", value: "notfall" },
          { label: "Diese Woche", value: "woche" },
          { label: "Diesen Monat", value: "monat" },
          { label: "Zeit lassen", value: "zeit" },
        ],
        next_step: 3,
        show_upload: false,
        show_calendar: false,
      },
      {
        step_order: 3,
        question: "Ein Foto hilft uns enorm bei der Einschaetzung.",
        options: [
          { label: "Foto hochladen", value: "upload" },
          { label: "Ueberspringen", value: "skip" },
        ],
        next_step: 4,
        show_upload: true,
        show_calendar: false,
      },
      { step_order: 4, question: "Welcher Termin passt Ihnen?", options: [], next_step: 5, show_upload: false, show_calendar: true },
      { step_order: 5, question: "Fast geschafft! Wie erreichen wir Sie?", options: [], next_step: CONTACT_STEP_NEXT, show_upload: false, show_calendar: false },
    ],
    ctaHeadline: "Wasserschaden? Wir sind schnell vor Ort.",
    howItWorksLabels: ["Anfrage senden", "Schnelle Rueckmeldung", "Problem geloest"],
  },

  maler: {
    key: "maler",
    label: "Maler",
    colors: { primary: "#4a7c59", primaryHover: "#3a6347" },
    hero: {
      title: "Ihr Maler in der Region",
      subtitle:
        "Professionelle Malerarbeiten mit Herzblut. Von der Wohnungsrenovation bis zur Fassadengestaltung.",
      badge: "Bestbewertet auf Google",
    },
    aboutTitle: "Malermeister mit Leidenschaft",
    services: [
      { title: "Innenanstrich", description: "Waende, Decken, Tueren und Fensterrahmen — frische Farbe fuer Ihr Zuhause.", icon: "🎨", price_from: 800, sort_order: 1 },
      { title: "Fassadengestaltung", description: "Wetterfeste Anstriche und kreative Fassadengestaltung.", icon: "🏠", price_from: 3500, sort_order: 2 },
      { title: "Tapezierarbeiten", description: "Von klassisch bis modern — wir tapezieren mit Praezision.", icon: "✨", price_from: 600, sort_order: 3 },
      { title: "Spachtelarbeiten", description: "Glatte Waende, perfekte Oberflaechen.", icon: "🔨", price_from: 500, sort_order: 4 },
      { title: "Holzschutz", description: "Lasuren, Lacke und Oele fuer Ihre Holzflaechen.", icon: "🪵", price_from: 400, sort_order: 5 },
      { title: "Gewerbe & Bueros", description: "Professionelle Malerarbeiten fuer Geschaeftsraeume.", icon: "🏢", price_from: null, sort_order: 6 },
    ],
    chatFlow: [
      {
        step_order: 1,
        question: "Hallo! Was koennen wir fuer Sie tun?",
        options: [
          { label: "Innenanstrich", value: "innenanstrich" },
          { label: "Fassade", value: "fassade" },
          { label: "Tapezieren", value: "tapezieren" },
          { label: "Anderes", value: "anderes" },
        ],
        next_step: 2,
        show_upload: false,
        show_calendar: false,
      },
      {
        step_order: 2,
        question: "Wie gross ist die Flaeche ungefaehr?",
        options: [
          { label: "1-2 Zimmer", value: "1-2" },
          { label: "3-4 Zimmer", value: "3-4" },
          { label: "5+ Zimmer", value: "5+" },
          { label: "Weiss ich nicht", value: "unbekannt" },
        ],
        next_step: 3,
        show_upload: false,
        show_calendar: false,
      },
      {
        step_order: 3,
        question: "Haben Sie Fotos? Das hilft uns bei der Einschaetzung.",
        options: [
          { label: "Fotos hochladen", value: "upload" },
          { label: "Ueberspringen", value: "skip" },
        ],
        next_step: 4,
        show_upload: true,
        show_calendar: false,
      },
      { step_order: 4, question: "Wann soll's losgehen?", options: [], next_step: 5, show_upload: false, show_calendar: true },
      { step_order: 5, question: "Fast geschafft! Wie erreichen wir Sie?", options: [], next_step: CONTACT_STEP_NEXT, show_upload: false, show_calendar: false },
    ],
    ctaHeadline: "Bereit fuer frische Farbe?",
    howItWorksLabels: ["Anfrage stellen", "Offerte erhalten", "Auftrag erledigt"],
  },

  schreiner: {
    key: "schreiner",
    label: "Schreiner",
    colors: { primary: "#92400e", primaryHover: "#78350f" },
    hero: {
      title: "Ihre Schreinerei fuer Moebel und Ausbau",
      subtitle:
        "Massanfertigung, Einbaukuechen, Schraenke, Tueren. Handwerkskunst aus der Region.",
      badge: "Seit Generationen Handwerk",
    },
    aboutTitle: "Schreinermeister mit Leib und Seele",
    services: [
      { title: "Einbaukuechen", description: "Planung und Einbau Ihrer Traumkueche — vom Erstgespraech bis zur Montage.", icon: "🍳", price_from: 12000, sort_order: 1 },
      { title: "Einbauschraenke", description: "Nischen optimal genutzt — massgefertigte Schraenke bis zur Decke.", icon: "🗄️", price_from: 2500, sort_order: 2 },
      { title: "Tueren & Tore", description: "Innentueren, Haustueren, Schiebetueren — Ersatz und Neubau.", icon: "🚪", price_from: 900, sort_order: 3 },
      { title: "Parkett & Boeden", description: "Verlegen, Abschleifen, Versiegeln.", icon: "🪵", price_from: 1200, sort_order: 4 },
      { title: "Moebel auf Mass", description: "Tisch, Regal, Sideboard — nach Ihren Wuenschen gefertigt.", icon: "🪑", price_from: null, sort_order: 5 },
      { title: "Reparaturen", description: "Tuerschloss klemmt? Schublade kaputt? Wir reparieren.", icon: "🔧", price_from: 180, sort_order: 6 },
    ],
    chatFlow: [
      {
        step_order: 1,
        question: "Gruezi! Was koennen wir fuer Sie tun?",
        options: [
          { label: "Einbaukueche", value: "kueche" },
          { label: "Einbauschrank", value: "schrank" },
          { label: "Tueren", value: "tueren" },
          { label: "Moebel auf Mass", value: "moebel" },
          { label: "Reparatur", value: "reparatur" },
          { label: "Anderes", value: "anderes" },
        ],
        next_step: 2,
        show_upload: false,
        show_calendar: false,
      },
      {
        step_order: 2,
        question: "Welches Holz / welcher Stil schwebt Ihnen vor?",
        options: [
          { label: "Eiche / hell", value: "eiche" },
          { label: "Nussbaum / dunkel", value: "nuss" },
          { label: "Weiss / modern", value: "weiss" },
          { label: "Beratung noetig", value: "beratung" },
        ],
        next_step: 3,
        show_upload: false,
        show_calendar: false,
      },
      {
        step_order: 3,
        question: "Fotos vom Raum helfen uns bei der Planung.",
        options: [
          { label: "Fotos hochladen", value: "upload" },
          { label: "Ueberspringen", value: "skip" },
        ],
        next_step: 4,
        show_upload: true,
        show_calendar: false,
      },
      { step_order: 4, question: "Wann waere der Wunschtermin fuer den Beratungstermin?", options: [], next_step: 5, show_upload: false, show_calendar: true },
      { step_order: 5, question: "Fast geschafft! Wie erreichen wir Sie?", options: [], next_step: CONTACT_STEP_NEXT, show_upload: false, show_calendar: false },
    ],
    ctaHeadline: "Neue Kueche geplant?",
    howItWorksLabels: ["Anfrage senden", "Beratungstermin", "Massanfertigung"],
  },
};

export const activeBranche: BrancheKey =
  (process.env.NEXT_PUBLIC_BRANCHE as BrancheKey | undefined) ?? "maler";

export function getActivePreset(): BranchePreset {
  return branchePresets[activeBranche] ?? branchePresets.maler;
}

export const businessDefaults = {
  locale: "de-CH",
  country: "CH",
  timezone: "Europe/Zurich",
  currency: "CHF",
  responseTime: "innerhalb von 24 Stunden",
  responseTimeIso: "PT24H",
  siteUrl: process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ch",
} as const;
