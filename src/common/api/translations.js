export class TranslationApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "TranslationApiError";
    this.status = status;
    this.data = data;
  }
}

const memoryCache = new Map();

function getTranslationApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function shouldAttemptTranslationApi() {
  if (getTranslationApiBaseUrl()) return true;
  if (typeof window === "undefined") return true;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function buildTranslationApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getTranslationApiBaseUrl();
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

function normalizeLanguage(language) {
  const normalized = String(language || "").trim().toLowerCase();
  if (["zh", "zh-cn", "zh_cn", "cn"].includes(normalized)) return "cn";
  if (normalized.startsWith("en")) return "en";
  return normalized || "en";
}

function buildMemoryCacheKey(payload) {
  return [
    payload.source_type,
    payload.source_id,
    normalizeLanguage(payload.source_language || "en"),
    normalizeLanguage(payload.target_language),
    payload.content_version || "current",
    payload.content_hash || "",
    payload.content || "",
  ].join("|");
}

export function canTranslateDynamicContent() {
  return shouldAttemptTranslationApi();
}

export async function translateContent(payload) {
  const targetLanguage = normalizeLanguage(payload?.target_language);
  const sourceLanguage = normalizeLanguage(payload?.source_language || "en");
  const content = String(payload?.content || "").trim();
  if (!content || targetLanguage === sourceLanguage) {
    return {
      translated_content: content,
      cached: true,
    };
  }
  if (!shouldAttemptTranslationApi()) {
    throw new TranslationApiError(0, "Translation API is not configured.", null);
  }

  const cacheKey = buildMemoryCacheKey({ ...payload, content, target_language: targetLanguage });
  if (memoryCache.has(cacheKey)) {
    return {
      translated_content: memoryCache.get(cacheKey),
      cached: true,
    };
  }

  const response = await fetch(buildTranslationApiUrl("/api/v1/translations"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      source_type: payload.source_type || "dynamic_text",
      source_id: payload.source_id || "dynamic",
      source_language: sourceLanguage,
      target_language: targetLanguage,
      content,
      content_hash: payload.content_hash || null,
      content_version: payload.content_version || null,
    }),
  });
  const text = await response.text();
  const data = parsePayload(text);
  if (!response.ok) {
    throw new TranslationApiError(
      response.status,
      getErrorMessage(data, "Translation request failed."),
      data,
    );
  }
  const translated = String(data?.translated_content || content);
  memoryCache.set(cacheKey, translated);
  return data;
}
