import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: cached } = await supabaseAdmin()
      .from("site_config")
      .select("value")
      .eq("key", "google_reviews_cache")
      .single();

    if (cached?.value && cached.value !== "{}") {
      const parsed = JSON.parse(cached.value);
      const cacheAge = Date.now() - (parsed.cached_at ?? 0);
      if (cacheAge < 24 * 60 * 60 * 1000) {
        return NextResponse.json(parsed);
      }
    }

    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
      return NextResponse.json({ reviews: [], rating: 0, total: 0 });
    }

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=de&key=${apiKey}`
    );
    const data = await res.json();

    const result = {
      reviews: data.result?.reviews ?? [],
      rating: data.result?.rating ?? 0,
      total: data.result?.user_ratings_total ?? 0,
      cached_at: Date.now(),
    };

    await supabaseAdmin()
      .from("site_config")
      .update({ value: JSON.stringify(result) })
      .eq("key", "google_reviews_cache");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Reviews error:", error);
    return NextResponse.json({ reviews: [], rating: 0, total: 0 });
  }
}
