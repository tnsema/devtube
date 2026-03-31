import { CATEGORY_OPTIONS, DEFAULT_QUERY } from "@/lib/config";

export function normalizeQuery(value: string | null | undefined) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

export function buildCategoryQuery(category: string) {
  switch (category) {
    case "AWS":
      return "cloud aws";
    case "Azure":
      return "cloud azure";
    case "DevOps":
      return "cloud devops";
    case "Linux":
      return "cloud linux";
    case "Networking":
      return "cloud networking";
    case "Cybersecurity":
      return "cloud cybersecurity";
    default:
      return DEFAULT_QUERY;
  }
}

export function getCategoryForQuery(query: string) {
  const normalized = normalizeQuery(query).toLowerCase();

  if (!normalized || normalized === DEFAULT_QUERY) {
    return "All";
  }

  const matchedCategory = CATEGORY_OPTIONS.find((category) => {
    if (category === "All") {
      return false;
    }

    return normalized.includes(category.toLowerCase());
  });

  return matchedCategory ?? "All";
}

export function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function formatPublishedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatCountLabel(value: number) {
  if (value === 1) {
    return "1 video";
  }

  return `${value} videos`;
}
