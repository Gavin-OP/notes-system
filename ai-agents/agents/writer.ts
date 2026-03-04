import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import { generateAndParseJson } from "../lib/io/llm";
import { assertValidTopic } from "../lib/validate/topicSchema";
import type { Topic, TopicOutline } from "../lib/types";

export async function runWriter(input: {
  model: string;
  outline: TopicOutline;
  schemaJson: string;
}): Promise<Topic> {
  const client = createLlmClient();
  const template = await loadPrompt("writer.md");
  const prompt = fillTemplate(template, {
    topic_outline_json: JSON.stringify(input.outline, null, 2),
    schema_json: input.schemaJson,
  });
  const candidate = await generateAndParseJson<unknown>({
    client,
    model: input.model,
    prompt,
    agentName: "writer",
    systemInstruction: "Return strictly valid JSON only.",
  });
  return assertValidTopic(candidate);
}
