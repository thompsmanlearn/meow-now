"use client";

import Image from "next/image";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  publishedAt: string;
}

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-2xl overflow-hidden w-full max-w-3xl aspect-video relative"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function VideoGrid({ videos }: { videos: Video[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <>
      {activeId && (
        <VideoModal videoId={activeId} onClose={() => setActiveId(null)} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveId(v.id)}
            className="cat-card bg-white rounded-2xl overflow-hidden shadow text-left hover:shadow-lg transition-all"
          >
            <div className="relative aspect-video bg-stone-200">
              <Image
                src={v.thumbnail}
                alt={v.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg opacity-90 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xl ml-1">▶</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2 mb-1">
                {v.title}
              </h3>
              <p className="text-stone-400 text-xs">{v.channel}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
