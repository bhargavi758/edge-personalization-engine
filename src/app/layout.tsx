import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Edge Personalization Engine",
  description:
    "A Next.js 14 demonstration of Edge Middleware, A/B testing, feature flags, geolocation personalization, and ISR caching strategies.",
};

function SidebarNav() {
  const links = [
    {
      href: "/",
      label: "Overview",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
        </svg>
      ),
    },
    {
      href: "/experiments",
      label: "A/B Tests",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.341 4.023a2.25 2.25 0 0 1-2.134 1.527H8.475a2.25 2.25 0 0 1-2.134-1.527L5 14.5m14 0H5" />
        </svg>
      ),
    },
    {
      href: "/features",
      label: "Feature Flags",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
      ),
    },
    {
      href: "/regional",
      label: "Regional",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558" />
        </svg>
      ),
    },
  ];

  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-sidebar")}>
      <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <span className="text-xs font-bold text-primary-foreground">E</span>
        </div>
        <span className="text-sm font-semibold text-white">Edge Engine</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium",
              "text-sidebar-foreground transition-colors",
              "hover:bg-white/5 hover:text-white"
            )}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground">
          v1.0.0 &middot; Edge
        </p>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-14 items-center justify-between",
      "border-b border-border bg-background/80 px-6 backdrop-blur-md"
    )}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-sm font-medium text-foreground">Overview</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Edge Active
        </span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className={cn("border-t border-border bg-muted/50 px-6 py-4")}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Edge Personalization Engine &mdash; Next.js 14 &amp; Edge Middleware
        </p>
        <div className="flex gap-4">
          <a
            href="https://nextjs.org/docs/app/building-your-application/routing/middleware"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Middleware Docs
          </a>
          <a
            href="https://vercel.com/docs/functions/edge-functions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Edge Functions
          </a>
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
      <body className="min-h-screen bg-background font-sans">
        <SidebarNav />
        <div className="pl-56">
          <TopBar />
          <main className="min-h-[calc(100vh-7rem)]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
