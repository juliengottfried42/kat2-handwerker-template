interface AboutProps { title: string; text: string; years: string; projects: string; }

export function About({ title, text, years, projects }: AboutProps) {
  return (
    <section className="py-20 px-6 md:px-12 bg-white" id="ueber">
      <div className="flex flex-col md:flex-row gap-12 max-w-4xl mx-auto items-center">
        <div className="w-72 h-80 bg-warm-200 rounded-2xl flex-shrink-0 flex items-center justify-center text-warm-500 text-sm">📷 Foto</div>
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
