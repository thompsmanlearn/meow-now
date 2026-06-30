import Link from "next/link";

export const revalidate = 3600;

const SEED_ARTICLES = [
  "Cat",
  "Cat_behavior",
  "Cat_communication",
  "Cat_intelligence",
  "Catnip",
  "Felidae",
  "Wildcat",
  "Lion",
  "Tiger",
  "Leopard",
  "Cheetah",
  "Persian_cat",
  "Siamese_cat",
  "Maine_Coon",
  "Scottish_Fold",
];

const WIKI_HEADERS = {
  "User-Agent": "MeowNow/1.0 (meow-now.vercel.app)",
};

interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: { source: string };
  content_urls: { desktop: { page: string } };
  views: number;
}

function prevMonthWindow(): { start: string; end: string } {
  const now = new Date();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 12 : now.getMonth();
  const pad = (n: number) => String(n).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();
  return { start: `${year}${pad(month)}01`, end: `${year}${pad(month)}${lastDay}` };
}

async function fetchViews(title: string, start: string, end: string): Promise<number> {
  try {
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(title)}/monthly/${start}/${end}`;
    const res = await fetch(url, { headers: WIKI_HEADERS, next: { revalidate: 3600 } });
    if (!res.ok) return 0;
    const data = await res.json();
    return (data.items as Array<{ views: number }>).reduce((sum, i) => sum + i.views, 0);
  } catch {
    return 0;
  }
}

async function fetchSummary(title: string): Promise<WikiSummary | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: WIKI_HEADERS, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      title: d.title,
      extract: d.extract ?? "",
      thumbnail: d.thumbnail,
      content_urls: d.content_urls,
      views: 0,
    };
  } catch {
    return null;
  }
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function ArticleCard({ article }: { article: WikiSummary }) {
  return (
    <Link
      href={article.content_urls.desktop.page}
      target="_blank"
      rel="noopener noreferrer"
      className="cat-card bg-white rounded-2xl overflow-hidden shadow flex flex-col hover:shadow-lg transition-all"
    >
      <div className="relative aspect-video bg-stone-100 overflow-hidden">
        {article.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.thumbnail.source}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🐱</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
          <span className="font-medium text-amber-600">Wikipedia</span>
          {article.views > 0 && (
            <>
              <span>·</span>
              <span>{formatViews(article.views)} views last month</span>
            </>
          )}
        </div>
        <h3 className="font-semibold text-stone-800 text-sm leading-snug mb-2">
          {article.title}
        </h3>
        <p className="text-stone-500 text-xs leading-relaxed line-clamp-4 flex-1">
          {article.extract}
        </p>
        <span className="text-amber-600 text-xs font-medium mt-3 hover:underline">
          Read on Wikipedia →
        </span>
      </div>
    </Link>
  );
}

export default async function WikiPage() {
  const { start, end } = prevMonthWindow();

  const viewCounts = await Promise.all(
    SEED_ARTICLES.map((title) => fetchViews(title, start, end))
  );

  const ranked = SEED_ARTICLES
    .map((title, i) => ({ title, views: viewCounts[i] }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const summaries = await Promise.all(
    ranked.map(({ title, views }) =>
      fetchSummary(title).then((s) => s ? { ...s, views } : null)
    )
  );

  const articles = summaries.filter((s): s is WikiSummary => s !== null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">📖 Cat on Wikipedia</h1>
        <p className="text-stone-500">
          The most-read cat articles on Wikipedia last month, ranked by pageviews.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <div className="text-5xl mb-4">📖</div>
          <p>Wikipedia articles loading — check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.title} article={article} />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-stone-400 mt-12">
        Content from{" "}
        <Link
          href="https://www.wikipedia.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-600 underline"
        >
          Wikipedia
        </Link>
        {" "}· Licensed under{" "}
        <Link
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-600 underline"
        >
          CC BY-SA 4.0
        </Link>
        {" "}· Updated hourly
      </p>
    </div>
  );
}
