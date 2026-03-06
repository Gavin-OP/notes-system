import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import type { TopicOutline } from "../lib/types";

export async function runNarrationWriter(input: {
  model: string;
  topicOutline: TopicOutline;
  draftMarkdown: string;
}): Promise<string> {
  const client = createLlmClient();
  const template = await loadPrompt("narration_writer.md");
  const prompt = fillTemplate(template, {
    topic_outline_json: JSON.stringify(input.topicOutline, null, 2),
    draft_markdown: input.draftMarkdown,
  });
  const narrationDraftMarkdown = await client.generateText({
    model: input.model,
    prompt,
    systemInstruction: "Return narration markdown only. Keep spoken flow with explicit pause markers.",
  });
  return narrationDraftMarkdown;
}
