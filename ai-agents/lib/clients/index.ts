import { createGeminiClient } from "./gemini";
import type { LlmClient } from "./types";

type ProviderName = "gemini";

export function getDefaultProviderName(): ProviderName {
  return "gemini";
}

export function createLlmClient(provider: ProviderName = getDefaultProviderName()): LlmClient {
  if (provider === "gemini") {
    return createGeminiClient(process.env.GEMINI_API_KEY ?? "");
  }
  throw new Error(`Unsupported provider: ${provider}`);
}
