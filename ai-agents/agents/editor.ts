import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import { generateAndParseJson } from "../lib/io/llm";
import { assertValidTopic } from "../lib/validate/topicSchema";
import type { PedagogyReport, Topic, VerifierReport } from "../lib/types";

export async function runEditor(input: {
  model: string;
  draft: Topic;
  verifier: VerifierReport;
  pedagogy: PedagogyReport;
  schemaJson: string;
}): Promise<Topic> {
  const client = createLlmClient();
  const template = await loadPrompt("editor.md");
  const prompt = fillTemplate(template, {
    draft_json: JSON.stringify(input.draft, null, 2),
    verifier_json: JSON.stringify(input.verifier, null, 2),
    pedagogy_json: JSON.stringify(input.pedagogy, null, 2),
    schema_json: input.schemaJson,
  });
  const candidate = await generateAndParseJson<unknown>({
    client,
    model: input.model,
    prompt,
    agentName: "editor",
    systemInstruction: "Return strictly valid JSON only.",
  });
  return assertValidTopic(candidate);
}
