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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary">
            <span className="text-lg font-bold text-white">E</span>
          </div>
          <span className="hidden text-lg font-semibold text-brand-dark sm:block">
            Edge Engine
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="/experiments"
            className="rounded-md px-3 py-2 text-sm font-medium text-brand-cool-grey transition-colors hover:bg-brand-fog hover:text-brand-dark"
          >
            A/B Tests
          </a>
          <a
            href="/features"
            className="rounded-md px-3 py-2 text-sm font-medium text-brand-cool-grey transition-colors hover:bg-brand-fog hover:text-brand-dark"
          >
            Feature Flags
          </a>
          <a
            href="/regional"
            className="rounded-md px-3 py-2 text-sm font-medium text-brand-cool-grey transition-colors hover:bg-brand-fog hover:text-brand-dark"
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
    <footer className="border-t border-gray-200 bg-brand-fog">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-brand-cool-grey">
            Edge Personalization Engine — Built with Next.js 14 &amp; Edge
            Middleware
          </p>
          <div className="flex gap-6">
            <a
              href="https://nextjs.org/docs/app/building-your-application/routing/middleware"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-cool-grey underline-offset-4 hover:text-brand-primary hover:underline"
            >
              Middleware Docs
            </a>
            <a
              href="https://vercel.com/docs/functions/edge-functions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-cool-grey underline-offset-4 hover:text-brand-primary hover:underline"
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
