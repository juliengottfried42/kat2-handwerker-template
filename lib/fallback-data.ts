import type { Service, ChatStep, GalleryItem, Inquiry } from "./queries";

export const fallbackConfig: Record<string, string> = {
  hero_title: "Ihr Maler in Zürich und Umgebung",
  hero_subtitle:
    "Professionelle Malerarbeiten mit Herzblut. Von der Wohnungsrenovation bis zur Fassadengestaltung.",
  company_name: "Malermeister Brunner",
  phone: "076 123 45 67",
  email: "info@maler-brunner.ch",
  whatsapp: "41761234567",
  about_title: "Malermeister mit Leidenschaft",
  about_text:
    "Seit 2008 verschönern wir Zürich — Wohnung für Wohnung, Fassade für Fassade. Als Familienbetrieb stehen wir für persönliche Betreuung und handwerkliche Qualität.",
  about_years: "15+",
  about_projects: "800+",
  google_reviews_cache: "{}",
};

export const fallbackServices: Service[] = [
  { id: "1", title: "Innenanstrich", description: "Wände, Decken, Türen und Fensterrahmen — frische Farbe für Ihr Zuhause.", icon: "🎨", price_from: 800, sort_order: 1 },
  { id: "2", title: "Fassadengestaltung", description: "Wetterfeste Anstriche und kreative Fassadengestaltung.", icon: "🏠", price_from: 3500, sort_order: 2 },
  { id: "3", title: "Tapezierarbeiten", description: "Von klassisch bis modern — wir tapezieren mit Präzision.", icon: "✨", price_from: 600, sort_order: 3 },
  { id: "4", title: "Spachtelarbeiten", description: "Glatte Wände, perfekte Oberflächen.", icon: "🔨", price_from: 500, sort_order: 4 },
  { id: "5", title: "Holzschutz", description: "Lasuren, Lacke und Öle für Ihre Holzflächen.", icon: "🪵", price_from: 400, sort_order: 5 },
  { id: "6", title: "Gewerbe & Büro", description: "Professionelle Malerarbeiten für Geschäftsräume.", icon: "🏢", price_from: null, sort_order: 6 },
];

export const fallbackChatFlow: ChatStep[] = [
  { id: "1", step_order: 1, question: "Hallo! Was können wir für Sie tun?", options: [{ label: "Innenanstrich", value: "innenanstrich" }, { label: "Fassade", value: "fassade" }, { label: "Tapezieren", value: "tapezieren" }, { label: "Anderes", value: "anderes" }], next_step: 2, show_upload: false, show_calendar: false },
  { id: "2", step_order: 2, question: "Wie gross ist die Fläche ungefähr?", options: [{ label: "1-2 Zimmer", value: "1-2" }, { label: "3-4 Zimmer", value: "3-4" }, { label: "5+ Zimmer", value: "5+" }, { label: "Weiss ich nicht", value: "unbekannt" }], next_step: 3, show_upload: false, show_calendar: false },
  { id: "3", step_order: 3, question: "Haben Sie Fotos? Das hilft uns bei der Einschätzung.", options: [{ label: "Fotos hochladen", value: "upload" }, { label: "Überspringen", value: "skip" }], next_step: 4, show_upload: true, show_calendar: false },
  { id: "4", step_order: 4, question: "Wann soll's losgehen?", options: [], next_step: 5, show_upload: false, show_calendar: true },
  { id: "5", step_order: 5, question: "Fast geschafft! Wie erreichen wir Sie?", options: [], next_step: null, show_upload: false, show_calendar: false },
];

export const fallbackGalleryItems: GalleryItem[] = [
  { id: "1", title: "Wohnzimmer Renovation", before_image: "", after_image: "", sort_order: 1 },
  { id: "2", title: "Fassade Altbau", before_image: "", after_image: "", sort_order: 2 },
];

export const fallbackInquiries: Inquiry[] = [
  {
    id: "demo-1",
    name: "Max Muster",
    phone: "+41 79 123 45 67",
    email: "max@example.ch",
    message: "Möchte gerne ein Angebot für 3 Zimmer.",
    answers: { "Was können wir für Sie tun?": "Innenanstrich", "Wie gross ist die Fläche?": "3-4 Zimmer" },
    photos: [],
    preferred_date: "2026-04-15",
    status: "neu",
    notes: null,
    created_at: new Date().toISOString(),
  },
];
