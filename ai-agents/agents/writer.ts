import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import type { TopicOutline } from "../lib/types";

export async function runWriter(input: {
  model: string;
  outline: TopicOutline;
}): Promise<string> {
  const client = createLlmClient();
  const template = await loadPrompt("writer.md");
  const prompt = fillTemplate(template, {
    topic_outline_json: JSON.stringify(input.outline, null, 2),
  });
  const noteMarkdown = await client.generateText({
    model: input.model,
    prompt,
    systemInstruction: "Return markdown only. No JSON. No code fences around the entire note.",
  });
  return noteMarkdown;
}
