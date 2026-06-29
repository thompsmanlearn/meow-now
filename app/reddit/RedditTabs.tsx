"use client";

import { useState } from "react";

interface RedditPost {
  id: string;
  title: string;
  imageUrl: string;
  score: number;
  author: string;
  permalink: string;
  subreddit: string;
}

interface SubredditData {
  name: string;
  posts: RedditPost[];
}

function formatScore(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function PostCard({ post }: { post: RedditPost }) {
  return (
    <div className="cat-card bg-white rounded-2xl overflow-hidden shadow flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full aspect-square object-cover"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="p-4 flex flex-col flex-1">
        <p className="text-stone-800 text-sm font-medium leading-snug line-clamp-3 flex-1">
          {post.title}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="text-amber-600 font-semibold">
              ↑ {formatScore(post.score)}
            </span>
            <span>u/{post.author}</span>
          </div>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-600 hover:text-amber-500 font-semibold hover:underline"
          >
            Reddit →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function RedditTabs({ subreddits }: { subreddits: SubredditData[] }) {
  const [active, setActive] = useState(0);
  const current = subreddits[active];

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {subreddits.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActive(i)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              i === active
                ? "bg-amber-400 text-stone-800"
                : "bg-white text-stone-500 hover:bg-amber-50 shadow-sm"
            }`}
          >
            r/{s.name}
          </button>
        ))}
      </div>

      {/* Post grid */}
      {current.posts.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-4">🐱</div>
          <p>Couldn&apos;t load r/{current.name} right now — check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {current.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-stone-400 mt-10">
        Posts from Reddit · Updated every 30 minutes ·{" "}
        <a
          href={`https://reddit.com/r/${current.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-600 underline"
        >
          Browse r/{current.name}
        </a>
      </p>
    </>
  );
}
