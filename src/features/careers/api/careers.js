export class CareerApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "CareerApiError";
    this.status = status;
    this.data = data;
  }
}

function getCareerApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function buildCareerApiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getCareerApiBaseUrl();
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

async function careerApiRequest(path, init = {}) {
  const headers = new Headers(init.headers || {});
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildCareerApiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const text = await response.text();
  const payload = parsePayload(text);
  if (!response.ok) {
    throw new CareerApiError(
      response.status,
      getErrorMessage(payload, "Career API request failed."),
      payload,
    );
  }
  return payload;
}

export function getMyCareerRecommendations({ limit = 50, minimumMatchScore = 20 } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    minimum_match_score: String(minimumMatchScore),
  });
  return careerApiRequest(`/api/v1/users/me/career-recommendations?${params.toString()}`);
}

export function getCareerTaxonomy() {
  return careerApiRequest("/api/v1/careers/taxonomy");
}

export function getCareerJobDetail(jobId) {
  const encodedJobId = encodeURIComponent(String(jobId || "").trim());
  return careerApiRequest(`/api/v1/careers/jobs/${encodedJobId}`);
}

export function getSubjectJobMatches() {
  return careerApiRequest("/api/v1/careers/subject-job-matches");
}

export function getMyCareerBackground() {
  return careerApiRequest("/api/v1/users/me/career-background");
}

export function updateMyCareerBackground(payload) {
  return careerApiRequest("/api/v1/users/me/career-background", {
    method: "PATCH",
    body: JSON.stringify({
      knowledge_areas: payload?.knowledgeAreas ?? payload?.knowledge_areas ?? [],
      skills: payload?.skills ?? [],
      tools: payload?.tools ?? [],
      career_interests: payload?.careerInterests ?? payload?.career_interests ?? [],
      experience_levels: payload?.experienceLevels ?? payload?.experience_levels ?? [],
    }),
  });
}

export function submitCareerOnboarding(payload) {
  return careerApiRequest("/api/v1/users/me/career-onboarding", {
    method: "POST",
    body: JSON.stringify({
      knowledge_areas: payload?.knowledgeAreas ?? payload?.knowledge_areas ?? [],
      skills: payload?.skills ?? [],
      tools: payload?.tools ?? [],
      career_interests: payload?.careerInterests ?? payload?.career_interests ?? [],
      experience_levels: payload?.experienceLevels ?? payload?.experience_levels ?? [],
    }),
  });
}
