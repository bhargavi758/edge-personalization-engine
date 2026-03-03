# edge-personalization-engine

Next.js 14 app that does A/B testing, feature flags, and geo-based content at the edge. Everything runs in middleware before the page renders, so no client-side flicker.

## run

```bash
npm install
npm run dev
```

localhost:3000. Geo defaults to US/CA/San Francisco locally since there are no Vercel headers.

## how it works

Middleware reads geo headers, assigns A/B variants (FNV-1a hash, sticky via cookies), evaluates feature flags (percentage rollout + geo targeting), and passes it all to pages via request headers. Pages just read the headers and render.

## pages

- `/` — personalized home (ISR 5min)
- `/experiments` — shows your variant assignments
- `/features` — feature flag demo
- `/regional` — geo content (ISR 60s)

## tech

Next.js 14 (App Router, Edge Middleware, ISR), TypeScript, Tailwind. Pure JS hashing since edge runtime doesn't have Node crypto.

## would like to add

- real analytics backend (just an in-memory buffer right now)
