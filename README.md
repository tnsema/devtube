## CloudLens

A polished Next.js App Router app for discovering cloud-learning videos through a secure server-side YouTube search flow.

## Getting Started

1. Create a local env file:

```bash
YOUTUBE_API_KEY=your_youtube_data_api_v3_key
```

Place that value in `.env.local` at the project root. The key is read only on the server from `process.env.YOUTUBE_API_KEY`.

2. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

- The browser calls `app/api/search/route.ts` with a query string.
- That route handler reads `process.env.YOUTUBE_API_KEY` on the server and calls the YouTube Data API v3 search endpoint.
- The route normalizes the YouTube response and returns only the UI-safe fields used by the frontend.
- Client components render the search UI, recent searches, watch-later state, and responsive video cards.

## Notes

- Non-secret app settings live in `lib/config.ts`.
- The YouTube key must never be moved to `NEXT_PUBLIC_*`.
- Recent searches and watch-later items are stored locally in the browser with `localStorage`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
