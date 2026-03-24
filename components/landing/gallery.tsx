import { GallerySlider } from "./gallery-slider";

interface GalleryItem { id: string; title: string; before_image: string; after_image: string; }

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
