import { NextResponse } from "next/server";
import { DEFAULT_QUERY, MAX_RESULTS } from "@/lib/config";
import type { SearchApiResponse, YouTubeSearchResponse } from "@/lib/types";
import { normalizeQuery } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = normalizeQuery(new URL(request.url).searchParams.get("q")) || DEFAULT_QUERY;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        query,
        results: [],
        error: "Missing YOUTUBE_API_KEY on the server.",
      } satisfies SearchApiResponse,
      { status: 500 },
    );
  }

  const youtubeUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  youtubeUrl.search = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: String(MAX_RESULTS),
    q: query,
    key: apiKey,
  }).toString();

  try {
    const response = await fetch(youtubeUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;

      return NextResponse.json(
        {
          query,
          results: [],
          error:
            errorPayload?.error?.message ||
            "YouTube search is currently unavailable. Please try again shortly.",
        } satisfies SearchApiResponse,
        { status: 502 },
      );
    }

    const payload = (await response.json()) as YouTubeSearchResponse;
    const results = payload.items
      .map((item) => {
        const videoId = item.id.videoId;

        if (!videoId) {
          return null;
        }

        return {
          videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          thumbnail:
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url ||
            "",
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    return NextResponse.json(
      {
        query,
        results,
      } satisfies SearchApiResponse,
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        query,
        results: [],
        error: "We couldn't reach YouTube right now. Please retry in a moment.",
      } satisfies SearchApiResponse,
      { status: 500 },
    );
  }
}
