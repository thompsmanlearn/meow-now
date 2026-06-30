import Link from "next/link";

const nav = [
  { href: "/photos", label: "Photos" },
  { href: "/videos", label: "Videos" },
  { href: "/facts", label: "Facts & Care" },
  { href: "/news", label: "News" },
  { href: "/wiki", label: "Wiki" },
  { href: "/community", label: "Community" },
];

export default function Header() {
  return (
    <header className="bg-stone-800 text-amber-50 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight hover:text-amber-300 transition-colors">
          <span>🐱</span>
          <span>Meow Now</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-amber-300 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/community"
          className="bg-amber-400 hover:bg-amber-300 text-stone-800 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
        >
          Share a Photo
        </Link>
      </div>
    </header>
  );
}
