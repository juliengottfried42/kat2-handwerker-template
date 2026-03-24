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
