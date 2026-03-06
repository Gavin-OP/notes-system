import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import type { TopicOutline } from "../lib/types";

export async function runNarrationPedagogyReview(input: {
  model: string;
  topicOutline: TopicOutline;
  narrationVerifiedMarkdown: string;
}): Promise<string> {
  const client = createLlmClient();
  const template = await loadPrompt("narration_pedagogy_reviewer.md");
  const prompt = fillTemplate(template, {
    topic_outline_json: JSON.stringify(input.topicOutline, null, 2),
    narration_verified_markdown: input.narrationVerifiedMarkdown,
  });
  const narrationFinalMarkdown = await client.generateText({
    model: input.model,
    prompt,
    systemInstruction: "Return full improved narration markdown only with pedagogical improvements.",
  });
  return narrationFinalMarkdown;
}
