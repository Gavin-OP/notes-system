function getAssistantBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

const ASSISTANT_LIMITS = {
  questionChars: 2000,
  noteContentChars: 50000,
  references: 10,
  attachments: 5,
  attachmentBytes: 10 * 1024 * 1024,
};

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

function textLength(value) {
  return String(value || "").length;
}

function validateTextLength(value, maxLength, label) {
  if (textLength(value) > maxLength) {
    throw new Error(`${label} must be ${maxLength} characters or fewer.`);
  }
}

function validateAssistantContext(payload) {
  validateTextLength(payload?.currentNote?.content, ASSISTANT_LIMITS.noteContentChars, "Current note content");
  const references = Array.isArray(payload?.references) ? payload.references : [];
  if (references.length > ASSISTANT_LIMITS.references) {
    throw new Error(`Please select at most ${ASSISTANT_LIMITS.references} reference notes.`);
  }
  references.forEach((reference, index) => {
    validateTextLength(
      reference?.content,
      ASSISTANT_LIMITS.noteContentChars,
      `Reference ${index + 1} content`,
    );
  });
}

function validateAssistantQaPayload(payload) {
  validateTextLength(payload?.question, ASSISTANT_LIMITS.questionChars, "Question");
  validateAssistantContext(payload);
}

function validateAssistantQuizPayload(payload) {
  validateTextLength(payload?.objective, ASSISTANT_LIMITS.questionChars, "Quiz objective");
  validateTextLength(payload?.customInstruction, ASSISTANT_LIMITS.questionChars, "Quiz instruction");
  validateAssistantContext(payload);
}

function validateAssistantQuizEvaluationPayload(payload) {
  validateTextLength(payload?.userAnswer, ASSISTANT_LIMITS.questionChars, "Quiz answer");
  validateAssistantContext(payload);
}

function buildAttachmentMeta(images, attachments) {
  return {
    images: images.map((file) => ({ name: file.name || "", size: file.size, type: file.type || "" })),
    attachments: attachments.map((file) => ({ name: file.name || "", size: file.size, type: file.type || "" })),
  };
}

function validateAssistantFiles(images, attachments) {
  const allFiles = [...images, ...attachments];
  if (allFiles.length > ASSISTANT_LIMITS.attachments) {
    throw new Error(`Please attach at most ${ASSISTANT_LIMITS.attachments} files.`);
  }
  allFiles.forEach((file) => {
    if (typeof file.size === "number" && file.size > ASSISTANT_LIMITS.attachmentBytes) {
      throw new Error("Each attached file must be 10MB or smaller.");
    }
  });
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
    credentials: "include",
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
  validateAssistantFiles(images, attachments);
  const safePayload = {
    ...payload,
    attachmentMeta: buildAttachmentMeta(images, attachments),
  };
  validateAssistantQaPayload(safePayload);

  if (hasFiles) {
    const formData = new FormData();
    formData.append("payload", JSON.stringify(safePayload));
    images.forEach((file) => formData.append("images[]", file));
    attachments.forEach((file) => formData.append("attachments[]", file));
    return assistantRequest("/api/v1/assistant/qa", {
      method: "POST",
      body: formData,
    });
  }

  return assistantRequest("/api/v1/assistant/qa", {
    method: "POST",
    body: JSON.stringify(safePayload),
  });
}

export function requestProductAssistant(payload, files = {}) {
  const images = Array.isArray(files.images) ? files.images : [];
  const attachments = Array.isArray(files.attachments) ? files.attachments : [];
  const hasFiles = images.length > 0 || attachments.length > 0;
  validateAssistantFiles(images, attachments);
  const safePayload = {
    ...payload,
    attachmentMeta: buildAttachmentMeta(images, attachments),
  };
  validateAssistantQaPayload(safePayload);

  if (hasFiles) {
    const formData = new FormData();
    formData.append("payload", JSON.stringify(safePayload));
    images.forEach((file) => formData.append("images[]", file));
    attachments.forEach((file) => formData.append("attachments[]", file));
    return assistantRequest("/api/v1/assistant/global", {
      method: "POST",
      body: formData,
    });
  }

  return assistantRequest("/api/v1/assistant/global", {
    method: "POST",
    body: JSON.stringify(safePayload),
  });
}

export function getAssistantConversations() {
  return assistantRequest("/api/v1/assistant/conversations");
}

export function getAssistantContext() {
  return assistantRequest("/api/v1/assistant/context");
}

export function getCanonicalCurriculumGraph() {
  return assistantRequest("/api/v1/assistant/curriculum/canonical-graph");
}

export function getLearningPath(pathId = "primary") {
  const query = pathId && pathId !== "primary" ? `?path_id=${encodeURIComponent(pathId)}` : "";
  return assistantRequest(`/api/v1/assistant/learning-path${query}`);
}

export function generateLearningPath(payload) {
  return assistantRequest("/api/v1/assistant/learning-path/generate", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

export function saveLearningPathDraft(payload) {
  return assistantRequest("/api/v1/assistant/learning-path/draft", {
    method: "PUT",
    body: JSON.stringify(payload || {}),
  });
}

export function commitLearningPath(payload = {}) {
  return assistantRequest("/api/v1/assistant/learning-path/commit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function decideAssistantAction(proposalId, payload) {
  return assistantRequest(`/api/v1/assistant/actions/${encodeURIComponent(proposalId)}/decision`, {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

export function requestAssistantQuiz(payload) {
  validateAssistantQuizPayload(payload);
  return assistantRequest("/api/v1/assistant/quiz", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function requestAssistantQuizEvaluate(payload) {
  validateAssistantQuizEvaluationPayload(payload);
  return assistantRequest("/api/v1/assistant/quiz/evaluate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
