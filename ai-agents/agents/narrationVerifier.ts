import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import type { TopicOutline } from "../lib/types";

export async function runNarrationVerifier(input: {
  model: string;
  topicOutline: TopicOutline;
  narrationDraftMarkdown: string;
}): Promise<string> {
  const client = createLlmClient();
  const template = await loadPrompt("narration_verifier.md");
  const prompt = fillTemplate(template, {
    topic_outline_json: JSON.stringify(input.topicOutline, null, 2),
    narration_draft_markdown: input.narrationDraftMarkdown,
  });
  const narrationVerifiedMarkdown = await client.generateText({
    model: input.model,
    prompt,
    systemInstruction: "Return full revised narration markdown only with technical fixes.",
  });
  return narrationVerifiedMarkdown;
}
