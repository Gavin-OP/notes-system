export class NoteVersionApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "NoteVersionApiError";
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

async function noteVersionRequest(path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });
  const text = await response.text();
  const payload = parsePayload(text);
  if (!response.ok) {
    throw new NoteVersionApiError(
      response.status,
      typeof payload?.detail === "string" ? payload.detail : "Note version request failed.",
      payload,
    );
  }
  return payload;
}

export function getNoteVersions(subjectSlug, topicSlug) {
  return noteVersionRequest(
    `/api/v1/notes/${encodeURIComponent(subjectSlug)}/${encodeURIComponent(topicSlug)}/versions`,
  );
}

export function getNoteVersionContent(subjectSlug, topicSlug, versionId) {
  return noteVersionRequest(
    `/api/v1/notes/${encodeURIComponent(subjectSlug)}/${encodeURIComponent(topicSlug)}/versions/${encodeURIComponent(versionId)}`,
  );
}

export function restoreNoteAnnotations(subjectSlug, topicSlug, targetVersionId = "current") {
  return noteVersionRequest(
    `/api/v1/notes/${encodeURIComponent(subjectSlug)}/${encodeURIComponent(topicSlug)}/restore-annotations?target_version_id=${encodeURIComponent(targetVersionId)}`,
    { method: "POST" },
  );
}
