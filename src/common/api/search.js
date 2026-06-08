export class SearchApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "SearchApiError";
    this.status = status;
    this.data = data;
  }
}

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

function parsePayload(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function searchRequest(path, init = {}) {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    credentials: "include",
  });
  const text = await response.text();
  const payload = parsePayload(text);
  if (!response.ok) {
    throw new SearchApiError(
      response.status,
      typeof payload?.detail === "string" ? payload.detail : "Search request failed.",
      payload,
    );
  }
  return payload;
}

export function searchNotes({ query, subject = "", limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  params.set("q", query || "");
  if (subject) params.set("subject", subject);
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  return searchRequest(`/api/v1/search/notes?${params.toString()}`);
}

export function buildSearchResultUrl(result, query = "") {
  const noteUrl = result?.note_url || result?.noteUrl || "";
  if (!noteUrl) return "";
  const params = new URLSearchParams();
  if (query) params.set("search", query);
  const matchText = result?.match_text || result?.matchText || result?.snippet || "";
  if (matchText) params.set("match", matchText.slice(0, 240));
  const queryString = params.toString();
  const sectionAnchor = result?.section_anchor || result?.sectionAnchor || "";
  return `${noteUrl}${queryString ? `?${queryString}` : ""}${sectionAnchor ? `#${sectionAnchor}` : ""}`;
}
