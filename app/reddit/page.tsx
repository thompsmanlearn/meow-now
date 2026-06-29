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

const SUPABASE_URL = "https://cihbfubghytzqrpffgcq.supabase.co";
const SUPABASE_ANON = "sb_publishable_Z7aAkdc4TUJMxO-mV-8dGw_2zcgObTR";

async function getPostsForSubreddit(name: string): Promise<RedditPost[]> {
  try {
    const params = new URLSearchParams({
      subreddit: `eq.${name}`,
      order: "score.desc",
      limit: "24",
    });
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/reddit_posts?${params}`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const rows: { id: string; title: string; image_url: string; score: number; author: string; permalink: string; subreddit: string }[] = await res.json();
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      imageUrl: r.image_url,
      score: r.score,
      author: r.author,
      permalink: r.permalink,
      subreddit: r.subreddit,
    }));
  } catch {
    return [];
  }
}

export default async function RedditPage() {
  const [cats, smol, catpictures] = await Promise.all([
    getPostsForSubreddit("cats"),
    getPostsForSubreddit("IllegallySmolCats"),
    getPostsForSubreddit("catpictures"),
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
