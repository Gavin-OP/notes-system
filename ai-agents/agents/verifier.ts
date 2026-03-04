import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import type { TopicOutline } from "../lib/types";

export async function runVerifier(input: {
  model: string;
  topicOutline: TopicOutline;
  draftMarkdown: string;
}): Promise<string> {
  const client = createLlmClient();
  const template = await loadPrompt("verifier.md");
  const prompt = fillTemplate(template, {
    topic_outline_json: JSON.stringify(input.topicOutline, null, 2),
    draft_markdown: input.draftMarkdown,
  });
  const revisedMarkdown = await client.generateText({
    model: input.model,
    prompt,
    systemInstruction: "Return markdown only. Rewrite the full note with technical corrections applied.",
  });
  return revisedMarkdown;
}
