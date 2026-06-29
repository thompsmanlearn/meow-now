import Image from "next/image";
import Link from "next/link";

interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

async function getCatImages(count: number): Promise<CatImage[]> {
  try {
    const res = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${count}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const CAT_FACTS = [
  "Cats sleep 12–16 hours a day — that's up to 70% of their lives.",
  "A group of cats is called a clowder.",
  "Cats can make over 100 distinct vocalizations. Dogs can make about 10.",
  "A cat's nose print is as unique as a human fingerprint.",
  "Cats can jump up to 6 times their body length in a single leap.",
  "The oldest known pet cat was found in a 9,500-year-old grave in Cyprus.",
];

export default async function Home() {
  const images = await getCatImages(10);
  const hero = images[0];
  const gridImages = images.slice(1, 9);

  return (
    <>
      {/* Hero */}
      <section className="bg-stone-800 text-amber-50">
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-5">
            <h1 className="text-5xl font-bold leading-tight">
              Your Daily Dose<br />
              <span className="text-amber-400">of Cat.</span>
            </h1>
            <p className="text-lg text-amber-100 max-w-md">
              Fresh cat photos, funny videos, the latest cat news and research —
              updated every day. Plus a community for cat lovers to share and connect.
            </p>
            <div className="flex gap-3 pt-2">
              <Link
                href="/photos"
                className="bg-amber-400 hover:bg-amber-300 text-stone-800 font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Browse Photos
              </Link>
              <Link
                href="/community"
                className="border border-amber-400 hover:bg-amber-400 hover:text-stone-800 text-amber-400 font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Join Community
              </Link>
            </div>
          </div>
          {hero && (
            <div className="flex-1 max-w-md w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src={hero.url}
                  alt="Featured cat"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="text-amber-300 text-xs mt-2 text-right">
                Photos refresh hourly · Powered by The Cat API
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Photo grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Today&apos;s Cats 🐾</h2>
          <Link href="/photos" className="text-amber-600 hover:text-amber-500 font-medium text-sm">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gridImages.map((img) => (
            <div key={img.id} className="cat-card relative aspect-square rounded-xl overflow-hidden bg-stone-200 shadow">
              <Image
                src={img.url}
                alt="Cat"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Cat facts strip */}
      <section className="bg-amber-400 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Did You Know? 🧠</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAT_FACTS.slice(0, 3).map((fact, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm cat-card">
                <p className="text-stone-700 text-sm leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link href="/facts" className="text-stone-800 font-semibold hover:underline text-sm">
              More facts &amp; care tips →
            </Link>
          </div>
        </div>
      </section>

      {/* Section cards */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/videos" className="cat-card bg-white rounded-2xl p-6 shadow text-center hover:bg-amber-50 transition-colors">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="font-bold text-lg mb-1">Funny Cat Videos</h3>
          <p className="text-stone-500 text-sm">The best cat videos from YouTube, curated daily.</p>
        </Link>
        <Link href="/news" className="cat-card bg-white rounded-2xl p-6 shadow text-center hover:bg-amber-50 transition-colors">
          <div className="text-4xl mb-3">📰</div>
          <h3 className="font-bold text-lg mb-1">Cat News &amp; Research</h3>
          <p className="text-stone-500 text-sm">Latest stories and scientific findings about cats.</p>
        </Link>
        <Link href="/community" className="cat-card bg-white rounded-2xl p-6 shadow text-center hover:bg-amber-50 transition-colors">
          <div className="text-4xl mb-3">📸</div>
          <h3 className="font-bold text-lg mb-1">Community Gallery</h3>
          <p className="text-stone-500 text-sm">Share photos of your cat with the world.</p>
        </Link>
      </section>
    </>
  );
}
