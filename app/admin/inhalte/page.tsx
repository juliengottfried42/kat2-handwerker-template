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
