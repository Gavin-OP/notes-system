import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import type { TopicOutline } from "../lib/types";

export async function runPedagogyReview(input: {
  model: string;
  topicOutline: TopicOutline;
  verifiedMarkdown: string;
}): Promise<string> {
  const client = createLlmClient();
  const template = await loadPrompt("pedagogy_reviewer.md");
  const prompt = fillTemplate(template, {
    topic_outline_json: JSON.stringify(input.topicOutline, null, 2),
    verified_markdown: input.verifiedMarkdown,
  });
  const finalMarkdown = await client.generateText({
    model: input.model,
    prompt,
    systemInstruction: "Return markdown only. Rewrite the full note with pedagogy improvements.",
  });
  return finalMarkdown;
}
