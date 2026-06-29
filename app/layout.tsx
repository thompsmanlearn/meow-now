import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Meow Now — Your Daily Dose of Cat",
  description: "Cat photos, videos, news, facts, and community — updated daily.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-amber-50 text-stone-800 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-stone-800 text-amber-100 text-center py-6 text-sm mt-12">
          © {new Date().getFullYear()} Meow Now · Made with ❤️ for cat lovers everywhere
        </footer>
      </body>
    </html>
  );
}
