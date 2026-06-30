import VideoGrid from "./VideoGrid";
import RefreshButton from "./RefreshButton";

interface YTItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { high: { url: string } };
    publishedAt: string;
  };
}

async function getFunnyCatVideos() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];
  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: "funny cats",
      type: "video",
      maxResults: "18",
      order: "viewCount",
      videoCategoryId: "15",
      key,
    });
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items as YTItem[]).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch {
    return [];
  }
}

export default async function VideosPage() {
  const videos = await getFunnyCatVideos();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">🎬 Funny Cat Videos</h1>
        <p className="text-stone-500">
          The best cat videos on YouTube — click any thumbnail to watch right here.
          Updated hourly.
        </p>
        <div className="mt-3"><RefreshButton /></div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-4">🐱</div>
          <p>Videos loading — check back shortly.</p>
        </div>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}
