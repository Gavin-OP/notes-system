import { jsonrepair } from "jsonrepair";

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

    if (depth === 0) {
      return text.slice(startIndex, i + 1);
    }
  }
  return null;
}

export function parseJsonFromModelText<T>(rawText: string): T {
  const base = stripCodeFence(rawText);
  const candidates: string[] = [];

  candidates.push(base);
  const extracted = extractBalancedJsonBlock(base);
  if (extracted) candidates.push(extracted);
  candidates.push(sanitizeJsonCandidate(base));
  if (extracted) candidates.push(sanitizeJsonCandidate(extracted));

  const uniqueCandidates = [...new Set(candidates.filter(Boolean))];
  for (const candidate of uniqueCandidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      try {
        const repaired = jsonrepair(candidate);
        return JSON.parse(repaired) as T;
      } catch {
        // Try the next parse candidate.
      }
    }
  }

  const preview = rawText.slice(0, 300).replace(/\s+/g, " ");
  throw new Error(`Model response is not valid JSON. Preview: ${preview}`);
}
