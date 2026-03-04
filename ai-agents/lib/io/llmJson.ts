import type { LlmClient } from "../clients/types";
import { parseJsonFromModelText } from "./parse";

const RETRY_APPENDIX =
  "\n\nIMPORTANT: Return only one valid JSON value. No markdown fences. No commentary. No leading/trailing text. Escape all newline characters inside string values as \\n. Keep fields concise.";

export async function generateAndParseJson<T>(input: {
  client: LlmClient;
  model: string;
  prompt: string;
  systemInstruction?: string;
  agentName: string;
  maxAttempts?: number;
}): Promise<T> {
  const maxAttempts = input.maxAttempts ?? 4;
  let lastError: unknown = null;
  let lastRaw = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const prompt = attempt === 1 ? input.prompt : `${input.prompt}${RETRY_APPENDIX}`;
    const raw = await input.client.generateJsonText({
      model: input.model,
      prompt,
      systemInstruction: input.systemInstruction,
    });
    lastRaw = raw;
    try {
      return parseJsonFromModelText<T>(raw);
    } catch (error) {
      lastError = error;
    }
  }

  // Final fallback: ask model to repair prior output into strict JSON.
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
    });
    return parseJsonFromModelText<T>(repairedRaw);
  } catch {
    // keep original error path below
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`[${input.agentName}] failed to get valid JSON after ${maxAttempts} attempts. ${message}`);
}
