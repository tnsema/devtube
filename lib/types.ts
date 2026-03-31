export type VideoSearchResult = {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
};

export type SearchApiResponse = {
  query: string;
  results: VideoSearchResult[];
  error?: string;
};

type YouTubeThumbnail = {
  url: string;
};

type YouTubeSearchItem = {
  id: {
    videoId?: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
  };
};

export type YouTubeSearchResponse = {
  items: YouTubeSearchItem[];
};
