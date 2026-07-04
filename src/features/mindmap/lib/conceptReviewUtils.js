import { requestAssistantQa, requestAssistantQuiz } from "../../assistant/api/assistant";

import { resolveQuizQuestions } from "./quizUtils";

const REVIEW_CACHE_PREFIX = "concept-review:v4:";
const REVIEW_CACHE_GENERATION_KEY = "concept-review:cache-generation";
const REVIEW_CACHE_GENERATION = "4";

function stripMarkdown(text) {
  return String(text || "")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeRawNoteChunk(text) {
  const normalized = stripMarkdown(text);
  if (!normalized) return true;
  if (normalized.length > 320) return true;
  if (/^this lesson will/i.test(normalized)) return true;
  if (/^by the end of this lesson/i.test(normalized)) return true;
  if (/^#{1,6}\s/.test(String(text || "").trim())) return true;
  if (/^\d+\.\s+\*\*/.test(String(text || "").trim())) return true;
  if (/^#{1,6}\s/.test(normalized)) return true;
  return isSyllabusBullet(normalized);
}

export function migrateConceptReviewCaches() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(REVIEW_CACHE_GENERATION_KEY) === REVIEW_CACHE_GENERATION) {
    return;
  }

  Object.keys(window.localStorage).forEach((key) => {
    if (key.startsWith("concept-review:")) {
      window.localStorage.removeItem(key);
    }
  });
  window.localStorage.setItem(REVIEW_CACHE_GENERATION_KEY, REVIEW_CACHE_GENERATION);
}

export function invalidateConceptReviewCache(conceptId) {
  if (!conceptId || typeof window === "undefined") return;
  window.localStorage.removeItem(`${REVIEW_CACHE_PREFIX}${conceptId}`);
}

export function clearAllConceptReviewCaches() {
  if (typeof window === "undefined") return;
  Object.keys(window.localStorage).forEach((key) => {
    if (key.startsWith("concept-review:")) {
      window.localStorage.removeItem(key);
    }
  });
  window.localStorage.removeItem(REVIEW_CACHE_GENERATION_KEY);
}

function isValidReviewCache(payload) {
  const description = stripMarkdown(payload?.description || "");
  const bullets = (Array.isArray(payload?.bullets) ? payload.bullets : [])
    .map(stripMarkdown)
    .filter(Boolean);

  if (!description || description.length < 24) return false;
  if (looksLikeRawNoteChunk(description)) return false;
  if (bullets.length < 2 || bullets.length > 6) return false;
  if (bullets.some(looksLikeRawNoteChunk)) return false;
  return true;
}

function readConceptReviewCache(conceptId) {
  if (!conceptId || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${REVIEW_CACHE_PREFIX}${conceptId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidReviewCache(parsed)) {
      window.localStorage.removeItem(`${REVIEW_CACHE_PREFIX}${conceptId}`);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeConceptReviewCache(conceptId, payload) {
  if (!conceptId || typeof window === "undefined") return;
  if (!isValidReviewCache(payload)) return;
  try {
    window.localStorage.setItem(
      `${REVIEW_CACHE_PREFIX}${conceptId}`,
      JSON.stringify({
        description: stripMarkdown(payload.description || ""),
        bullets: (payload.bullets || []).map(stripMarkdown).filter(Boolean).slice(0, 6),
        generatedAt: new Date().toISOString(),
        source: "llm",
      }),
    );
  } catch {
    // Ignore quota errors.
  }
}

export function normalizeConceptPayload(raw = {}) {
  const noteUrl = raw.noteUrl || "";
  const [pathPart, hashPart] = noteUrl.split("#");
  const anchorId = raw.anchorId || hashPart || "";

  return {
    id: raw.id || raw.conceptId || "",
    label: raw.label || raw.name || raw.title || "Concept",
    noteUrl,
    notePath: pathPart || "",
    anchorId,
    noteTitle: raw.noteTitle || "",
    categoryId: raw.categoryId || "",
    conceptType: raw.conceptType || "",
    occurrences: Array.isArray(raw.occurrences) ? raw.occurrences : [],
  };
}

export async function fetchNoteMarkdown(noteUrl) {
  const pathPart = String(noteUrl || "")
    .split("#")[0]
    .replace(/^\/+/, "")
    .replace(/^note\//, "");
  if (!pathPart) return "";

  let filePath = pathPart;
  if (!filePath.toLowerCase().endsWith(".md")) {
    filePath = `${filePath}.md`;
  }

  const response = await fetch(`${import.meta.env.BASE_URL}notes/${filePath}`);
  if (!response.ok) return "";
  return response.text();
}

export function extractConceptSection(markdown, anchorId) {
  if (!markdown || !anchorId) return "";

  const normalizedAnchor = anchorId.replace(/^#/, "");
  const anchorVariants = new Set([normalizedAnchor]);
  if (normalizedAnchor.startsWith("concept-")) {
    anchorVariants.add(normalizedAnchor.replace(/^concept-/, ""));
  } else {
    anchorVariants.add(`concept-${normalizedAnchor}`);
  }

  const anchorPattern = Array.from(anchorVariants)
    .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const anchorRegex = new RegExp(`<a\\s+id=["'](?:${anchorPattern})["']\\s*></a>`, "i");
  const match = markdown.match(anchorRegex);
  if (!match) return "";

  const startIndex = match.index + match[0].length;
  const tail = markdown.slice(startIndex);
  const nextConceptIndex = tail.search(/<a\s+id=["']concept-/i);
  const section = nextConceptIndex >= 0 ? tail.slice(0, nextConceptIndex) : tail.slice(0, 4000);
  return section.trim();
}

function isSyllabusSection(sectionText) {
  return /##\s*Learning Objectives/i.test(sectionText);
}

function isSyllabusBullet(text) {
  return /^(by the end of this lesson|you will be able to|explain why|identify common|apply basic|understand methods|implement data|differentiate between|describe the|define and calculate|outline the|grasp the|recognize how|learn to use|master the)/i.test(
    stripMarkdown(text),
  );
}

function labelMentionPattern(conceptLabel) {
  const escaped = String(conceptLabel || "")
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i");
}

export function extractConceptMentionSnippets(markdown, conceptLabel, limit = 4) {
  if (!markdown || !conceptLabel) return [];

  const mentionPattern = labelMentionPattern(conceptLabel);
  const snippets = [];
  const paragraphs = markdown.split(/\n{2,}/);

  paragraphs.forEach((paragraph) => {
    if (!mentionPattern.test(paragraph)) return;
    if (/^##\s*Learning Objectives/i.test(paragraph.trim())) return;
    if (/^##\s*Introduction/i.test(paragraph.trim()) && paragraph.length > 260) return;

    const cleaned = stripMarkdown(paragraph);
    if (cleaned.length < 40 || cleaned.length > 320) return;
    if (looksLikeRawNoteChunk(cleaned)) return;
    snippets.push(cleaned);
  });

  return [...new Set(snippets)].slice(0, limit);
}

function parseAssistantBullets(answerText) {
  const lines = String(answerText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => stripMarkdown(line.replace(/^[-*+\d.)]+\s*/, "")))
    .filter((line) => line && !looksLikeRawNoteChunk(line))
    .slice(0, 6);
}

function parseConceptReviewResponse(answerText) {
  const jsonMatch = String(answerText || "").match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      const description = stripMarkdown(parsed.description || "");
      const bullets = (Array.isArray(parsed.bullets) ? parsed.bullets : [])
        .map(stripMarkdown)
        .filter((item) => item && !looksLikeRawNoteChunk(item))
        .slice(0, 6);
      if (description || bullets.length > 0) {
        return { description, bullets };
      }
    } catch {
      // Fall through to text parsing.
    }
  }

  const bullets = parseAssistantBullets(answerText);
  const description = stripMarkdown(String(answerText || "").split("\n").find(Boolean) || "");
  return { description, bullets };
}

function buildReviewContext(concept, noteContent) {
  const section = extractConceptSection(noteContent, concept.anchorId);
  const mentionSnippets = extractConceptMentionSnippets(noteContent, concept.label);
  const parts = [];

  if (section && !isSyllabusSection(section)) {
    parts.push(`Dedicated note section for "${concept.label}":\n${stripMarkdown(section).slice(0, 3500)}`);
  } else if (mentionSnippets.length > 0) {
    parts.push(`Relevant note excerpts for "${concept.label}":\n${mentionSnippets.join("\n\n")}`);
  } else if (noteContent) {
    parts.push(noteContent.slice(0, 9000));
  }

  return {
    context: parts.join("\n\n"),
    section,
    mentionSnippets,
  };
}

async function generateConceptReviewViaLlm(concept, contextText) {
  const context = contextText || "";
  if (!context.trim()) {
    throw new Error("No note context available for this concept.");
  }

  const response = await requestAssistantQa({
    question: [
      `Write a Quick Review for the single concept "${concept.label}" only.`,
      "Use the current note content as your only source material.",
      "Return ONLY valid JSON:",
      '{"description":"2-3 sentence introduction and recap","bullets":["3-5 concise bullet points"]}',
      "Rules:",
      `- Focus ONLY on "${concept.label}", not the whole lesson, syllabus, or unrelated topics.`,
      "- Do NOT copy sentences verbatim from the note.",
      "- Do NOT list learning objectives, lesson introductions, or data scientist job duties unless they directly define the concept.",
      "- Explain what the concept means, why it matters, and one practical takeaway.",
      "- Keep each bullet under 20 words.",
    ].join("\n"),
    currentNote: {
      title: concept.label,
      url: concept.noteUrl,
      content: context,
    },
    references: [],
  });

  const answer = response?.answer || response?.data?.answer || "";
  if (!answer.trim()) {
    throw new Error("Assistant returned an empty review.");
  }

  const parsed = parseConceptReviewResponse(answer);
  if (!isValidReviewCache(parsed)) {
    throw new Error("Assistant returned a review in an unexpected format. Please try again.");
  }
  return parsed;
}

export async function loadConceptNoteContext(concept) {
  const noteContent = concept?.noteUrl ? await fetchNoteMarkdown(concept.noteUrl) : "";
  const { section, mentionSnippets } = buildReviewContext(concept, noteContent);
  return {
    noteContent,
    section: section || mentionSnippets.join("\n\n"),
  };
}

export async function loadConceptReviewContent(concept, options = {}) {
  migrateConceptReviewCaches();

  const forceRefresh = Boolean(options.forceRefresh);
  if (!forceRefresh) {
    const cached = readConceptReviewCache(concept.id);
    if (cached) {
      return {
        noteContent: "",
        section: "",
        bullets: cached.bullets || [],
        description: cached.description || "",
        fromCache: true,
      };
    }
  } else {
    invalidateConceptReviewCache(concept.id);
  }

  const noteContent = concept.noteUrl ? await fetchNoteMarkdown(concept.noteUrl) : "";
  const { context, section, mentionSnippets } = buildReviewContext(concept, noteContent);
  const generated = await generateConceptReviewViaLlm(concept, context);

  const payload = {
    noteContent,
    section: section || mentionSnippets.join("\n\n"),
    bullets: generated.bullets,
    description: generated.description,
  };

  writeConceptReviewCache(concept.id, payload);
  return payload;
}

export async function generateConceptQuiz(concept, noteContent, sectionText) {
  const { context, mentionSnippets } = buildReviewContext(concept, noteContent);
  const quizContext = sectionText || context || mentionSnippets.join("\n\n") || noteContent.slice(0, 12000);

  const response = await requestAssistantQuiz({
    objective: "review",
    difficulty: "medium",
    questionTypes: ["mcq", "short_answer"],
    questionCount: 5,
    customInstruction: `Focus exclusively on the concept "${concept.label}". Ask practical review questions that test understanding of this concept only, not the whole lesson syllabus.`,
    currentNote: {
      title: concept.label,
      url: concept.noteUrl,
      content: quizContext,
    },
    references: [],
  });

  return resolveQuizQuestions(response);
}
