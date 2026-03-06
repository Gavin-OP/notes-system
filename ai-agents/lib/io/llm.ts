import { jsonrepair } from "jsonrepair";
import type { LlmClient } from "../clients/types";

const RETRY_APPENDIX =
  "\n\nIMPORTANT: Return only one valid JSON value. No markdown fences. No commentary. No leading/trailing text. Escape all newline characters inside string values as \\n. Keep fields concise.";
const STRICT_MINIFIED_APPENDIX =
  "\n\nIMPORTANT: Return compact minified JSON in a single line. Do not use markdown. Ensure all brackets and braces are closed.";

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

function sanitizeJsonCandidate(text: string): string {
  return text
    .replace(/^\uFEFF/, "")
    .replace(/^\s*json\s*\n/i, "")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

function extractBalancedJsonBlock(text: string): string | null {
  const startCandidates = ["{", "["];
  let startIndex = -1;
  let opening = "";
  for (const marker of startCandidates) {
    const idx = text.indexOf(marker);
    if (idx >= 0 && (startIndex === -1 || idx < startIndex)) {
      startIndex = idx;
      opening = marker;
    }
  }
  if (startIndex === -1) return null;

  const closing = opening === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      continue;
    }

    if (ch === opening) depth += 1;
    if (ch === closing) depth -= 1;
    if (depth === 0) return text.slice(startIndex, i + 1);
  }

  return null;
}

function closeUnbalancedJson(text: string): string {
  const out = text.trim();
  const stack: Array<"}" | "]"> = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < out.length; i += 1) {
    const ch = out[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      continue;
    }

    if (ch === "{") stack.push("}");
    if (ch === "[") stack.push("]");
    if (ch === "}" || ch === "]") {
      const expected = stack.at(-1);
      if (expected === ch) {
        stack.pop();
      }
    }
  }

  return `${out}${stack.reverse().join("")}`;
}

export function parseJsonFromModelText<T>(rawText: string): T {
  const base = stripCodeFence(rawText);
  const candidates: string[] = [base];
  const extracted = extractBalancedJsonBlock(base);
  if (extracted) candidates.push(extracted);
  candidates.push(sanitizeJsonCandidate(base));
  if (extracted) candidates.push(sanitizeJsonCandidate(extracted));
  candidates.push(closeUnbalancedJson(base));
  if (extracted) candidates.push(closeUnbalancedJson(extracted));

  const uniqueCandidates = [...new Set(candidates.filter(Boolean))];
  for (const candidate of uniqueCandidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      try {
        const repaired = jsonrepair(candidate);
        return JSON.parse(repaired) as T;
      } catch {
        // Try next parse candidate.
      }
    }
  }

  const preview = rawText.slice(0, 300).replace(/\s+/g, " ");
  throw new Error(`Model response is not valid JSON. Preview: ${preview}`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function generateAndParseJson<T>(input: {
  client: LlmClient;
  model: string;
  prompt: string;
  systemInstruction?: string;
  agentName: string;
  maxAttempts?: number;
  requireObject?: boolean;
  responseSchema?: unknown;
}): Promise<T> {
  const maxAttempts = input.maxAttempts ?? 5;
  const requireObject = input.requireObject ?? true;
  let lastError: unknown = null;
  let lastRaw = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const prompt =
      attempt === 1
        ? input.prompt
        : attempt < maxAttempts
          ? `${input.prompt}${RETRY_APPENDIX}`
          : `${input.prompt}${STRICT_MINIFIED_APPENDIX}`;
    const raw = await input.client.generateJsonText({
      model: input.model,
      prompt,
      systemInstruction: input.systemInstruction,
      responseSchema: input.responseSchema,
    });
    lastRaw = raw;
    try {
      const parsed = parseJsonFromModelText<T>(raw);
      if (requireObject && !isPlainObject(parsed)) {
        throw new Error("Parsed JSON is not an object.");
      }
      return parsed;
    } catch (error) {
      lastError = error;
    }
  }

  const repairPrompt = [
    "You are a JSON repair assistant.",
    "Convert the following model output into one valid JSON value only.",
    "Do not add markdown or commentary.",
    "If text is truncated, complete minimally while preserving intent.",
    "",
    "Broken output:",
    "```",
    lastRaw,
    "```",
  ].join("\n");

  try {
    const repairedRaw = await input.client.generateJsonText({
      model: input.model,
      prompt: repairPrompt,
      systemInstruction: "Return strictly valid JSON only.",
      responseSchema: input.responseSchema,
    });
    const repaired = parseJsonFromModelText<T>(repairedRaw);
    if (requireObject && !isPlainObject(repaired)) {
      throw new Error("Parsed repaired JSON is not an object.");
    }
    return repaired;
  } catch {
    // Keep original error path below.
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`[${input.agentName}] failed to get valid JSON after ${maxAttempts} attempts. ${message}`);
}
