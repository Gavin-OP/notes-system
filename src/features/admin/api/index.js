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
