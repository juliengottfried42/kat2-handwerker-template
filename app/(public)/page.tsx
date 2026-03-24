import { getSiteConfig, getServices, getGalleryItems } from "@/lib/queries";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Gallery } from "@/components/landing/gallery";
import { Reviews } from "@/components/landing/reviews";
import { About } from "@/components/landing/about";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default async function Home() {
  const config = await getSiteConfig();
  const services = await getServices();
  const galleryItems = await getGalleryItems();

  let reviews: { author_name: string; rating: number; text: string }[] = [];
  let averageRating = 5;
  let totalReviews = 0;
  try {
    const cache = JSON.parse(config.google_reviews_cache ?? "null");
    if (cache && Array.isArray(cache.reviews)) {
      reviews = cache.reviews;
      averageRating = cache.averageRating ?? 5;
      totalReviews = cache.totalReviews ?? reviews.length;
    }
  } catch {
    // fallback: empty reviews
  }

  return (
    <main>
      <Hero
        title={config.hero_title}
        subtitle={config.hero_subtitle}
        companyName={config.company_name}
      />
      <Services services={services} />
      <HowItWorks />
      <Gallery items={galleryItems} />
      <Reviews reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />
      <About
        title={config.about_title ?? config.company_name}
        text={config.about_text ?? ""}
        years={config.about_years ?? "10+"}
        projects={config.about_projects ?? "200+"}
      />
      <CTA phone={config.phone ?? ""} email={config.email ?? ""} />
      <Footer companyName={config.company_name} />
      <WhatsAppButton number={config.whatsapp} />
    </main>
  );
}
