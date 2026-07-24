import { applyUserSessionAuth } from "../../../shared/api/userSessionToken";


function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function buildUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalized}`;
}

function resolveError(payload, fallback) {
  if (typeof payload?.detail === "string") return payload.detail;
  if (typeof payload === "string") return payload;
  return fallback;
}

async function request(path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  applyUserSessionAuth(headers);
  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    throw new Error(resolveError(payload, "Podcast request failed."));
  }
  return payload;
}

export function listPodcasts() {
  return request("/api/v1/podcasts");
}

export function createPodcast(payload) {
  return request("/api/v1/podcasts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPodcast(episodeId) {
  return request(`/api/v1/podcasts/${encodeURIComponent(episodeId)}`);
}

export function renderPodcast(episodeId, payload) {
  return request(`/api/v1/podcasts/${encodeURIComponent(episodeId)}/render`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePodcastPlayback(episodeId, payload) {
  return request(`/api/v1/podcasts/${encodeURIComponent(episodeId)}/playback`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function podcastAudioUrl(path) {
  return buildUrl(path);
}
