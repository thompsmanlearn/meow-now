import Link from "next/link";
import RefreshButton from "./RefreshButton";

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
  author: string | null;
}

async function fetchNews(query: string, pageSize = 12): Promise<Article[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      language: "en",
      sortBy: "publishedAt",
      pageSize: String(pageSize),
      apiKey: key,
    });
    const res = await fetch(
      `https://newsapi.org/v2/everything?${params}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles as Article[]).filter(
      (a) => a.title && a.title !== "[Removed]" && a.url
    );
  } catch {
    return [];
  }
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="cat-card bg-white rounded-2xl overflow-hidden shadow flex flex-col hover:shadow-lg transition-all"
    >
      <div className="relative aspect-video bg-stone-100 overflow-hidden">
        {article.urlToImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🐱</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
          <span className="font-medium text-amber-600">{article.source.name}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
        <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-3 flex-1">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-stone-500 text-xs mt-2 line-clamp-2">{article.description}</p>
        )}
        <span className="text-amber-600 text-xs font-medium mt-3 hover:underline">
          Read more →
        </span>
      </div>
    </Link>
  );
}

export default async function NewsPage() {
  const [catNews, researchNews] = await Promise.all([
    fetchNews("cats", 9),
    fetchNews("cat research feline study", 6),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Latest news */}
      <section className="mb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">📰 Cat News</h1>
          <p className="text-stone-500">The latest cat stories from around the world, updated every 5 minutes.</p>
          <div className="mt-3"><RefreshButton /></div>
        </div>
        {catNews.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-5xl mb-4">📰</div>
            <p>News loading — check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catNews.map((a, i) => <ArticleCard key={i} article={a} />)}
          </div>
        )}
      </section>

      {/* Research */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-stone-800 mb-2">🔬 Cat Research</h2>
          <p className="text-stone-500">Recent scientific findings about feline health, behavior, and biology.</p>
        </div>
        {researchNews.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-5xl mb-4">🔬</div>
            <p>Research articles loading — check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchNews.map((a, i) => <ArticleCard key={i} article={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
