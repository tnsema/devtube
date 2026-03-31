import Link from "next/link";
import { notFound } from "next/navigation";
import { APP_NAME, PRIMARY_COLOR } from "@/lib/config";
import { formatPublishedDate } from "@/lib/utils";

type WatchPageProps = {
  params: Promise<{ videoId: string }>;
  searchParams: Promise<{
    title?: string | string[];
    description?: string | string[];
    channel?: string | string[];
    publishedAt?: string | string[];
  }>;
};

function readValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function isValidVideoId(videoId: string) {
  return /^[A-Za-z0-9_-]{6,}$/.test(videoId);
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { videoId } = await params;

  if (!isValidVideoId(videoId)) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const title = readValue(resolvedSearchParams.title) || "Video player";
  const description = readValue(resolvedSearchParams.description);
  const channel = readValue(resolvedSearchParams.channel) || "YouTube";
  const publishedAt = readValue(resolvedSearchParams.publishedAt);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-[0_24px_80px_rgba(7,46,51,0.08)] backdrop-blur sm:p-5">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              {APP_NAME} player
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            Back to search
          </Link>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Now playing</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
            {description ? (
              <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-500">
                No description was included for this result.
              </p>
            )}
          </div>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Details</p>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Channel
                </p>
                <p className="mt-1 text-base font-medium text-slate-900">{channel}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Published
                </p>
                <p className="mt-1 text-base font-medium text-slate-900">
                  {publishedAt ? formatPublishedDate(publishedAt) : "Recently"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
