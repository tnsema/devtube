import Image from "next/image";
import Link from "next/link";
import type { VideoSearchResult } from "@/lib/types";
import { formatPublishedDate, truncateText } from "@/lib/utils";

type VideoCardProps = {
  video: VideoSearchResult;
  isSaved: boolean;
  onToggleWatchLater: (video: VideoSearchResult) => void;
};

export function VideoCard({ video, isSaved, onToggleWatchLater }: VideoCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
      <Link
        href={{
          pathname: `/watch/${video.videoId}`,
          query: {
            title: video.title,
            description: video.description,
            channel: video.channelTitle,
            publishedAt: video.publishedAt,
          },
        }}
        className="block"
      >
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-400">
              Thumbnail unavailable
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            <span>{video.channelTitle}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{formatPublishedDate(video.publishedAt)}</span>
          </div>

          <div className="space-y-2">
            <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-950">
              {video.title}
            </h3>
            <p className="text-sm leading-6 text-slate-600">
              {truncateText(video.description, 140)}
            </p>
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-pressed={isSaved}
        onClick={() => onToggleWatchLater(video)}
        className={`absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition ${
          isSaved
            ? "bg-[#072E33] text-white"
            : "bg-white/92 text-slate-700 backdrop-blur hover:bg-white"
        }`}
      >
        <span>{isSaved ? "Saved" : "Watch later"}</span>
      </button>
    </article>
  );
}
