import type { Service, ChatStep, GalleryItem, Inquiry } from "./queries";
import { getActivePreset } from "./config";

const preset = getActivePreset();

export const fallbackConfig: Record<string, string> = {
  hero_title: preset.hero.title,
  hero_subtitle: preset.hero.subtitle,
  hero_badge: preset.hero.badge,
  company_name: `${preset.label} Musterbetrieb`,
  phone: "076 123 45 67",
  email: `info@${preset.key}-musterbetrieb.ch`,
  whatsapp: "41761234567",
  address: "Musterstrasse 1, 8000 Zuerich",
  owner_name: "Max Muster",
  service_area: "Zuerich, Winterthur, Zug und Umgebung",
  service_radius_km: "30",
  latitude: "47.3769",
  longitude: "8.5417",
  about_title: preset.aboutTitle,
  about_text:
    "Seit Jahren stehen wir fuer persoenliche Betreuung und handwerkliche Qualitaet. Regional verankert, pragmatisch, zuverlaessig.",
  about_years: "15+",
  about_projects: "800+",
  opening_hours: "Mo-Fr 07:30-17:30, Sa 09:00-12:00",
  cta_headline: preset.ctaHeadline,
  google_reviews_cache: "{}",
};

export const fallbackServices: Service[] = preset.services.map((s, idx) => ({
  id: `svc-${idx + 1}`,
  ...s,
}));

export const fallbackChatFlow: ChatStep[] = preset.chatFlow.map((s, idx) => ({
  id: `step-${idx + 1}`,
  ...s,
}));

export const fallbackGalleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Projekt 1",
    before_image: "https://placehold.co/800x600/d4a574/ffffff?text=Vorher",
    after_image: "https://placehold.co/800x600/4a7c59/ffffff?text=Nachher",
    sort_order: 1,
  },
  {
    id: "2",
    title: "Projekt 2",
    before_image: "https://placehold.co/800x600/d4a574/ffffff?text=Vorher",
    after_image: "https://placehold.co/800x600/4a7c59/ffffff?text=Nachher",
    sort_order: 2,
  },
  {
    id: "3",
    title: "Projekt 3",
    before_image: "https://placehold.co/800x600/d4a574/ffffff?text=Vorher",
    after_image: "https://placehold.co/800x600/4a7c59/ffffff?text=Nachher",
    sort_order: 3,
  },
];

export const fallbackInquiries: Inquiry[] = [
  {
    id: "demo-1",
    name: "Max Muster",
    phone: "+41 79 123 45 67",
    email: "max@example.ch",
    message: "Moechte gerne eine Offerte.",
    answers: preset.chatFlow.slice(0, 2).reduce<Record<string, string>>((acc, step) => {
      const firstLabel = step.options[0]?.label ?? "—";
      acc[step.question] = firstLabel;
      return acc;
    }, {}),
    photos: [],
    preferred_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "neu",
    notes: null,
    created_at: new Date().toISOString(),
  },
];
