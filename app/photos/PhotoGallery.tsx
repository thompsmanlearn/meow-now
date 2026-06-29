"use client";

import { useState } from "react";
import Image from "next/image";

interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export default function PhotoGallery({ initial }: { initial: CatImage[] }) {
  const [photos, setPhotos] = useState<CatImage[]>(initial);
  const [lightbox, setLightbox] = useState<CatImage | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.thecatapi.com/v1/images/search?limit=24&_=${Date.now()}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data: CatImage[] = await res.json();
        setPhotos((prev) => [...prev, ...data]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {photos.map((img, i) => (
          <div
            key={img.id + i}
            className="cat-card break-inside-avoid cursor-pointer rounded-xl overflow-hidden shadow bg-stone-200"
            onClick={() => setLightbox(img)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt="Cat"
              className="w-full h-auto block hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="flex justify-center mt-12">
        <button
          onClick={loadMore}
          disabled={loading}
          className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-800 font-semibold px-8 py-3 rounded-full transition-colors text-sm"
        >
          {loading ? "Loading…" : "Load More Photos"}
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-amber-400 transition-colors"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <div
            className="relative max-w-3xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt="Cat"
              className="rounded-2xl max-w-full max-h-[90vh] mx-auto object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
