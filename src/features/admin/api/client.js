let unauthorizedHandler = null;

export class AdminApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.data = data;
  }
}

export function setAdminUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
}

function getAdminApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function buildAdminApiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getAdminApiBaseUrl();
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
  if (payload && typeof payload === "object" && typeof payload.detail === "string") {
    return payload.detail;
  }
  return fallback;
}

export async function adminApiRequest(path, init = {}) {
  const headers = new Headers(init.headers || {});
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildAdminApiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const text = await response.text();
  const payload = parsePayload(text);

  if (!response.ok) {
    if (response.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    throw new AdminApiError(
      response.status,
      getErrorMessage(payload, "Admin API request failed."),
      payload,
    );
  }

  return payload;
}
