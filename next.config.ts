import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.thecatapi.com" },
      { protocol: "https", hostname: "cdn2.thecatapi.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: false,
    domains: [],
  },
  // News article images come from arbitrary domains — use <img> tag in ArticleCard
};

export default nextConfig;
