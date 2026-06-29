import RedditTabs from "./RedditTabs";

interface RedditPost {
  id: string;
  title: string;
  imageUrl: string;
  score: number;
  author: string;
  permalink: string;
  subreddit: string;
}

async function fetchSubreddit(name: string): Promise<RedditPost[]> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${name}/hot.json?limit=50`,
      {
        headers: { "User-Agent": "MeowNow/1.0 (cat photo site)" },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.data.children as { data: Record<string, unknown> }[])
      .map((c) => c.data)
      .filter((p) => {
        const hint = p.post_hint as string | undefined;
        const preview = p.preview as { images?: { source?: { url?: string } }[] } | undefined;
        if (hint === "image") return true;
        if (preview?.images?.[0]?.source?.url) return true;
        return false;
      })
      .map((p) => {
        const preview = p.preview as { images?: { source?: { url?: string } }[] } | undefined;
        let imageUrl = p.url as string;
        if (preview?.images?.[0]?.source?.url) {
          imageUrl = preview.images[0].source!.url!.replace(/&amp;/g, "&");
        }
        return {
          id: p.id as string,
          title: p.title as string,
          imageUrl,
          score: p.score as number,
          author: p.author as string,
          permalink: `https://reddit.com${p.permalink as string}`,
          subreddit: p.subreddit as string,
        };
      })
      .slice(0, 24);
  } catch {
    return [];
  }
}

export default async function RedditPage() {
  const [cats, smol, catpictures] = await Promise.all([
    fetchSubreddit("cats"),
    fetchSubreddit("IllegallySmolCats"),
    fetchSubreddit("catpictures"),
  ]);

  const subreddits = [
    { name: "cats", posts: cats },
    { name: "IllegallySmolCats", posts: smol },
    { name: "catpictures", posts: catpictures },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          🤖 Reddit Cat Community
        </h1>
        <p className="text-stone-500">
          Top posts from the best cat subreddits, updated every 30 minutes.
        </p>
      </div>

      <RedditTabs subreddits={subreddits} />
    </div>
  );
}
