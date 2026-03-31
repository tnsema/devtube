"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { SearchBar } from "@/components/search-bar";
import { VideoGrid } from "@/components/video-grid";
import {
  APP_NAME,
  CATEGORY_OPTIONS,
  DEFAULT_QUERY,
  PRIMARY_COLOR,
  SEARCH_DEBOUNCE_MS,
} from "@/lib/config";
import type { SearchApiResponse, VideoSearchResult } from "@/lib/types";
import {
  buildCategoryQuery,
  formatCountLabel,
  getCategoryForQuery,
  normalizeQuery,
} from "@/lib/utils";

const RECENT_SEARCHES_KEY = "cloudtube-recent-searches";
const WATCH_LATER_KEY = "cloudtube-watch-later";

export default function HomePage() {
  const [searchInput, setSearchInput] = useState(DEFAULT_QUERY);
  const [activeQuery, setActiveQuery] = useState(DEFAULT_QUERY);
  const [videos, setVideos] = useState<VideoSearchResult[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [watchLater, setWatchLater] = useState<VideoSearchResult[]>([]);
  const [reloadToken, setReloadToken] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>(getCategoryForQuery(DEFAULT_QUERY));

  const savedVideoIds = useMemo(
    () => new Set(watchLater.map((video) => video.videoId)),
    [watchLater],
  );

  useEffect(() => {
    const storedRecentSearches = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const storedWatchLater = window.localStorage.getItem(WATCH_LATER_KEY);

    if (storedRecentSearches) {
      try {
        const parsed = JSON.parse(storedRecentSearches) as string[];
        setRecentSearches(parsed.slice(0, 5));
      } catch {
        window.localStorage.removeItem(RECENT_SEARCHES_KEY);
      }
    }

    if (storedWatchLater) {
      try {
        const parsed = JSON.parse(storedWatchLater) as VideoSearchResult[];
        setWatchLater(parsed);
      } catch {
        window.localStorage.removeItem(WATCH_LATER_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const normalized = normalizeQuery(searchInput) || DEFAULT_QUERY;

    if (normalized === activeQuery) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveCategory(getCategoryForQuery(normalized));
      setActiveQuery(normalized);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [activeQuery, searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadVideos() {
      setStatus("loading");
      setErrorMessage(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(activeQuery)}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const payload = (await response.json()) as SearchApiResponse;

        if (!response.ok) {
          throw new Error(payload.error || "We couldn't load videos right now.");
        }

        setVideos(payload.results);
        setStatus("success");

        const normalized = normalizeQuery(payload.query) || DEFAULT_QUERY;
        setRecentSearches((previous) => {
          const next = [normalized, ...previous.filter((item) => item !== normalized)].slice(0, 5);
          window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
          return next;
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "We couldn't load videos right now.";
        setErrorMessage(message);
        setStatus("error");
      }
    }

    void loadVideos();

    return () => controller.abort();
  }, [activeQuery, reloadToken]);

  function runSearch(nextQuery: string) {
    const normalized = normalizeQuery(nextQuery) || DEFAULT_QUERY;
    setSearchInput(normalized);
    setActiveCategory(getCategoryForQuery(normalized));
    setActiveQuery(normalized);
  }

  function handleCategorySelect(category: string) {
    setActiveCategory(category);
    runSearch(buildCategoryQuery(category));
  }

  function handleToggleWatchLater(video: VideoSearchResult) {
    setWatchLater((previous) => {
      const exists = previous.some((item) => item.videoId === video.videoId);
      const next = exists
        ? previous.filter((item) => item.videoId !== video.videoId)
        : [video, ...previous].slice(0, 24);

      window.localStorage.setItem(WATCH_LATER_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(7,46,51,0.08)] backdrop-blur xl:p-8">
          <div className="space-y-8">
            

            <div className="space-y-4">
              <SearchBar
                value={searchInput}
                isLoading={status === "loading"}
                onChange={setSearchInput}
                onSubmit={runSearch}
              />

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Recent</span>
                {recentSearches.length > 0 ? (
                  recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => runSearch(item)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    Your recent searches will appear here.
                  </span>
                )}
              </div>

              <FilterBar
                categories={CATEGORY_OPTIONS}
                activeCategory={activeCategory}
                onSelect={handleCategorySelect}
              />
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Live query</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{activeQuery}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Results</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {formatCountLabel(videos.length)}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Watch later</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {formatCountLabel(watchLater.length)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Video results
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fresh results for developers learning cloud platforms, infrastructure, and security.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setReloadToken((value) => value + 1)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Refresh results
            </button>
          </div>

          <VideoGrid
            query={activeQuery}
            videos={videos}
            isLoading={status === "loading"}
            errorMessage={errorMessage}
            savedVideoIds={savedVideoIds}
            onRetry={() => setReloadToken((value) => value + 1)}
            onToggleWatchLater={handleToggleWatchLater}
          />
        </section>
      </section>
    </main>
  );
}
