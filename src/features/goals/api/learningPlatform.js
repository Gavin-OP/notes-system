import { applyUserSessionAuth } from "../../../shared/api/userSessionToken";

export class LearningPlatformApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "LearningPlatformApiError";
    this.status = status;
    this.data = data;
  }
}

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function buildUrl(path) {
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

function resolveErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (typeof payload?.detail === "string") return payload.detail;
  if (Array.isArray(payload?.detail)) {
    const message = payload.detail
      .map((item) => item?.msg || item)
      .filter(Boolean)
      .join("; ");
    if (message) return message;
  }
  return payload?.message || fallback;
}

export async function request(path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  applyUserSessionAuth(headers);
  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });
  const payload = parsePayload(await response.text());
  if (!response.ok) {
    throw new LearningPlatformApiError(
      response.status,
      resolveErrorMessage(payload, "Learning platform request failed."),
      payload,
    );
  }
  return payload;
}

export function getGoalTypes() {
  return request("/api/v1/goals/types");
}

export function listGoals({ includeArchived = false } = {}) {
  const query = includeArchived ? "?include_archived=true" : "";
  return request(`/api/v1/goals${query}`);
}

export function createGoal(payload) {
  return request("/api/v1/goals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateGoal(goalId, payload) {
  return request(`/api/v1/goals/${encodeURIComponent(goalId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function archiveGoal(goalId) {
  return request(`/api/v1/goals/${encodeURIComponent(goalId)}`, {
    method: "DELETE",
  });
}

export function getLearningArchetypes() {
  return request("/api/v1/courses/archetypes");
}

export function listCourses({ mine = false, domainSlug = "" } = {}) {
  const params = new URLSearchParams();
  if (mine) params.set("mine", "true");
  if (domainSlug) params.set("domain_slug", domainSlug);
  const query = params.toString();
  return request(`/api/v1/courses${query ? `?${query}` : ""}`);
}

export function createCourse(payload) {
  return request("/api/v1/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCourse(courseId) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}`);
}

export function updateCourse(courseId, payload) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function listCourseVersions(courseId) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/versions`);
}

export function createCourseVersion(courseId, payload) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/versions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listCommunityCourses({ domainSlug = "" } = {}) {
  const query = domainSlug ? `?domain_slug=${encodeURIComponent(domainSlug)}` : "";
  return request(`/api/v1/courses/community${query}`);
}

export function getCommunityCourse(courseId) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/community`);
}

export function listCourseLibrary() {
  return request("/api/v1/courses/library");
}

export function updateCourseLibrary(courseId, action, enabled) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/library`, {
    method: "POST",
    body: JSON.stringify({ action, enabled }),
  });
}

export function getMyAuthorProfile() {
  return request("/api/v1/courses/authors/me");
}

export function updateMyAuthorProfile(payload) {
  return request("/api/v1/courses/authors/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getAuthorProfile(authorUserId) {
  return request(`/api/v1/courses/authors/${encodeURIComponent(authorUserId)}`);
}

export function createAuthoringVersion(courseId, payload) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/authoring-versions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function reviseCourse(courseId, instruction) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/revisions`, {
    method: "POST",
    body: JSON.stringify({ instruction }),
  });
}

export function submitPublicationReview(courseId, submissionNote) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/publication-reviews`, {
    method: "POST",
    body: JSON.stringify({ submission_note: submissionNote }),
  });
}

export function listPublicationReviews(courseId) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/publication-reviews`);
}

export function createCanonicalSuggestion(courseId, payload) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/canonical-suggestions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listCanonicalSuggestions(courseId) {
  return request(`/api/v1/courses/${encodeURIComponent(courseId)}/canonical-suggestions`);
}

export function getPersonalLearningPath() {
  return request("/api/v1/assistant/learning-path");
}

export function generateGoalCourseLearningPath(payload) {
  return request("/api/v1/assistant/learning-path/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
