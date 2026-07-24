import { adminApiRequest } from "./client";

export function getAdminSession() {
  return adminApiRequest("/api/v1/admin/auth/me");
}

export function loginAdmin(credentials) {
  return adminApiRequest("/api/v1/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function logoutAdmin() {
  return adminApiRequest("/api/v1/admin/auth/logout", {
    method: "POST",
  });
}

export function getAdminOverview() {
  return adminApiRequest("/api/v1/admin/dashboard/overview");
}

export function getAdminSubjects() {
  return adminApiRequest("/api/v1/admin/content/subjects");
}

export function getAdminSubjectDetail(subjectSlug) {
  return adminApiRequest(
    `/api/v1/admin/content/subjects/${encodeURIComponent(subjectSlug)}`,
  );
}

export function getAdminSystemStatus() {
  return adminApiRequest("/api/v1/admin/system/status");
}

export function getPublicationReviewQueue(status = "pending") {
  return adminApiRequest(`/api/v1/admin/community/publication-reviews?status=${encodeURIComponent(status)}`);
}

export function decidePublicationReview(reviewId, payload) {
  return adminApiRequest(
    `/api/v1/admin/community/publication-reviews/${encodeURIComponent(reviewId)}/decision`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function getCanonicalSuggestionQueue(status = "pending") {
  return adminApiRequest(`/api/v1/admin/community/canonical-suggestions?status=${encodeURIComponent(status)}`);
}

export function decideCanonicalSuggestion(suggestionId, payload) {
  return adminApiRequest(
    `/api/v1/admin/community/canonical-suggestions/${encodeURIComponent(suggestionId)}/decision`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
