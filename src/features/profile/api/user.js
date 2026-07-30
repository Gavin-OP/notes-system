import { applyUserSessionAuth, clearUserSessionToken, setUserSessionToken } from "../../../shared/api/userSessionToken";

export class UserApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "UserApiError";
    this.status = status;
    this.data = data;
  }
}

function getUserApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function buildUserApiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getUserApiBaseUrl();
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
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (/^<!doctype html>/i.test(trimmed) || /^<html[\s>]/i.test(trimmed)) {
      return "User service is unavailable in this deployment. Please deploy backend APIs to enable profile features.";
    }
    return payload;
  }
  if (typeof payload?.detail === "string") return payload.detail;
  if (Array.isArray(payload?.detail)) {
    const detailText = payload.detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const field =
            Array.isArray(item.loc) && item.loc.length > 0 ? item.loc.slice(1).join(".") : "";
          const msg = typeof item.msg === "string" ? item.msg : "";
          if (field && msg) return `${field}: ${msg}`;
          if (msg) return msg;
        }
        return "";
      })
      .filter(Boolean)
      .join("; ");
    if (detailText) return detailText;
  }
  if (typeof payload?.message === "string") return payload.message;
  return fallback;
}

async function userApiRequest(path, init = {}) {
  const headers = new Headers(init.headers || {});
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  applyUserSessionAuth(headers);

  const response = await fetch(buildUserApiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const text = await response.text();
  const payload = parsePayload(text);
  if (!response.ok) {
    throw new UserApiError(
      response.status,
      getErrorMessage(payload, "User API request failed."),
      payload,
    );
  }
  return payload;
}

function persistSessionToken(payload) {
  if (payload?.session_token) setUserSessionToken(payload.session_token);
  return payload;
}

export async function registerUser(payload) {
  return persistSessionToken(await userApiRequest("/api/v1/users/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }));
}

export async function loginUser(payload) {
  return persistSessionToken(await userApiRequest("/api/v1/users/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }));
}

export async function logoutUser() {
  try {
    return await userApiRequest("/api/v1/users/auth/logout", {
      method: "POST",
    });
  } finally {
    clearUserSessionToken();
  }
}

export function clearStoredUserSession() {
  clearUserSessionToken();
}

export function logoutUserViaTokenOnly() {
  clearUserSessionToken();
  return userApiRequest("/api/v1/users/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return userApiRequest("/api/v1/users/auth/me");
}

export function getMyProfile() {
  return userApiRequest("/api/v1/users/me/profile");
}

export function updateMyProfile(payload) {
  return userApiRequest("/api/v1/users/me/profile", {
    method: "PATCH",
    body: JSON.stringify({
      display_name: payload?.displayName ?? payload?.display_name ?? undefined,
    }),
  });
}

export function getMyGuideState() {
  return userApiRequest("/api/v1/users/me/guides");
}

export function updateMyGuideState(payload) {
  return userApiRequest("/api/v1/users/me/guides", {
    method: "PATCH",
    body: JSON.stringify({
      guide_key: payload?.guideKey ?? "",
      seen: payload?.seen,
      completed: payload?.completed,
      current_step:
        typeof payload?.currentStep === "number" ? payload.currentStep : undefined,
    }),
  });
}

export function completeMyNote(payload) {
  return userApiRequest("/api/v1/users/me/notes/complete", {
    method: "POST",
    body: JSON.stringify({
      note_id: payload?.noteId ?? "",
      package_id: payload?.packageId ?? "",
      note_url: payload?.noteUrl ?? "",
      note_title: payload?.noteTitle ?? "",
      subject: payload?.subject ?? "",
    }),
  });
}

export function uncompleteMyNote(payload) {
  return userApiRequest("/api/v1/users/me/notes/uncomplete", {
    method: "POST",
    body: JSON.stringify({
      note_url: payload?.noteUrl ?? "",
    }),
  });
}

export function getMyNoteQuotes(noteUrl = "") {
  const query = noteUrl ? `?note_url=${encodeURIComponent(noteUrl)}` : "";
  return userApiRequest(`/api/v1/users/me/annotations${query}`);
}

export function createMyNoteQuote(payload) {
  return userApiRequest("/api/v1/users/me/annotations", {
    method: "POST",
    body: JSON.stringify({
      note_url: payload?.noteUrl ?? "",
      note_title: payload?.noteTitle ?? "",
      subject: payload?.subject ?? "",
      selected_text: payload?.selectedText ?? "",
      personal_note: payload?.personalNote ?? payload?.personal_note ?? "",
      context_before: payload?.contextBefore ?? "",
      context_after: payload?.contextAfter ?? "",
      note_version_id: payload?.noteVersionId ?? "current",
      note_content_hash: payload?.noteContentHash ?? "",
    }),
  });
}

export function updateMyAnnotationStatus(annotationId, status) {
  return userApiRequest(`/api/v1/users/me/annotations/${encodeURIComponent(annotationId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteMyAnnotation(annotationId) {
  return userApiRequest(`/api/v1/users/me/annotations/${encodeURIComponent(annotationId)}`, {
    method: "DELETE",
  });
}

export function getUserProgress(userId) {
  return userApiRequest(`/api/v1/users/${encodeURIComponent(userId)}/progress`);
}
