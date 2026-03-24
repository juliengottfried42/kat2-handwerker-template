interface Review { author_name: string; rating: number; text: string; }
interface ReviewsProps { reviews: Review[]; averageRating: number; totalReviews: number; }

export function Reviews({ reviews, averageRating, totalReviews }: ReviewsProps) {
  return (
    <section className="py-20 px-6 md:px-12 bg-warm-50" id="bewertungen">
      <h2 className="font-serif text-4xl text-center text-warm-800 mb-3">Was unsere Kunden sagen</h2>
      <div className="text-center mb-8">
        <div className="text-3xl text-amber-500 tracking-widest">{"★".repeat(Math.round(averageRating))}</div>
        <p className="text-sm text-warm-600 mt-1">{averageRating} von 5 — basierend auf {totalReviews} Google-Bewertungen</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reviews.slice(0, 5).map((r, i) => (
          <div key={i} className="bg-white rounded-2xl p-7 shadow-sm">
            <div className="text-amber-500 text-sm mb-3">{"★".repeat(r.rating)}</div>
            <p className="text-sm text-warm-800 italic leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
            <div className="text-sm font-semibold text-warm-600">{r.author_name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
