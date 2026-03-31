import { VideoCard } from "@/components/video-card";
import type { VideoSearchResult } from "@/lib/types";

type VideoGridProps = {
  query: string;
  videos: VideoSearchResult[];
  isLoading: boolean;
  errorMessage: string | null;
  savedVideoIds: Set<string>;
  onRetry: () => void;
  onToggleWatchLater: (video: VideoSearchResult) => void;
};

export function VideoGrid({
  query,
  videos,
  isLoading,
  errorMessage,
  savedVideoIds,
  onRetry,
  onToggleWatchLater,
}: VideoGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
          >
            <div className="aspect-video animate-pulse bg-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="h-5 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-5 w-4/5 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-[32px] border border-red-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto max-w-lg space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-slate-950">Search temporarily unavailable</h3>
          <p className="text-sm leading-7 text-slate-600">{errorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-[#072E33] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a3d43]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-slate-950">No videos matched “{query}”</h3>
          <p className="text-sm leading-7 text-slate-600">
            Try a broader term, switch to another learning category, or refresh the results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard
          key={video.videoId}
          video={video}
          isSaved={savedVideoIds.has(video.videoId)}
          onToggleWatchLater={onToggleWatchLater}
        />
      ))}
    </div>
  );
}
