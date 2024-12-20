import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Edge Personalization Engine",
  description:
    "A Next.js 14 demonstration of Edge Middleware, A/B testing, feature flags, geolocation personalization, and ISR caching strategies.",
};

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stanford-red">
            <span className="text-lg font-bold text-white">E</span>
          </div>
          <span className="hidden text-lg font-semibold text-stanford-black sm:block">
            Edge Engine
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="/experiments"
            className="rounded-md px-3 py-2 text-sm font-medium text-stanford-cool-grey transition-colors hover:bg-stanford-fog hover:text-stanford-black"
          >
            A/B Tests
          </a>
          <a
            href="/features"
            className="rounded-md px-3 py-2 text-sm font-medium text-stanford-cool-grey transition-colors hover:bg-stanford-fog hover:text-stanford-black"
          >
            Feature Flags
          </a>
          <a
            href="/regional"
            className="rounded-md px-3 py-2 text-sm font-medium text-stanford-cool-grey transition-colors hover:bg-stanford-fog hover:text-stanford-black"
          >
            Regional
          </a>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-stanford-fog">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-stanford-cool-grey">
            Edge Personalization Engine — Built with Next.js 14 &amp; Edge
            Middleware
          </p>
          <div className="flex gap-6">
            <a
              href="https://nextjs.org/docs/app/building-your-application/routing/middleware"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stanford-cool-grey underline-offset-4 hover:text-stanford-red hover:underline"
            >
              Middleware Docs
            </a>
            <a
              href="https://vercel.com/docs/functions/edge-functions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stanford-cool-grey underline-offset-4 hover:text-stanford-red hover:underline"
            >
              Edge Functions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
