interface AboutProps {
  title: string;
  text: string;
  years: string;
  projects: string;
  photo?: string;
}

export function About({ title, text, years, projects, photo }: AboutProps) {
  return (
    <section className="py-16 md:py-20 px-5 md:px-12 bg-white" id="ueber">
      <div className="flex flex-col md:flex-row gap-10 md:gap-12 max-w-4xl mx-auto items-center">
        <div className="w-full max-w-xs md:w-72 md:h-80 aspect-[4/5] md:aspect-auto bg-warm-200 rounded-2xl flex-shrink-0 flex items-center justify-center text-warm-600 overflow-hidden">
          {photo ? (
            // Remote user photo — static img ok (may be external domain, no next/image config)
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <span className="text-sm" aria-hidden="true">📷 Foto</span>
          )}
        </div>
        <div className="text-center md:text-left">
          <h2 className="font-serif text-2xl md:text-3xl text-warm-800 mb-3 md:mb-4">{title}</h2>
          <p className="text-warm-600 mb-6 leading-relaxed">{text}</p>
          <dl className="flex gap-8 justify-center md:justify-start">
            <div className="text-center">
              <dt className="text-xs text-warm-600 order-2">Jahre Erfahrung</dt>
              <dd className="font-serif text-3xl text-green-700">{years}</dd>
            </div>
            <div className="text-center">
              <dt className="text-xs text-warm-600 order-2">Projekte</dt>
              <dd className="font-serif text-3xl text-green-700">{projects}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
