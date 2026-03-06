import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import type { TopicOutline } from "../lib/types";

export async function runNarrationWriter(input: {
  model: string;
  topicOutline: TopicOutline;
  finalNoteMarkdown: string;
}): Promise<string> {
  const client = createLlmClient();
  const template = await loadPrompt("narration.md");
  const prompt = fillTemplate(template, {
    topic_outline_json: JSON.stringify(input.topicOutline, null, 2),
    final_note_markdown: input.finalNoteMarkdown,
  });
  const narrationFinalMarkdown = await client.generateText({
    model: input.model,
    prompt,
    systemInstruction:
      "Return narration markdown only. Ensure factual correctness, smooth delivery, and pacing with explicit pause markers.",
  });
  return narrationFinalMarkdown;
}
