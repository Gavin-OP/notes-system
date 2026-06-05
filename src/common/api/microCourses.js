export class MicroCourseApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "MicroCourseApiError";
    this.status = status;
    this.data = data;
  }
}

function getMicroCourseApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function buildMicroCourseApiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getMicroCourseApiBaseUrl();
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

function getErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (typeof payload?.detail === "string") return payload.detail;
  if (typeof payload?.message === "string") return payload.message;
  return fallback;
}

async function microCourseApiRequest(path, init = {}) {
  const response = await fetch(buildMicroCourseApiUrl(path), {
    ...init,
    credentials: "include",
  });

  const text = await response.text();
  const payload = parsePayload(text);
  if (!response.ok) {
    throw new MicroCourseApiError(
      response.status,
      getErrorMessage(payload, "Micro-course API request failed."),
      payload,
    );
  }
  return payload;
}

export function getDataScienceIntroMicroCourse() {
  return microCourseApiRequest("/api/v1/micro-courses/data-science-intro");
}
