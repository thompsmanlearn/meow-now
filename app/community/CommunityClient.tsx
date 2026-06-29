"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  username: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  username: string;
  content: string;
  created_at: string;
}

// ── Auth form ─────────────────────────────────────────────────────────────────
function AuthForm({ onAuth }: { onAuth: (user: { id: string; email: string; username: string }) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (err) throw err;
        if (data.user) onAuth({ id: data.user.id, email, username });
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        const uname = data.user?.user_metadata?.username || email.split("@")[0];
        if (data.user) onAuth({ id: data.user.id, email, username: uname });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-stone-800 mb-6">
        {mode === "signin" ? "Sign In to Share" : "Create Your Account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <input
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-800 font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-stone-500 mt-4">
        {mode === "signin" ? "No account? " : "Already have one? "}
        <button
          className="text-amber-600 hover:underline font-medium"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

// ── Upload form ───────────────────────────────────────────────────────────────
function UploadForm({
  user,
  onUploaded,
}: {
  user: { id: string; username: string };
  onUploaded: () => void;
}) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("community-photos")
        .upload(path, file);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage
        .from("community-photos")
        .getPublicUrl(path);
      const { error: insertErr } = await supabase.from("community_posts").insert({
        user_id: user.id,
        username: user.username,
        image_url: urlData.publicUrl,
        caption: caption.trim() || null,
      });
      if (insertErr) throw insertErr;
      setCaption("");
      setFile(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
      <h3 className="font-bold text-stone-800 mb-4">📸 Share Your Cat</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          required
          className="text-sm text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-amber-400 file:text-stone-800 file:font-semibold file:cursor-pointer hover:file:bg-amber-300"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="rounded-xl max-h-48 object-cover" />
        )}
        <input
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          placeholder="Add a caption… (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={280}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !file}
          className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-800 font-semibold px-6 py-2 rounded-full transition-colors text-sm"
        >
          {loading ? "Uploading…" : "Post Photo"}
        </button>
      </form>
    </div>
  );
}

// ── Comment section ───────────────────────────────────────────────────────────
function CommentSection({
  postId,
  user,
}: {
  postId: string;
  user: { id: string; username: string } | null;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  async function loadComments() {
    const { data } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments(data || []);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    await supabase.from("community_comments").insert({
      post_id: postId,
      user_id: user.id,
      username: user.username,
      content: text.trim(),
    });
    setText("");
    loadComments();
  }

  function handleOpen() {
    setOpen(!open);
    if (!open) loadComments();
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleOpen}
        className="text-xs text-stone-500 hover:text-amber-600 transition-colors"
      >
        {open ? "Hide comments" : "💬 Comments"}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="text-xs text-stone-600 flex gap-2">
              <span className="font-semibold text-stone-800">{c.username}</span>
              <span>{c.content}</span>
            </div>
          ))}
          {user ? (
            <form onSubmit={submitComment} className="flex gap-2 mt-2">
              <input
                className="flex-1 border border-stone-200 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Add a comment…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={280}
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                Post
              </button>
            </form>
          ) : (
            <p className="text-xs text-stone-400 mt-1">Sign in to comment.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Post grid ─────────────────────────────────────────────────────────────────
function PostGrid({
  posts,
  user,
}: {
  posts: Post[];
  user: { id: string; username: string } | null;
}) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <div className="text-5xl mb-4">📸</div>
        <p>No photos yet — be the first to share your cat!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow cat-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.caption || "Community cat photo"}
            className="w-full aspect-square object-cover"
          />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-stone-800">
                {post.username[0].toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-stone-800">{post.username}</span>
            </div>
            {post.caption && (
              <p className="text-stone-600 text-sm mt-1">{post.caption}</p>
            )}
            <CommentSection postId={post.id} user={user} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main community client ─────────────────────────────────────────────────────
export default function CommunityClient() {
  const [user, setUser] = useState<{ id: string; email: string; username: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showAuth, setShowAuth] = useState(false);

  async function loadPosts() {
    const { data } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    setPosts(data || []);
  }

  useEffect(() => {
    loadPosts();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        setUser({
          id: u.id,
          email: u.email || "",
          username: u.user_metadata?.username || u.email?.split("@")[0] || "cat lover",
        });
      }
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div>
      {/* Auth bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 mb-1">📸 Community Gallery</h1>
          <p className="text-stone-500">Cat lovers sharing photos from around the world.</p>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-600">Hi, <strong>{user.username}</strong></span>
            <button
              onClick={handleSignOut}
              className="text-sm text-stone-500 hover:text-stone-700 underline"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuth(!showAuth)}
            className="bg-amber-400 hover:bg-amber-300 text-stone-800 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
          >
            Sign In / Join
          </button>
        )}
      </div>

      {showAuth && !user && (
        <div className="mb-8">
          <AuthForm
            onAuth={(u) => {
              setUser(u);
              setShowAuth(false);
            }}
          />
        </div>
      )}

      {user && <UploadForm user={user} onUploaded={loadPosts} />}

      <PostGrid posts={posts} user={user} />
    </div>
  );
}
