const USER_SESSION_TOKEN_KEY = "notes_user_session_token";

export function getUserSessionToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(USER_SESSION_TOKEN_KEY) || "";
}

export function setUserSessionToken(token) {
  if (typeof window === "undefined") return;
  const cleanToken = String(token || "").trim();
  if (cleanToken) {
    window.localStorage.setItem(USER_SESSION_TOKEN_KEY, cleanToken);
  }
}

export function clearUserSessionToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_SESSION_TOKEN_KEY);
}

export function applyUserSessionAuth(headers) {
  const token = getUserSessionToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
}
