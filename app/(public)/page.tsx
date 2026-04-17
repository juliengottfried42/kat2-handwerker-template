import { getSiteConfig, getServices, getGalleryItems } from "@/lib/queries";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Gallery } from "@/components/landing/gallery";
import { Reviews } from "@/components/landing/reviews";
import { About } from "@/components/landing/about";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { MobileCTABar } from "@/components/landing/mobile-cta-bar";
import { getActivePreset } from "@/lib/config";

export default async function Home() {
  const config = await getSiteConfig();
  const services = await getServices();
  const galleryItems = await getGalleryItems();
  const preset = getActivePreset();

  let reviews: { author_name: string; rating: number; text: string }[] = [];
  let averageRating = 5;
  let totalReviews = 0;
  try {
    const cache = JSON.parse(config.google_reviews_cache ?? "null");
    if (cache && Array.isArray(cache.reviews)) {
      reviews = cache.reviews;
      averageRating = cache.rating ?? cache.averageRating ?? 5;
      totalReviews = cache.total ?? cache.totalReviews ?? reviews.length;
    }
  } catch {
    // ignore
  }

  return (
    <main>
      <Hero
        title={config.hero_title ?? preset.hero.title}
        subtitle={config.hero_subtitle ?? preset.hero.subtitle}
        companyName={config.company_name ?? preset.label}
        badge={config.hero_badge ?? preset.hero.badge}
        phone={config.phone}
        heroImage={config.hero_image}
      />
      <Services services={services} />
      <HowItWorks labels={preset.howItWorksLabels} />
      <Gallery items={galleryItems} />
      <Reviews reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />
      <About
        title={config.about_title ?? config.company_name ?? preset.aboutTitle}
        text={config.about_text ?? ""}
        years={config.about_years ?? "10+"}
        projects={config.about_projects ?? "200+"}
        photo={config.about_photo}
      />
      <CTA
        phone={config.phone ?? ""}
        email={config.email ?? ""}
        headline={config.cta_headline ?? preset.ctaHeadline}
      />
      <Footer
        companyName={config.company_name ?? preset.label}
        phone={config.phone}
        email={config.email}
        address={config.address}
      />
      <MobileCTABar phone={config.phone ?? ""} whatsapp={config.whatsapp} />
    </main>
  );
}
