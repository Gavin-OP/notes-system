import type { LlmClient } from "./types";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function normalizeModelName(model: string): string {
  return model.trim().replace(/^models\//, "");
}

async function fetchAvailableModels(apiKey: string): Promise<string[]> {
  const response = await fetch(`${GEMINI_API_BASE}?key=${encodeURIComponent(apiKey)}`);
  if (!response.ok) {
    return [];
  }
  const payload = (await response.json()) as {
    models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
  };

  return (payload.models ?? [])
    .filter((m) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
    .map((m) => (m.name ?? "").replace(/^models\//, ""))
    .filter(Boolean);
}

export function createGeminiClient(apiKey: string): LlmClient {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required for Gemini provider.");
  }

  return {
    async generateText({ model, prompt, systemInstruction }) {
      const normalizedModel = normalizeModelName(model);
      const url = `${GEMINI_API_BASE}/${normalizedModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "text/plain",
            temperature: 0,
            maxOutputTokens: 8192,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        if (response.status === 404 || response.status === 400) {
          const models = await fetchAvailableModels(apiKey);
          const suggestion = models.length
            ? ` Available generateContent models include: ${models.slice(0, 12).join(", ")}`
            : "";
          throw new Error(
            `Gemini request failed (${response.status}) for model '${normalizedModel}'.${suggestion} Raw error: ${body}`,
          );
        }
        throw new Error(`Gemini request failed (${response.status}) for model '${normalizedModel}': ${body}`);
      }

      const payload = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }
      return text;
    },
    async generateJsonText({ model, prompt, systemInstruction }) {
      const normalizedModel = normalizeModelName(model);
      const url = `${GEMINI_API_BASE}/${normalizedModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0,
            maxOutputTokens: 8192,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        if (response.status === 404 || response.status === 400) {
          const models = await fetchAvailableModels(apiKey);
          const suggestion = models.length
            ? ` Available generateContent models include: ${models.slice(0, 12).join(", ")}`
            : "";
          throw new Error(
            `Gemini request failed (${response.status}) for model '${normalizedModel}'.${suggestion} Raw error: ${body}`,
          );
        }
        throw new Error(`Gemini request failed (${response.status}) for model '${normalizedModel}': ${body}`);
      }

      const payload = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }
      return text;
    },
  };
}
