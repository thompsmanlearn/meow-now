"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleRefresh() {
    setLoading(true);
    router.refresh();
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-800 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
    >
      {loading ? "Refreshing…" : "🔄 Refresh"}
    </button>
  );
}
