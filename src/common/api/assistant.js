function getAssistantBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function buildAssistantUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getAssistantBaseUrl();
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

function parseResponsePayload(text) {
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
    const detailText = payload.detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const field =
            Array.isArray(item.loc) && item.loc.length > 0
              ? item.loc.slice(1).join(".")
              : "";
          const msg = typeof item.msg === "string" ? item.msg : "";
          if (field && msg) return `${field}: ${msg}`;
          if (msg) return msg;
          return JSON.stringify(item);
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

async function assistantRequest(path, init = {}) {
  const headers = new Headers(init.headers || {});
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildAssistantUrl(path), {
    ...init,
    headers,
  });

  const rawText = await response.text();
  const payload = parseResponsePayload(rawText);
  if (!response.ok) {
    throw new Error(resolveErrorMessage(payload, "Assistant request failed."));
  }
  return payload;
}

export function requestAssistantQa(payload, files = {}) {
  const images = Array.isArray(files.images) ? files.images : [];
  const attachments = Array.isArray(files.attachments) ? files.attachments : [];
  const hasFiles = images.length > 0 || attachments.length > 0;

  if (hasFiles) {
    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    images.forEach((file) => formData.append("images[]", file));
    attachments.forEach((file) => formData.append("attachments[]", file));
    return assistantRequest("/api/v1/assistant/qa", {
      method: "POST",
      body: formData,
    });
  }

  return assistantRequest("/api/v1/assistant/qa", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function requestAssistantQuiz(payload) {
  return assistantRequest("/api/v1/assistant/quiz", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function requestAssistantQuizEvaluate(payload) {
  return assistantRequest("/api/v1/assistant/quiz/evaluate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
