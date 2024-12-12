export const CacheStrategy = {
  STATIC: {
    revalidate: false as const,
    tags: [] as string[],
  },
  ISR_SHORT: {
    revalidate: 60,
    tags: ["short-lived"],
  },
  ISR_MEDIUM: {
    revalidate: 300,
    tags: ["medium-lived"],
  },
  ISR_LONG: {
    revalidate: 3600,
    tags: ["long-lived"],
  },
  DYNAMIC: {
    revalidate: 0,
    tags: ["dynamic"],
  },
} as const;

export type CacheStrategyKey = keyof typeof CacheStrategy;

export function getCacheHeaders(strategy: CacheStrategyKey): Record<string, string> {
  const config = CacheStrategy[strategy];

  if (config.revalidate === false) {
    return {
      "Cache-Control": "public, max-age=31536000, immutable",
      "CDN-Cache-Control": "public, max-age=31536000",
    };
  }

  if (config.revalidate === 0) {
    return {
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "CDN-Cache-Control": "private, no-cache",
    };
  }

  return {
    "Cache-Control": `public, s-maxage=${config.revalidate}, stale-while-revalidate=${config.revalidate * 2}`,
    "CDN-Cache-Control": `public, max-age=${config.revalidate}`,
  };
}

export function getRevalidateInterval(strategy: CacheStrategyKey): number | false {
  return CacheStrategy[strategy].revalidate;
}

export function getPageCacheStrategy(pathname: string): CacheStrategyKey {
  if (pathname === "/") return "ISR_MEDIUM";
  if (pathname.startsWith("/experiments")) return "DYNAMIC";
  if (pathname.startsWith("/features")) return "DYNAMIC";
  if (pathname.startsWith("/regional")) return "ISR_SHORT";
  return "ISR_LONG";
}
