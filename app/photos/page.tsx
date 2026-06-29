import PhotoGallery from "./PhotoGallery";

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
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PhotosPage() {
  const images = await getCatImages(24);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">🐾 Photo Gallery</h1>
        <p className="text-stone-500">
          Fresh cat photos refreshed every 30 minutes. Click any photo to enlarge.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-4">🐱</div>
          <p>Photos loading — check back shortly.</p>
        </div>
      ) : (
        <PhotoGallery initial={images} />
      )}

      <p className="text-center text-xs text-stone-400 mt-10">
        Photos provided by{" "}
        <a
          href="https://thecatapi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-600 underline"
        >
          The Cat API
        </a>
      </p>
    </div>
  );
}
