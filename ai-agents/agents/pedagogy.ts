import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import { generateAndParseJson } from "../lib/io/llm";
import type { PedagogyIssue, PedagogyReport, Topic } from "../lib/types";

function normalizePedagogyIssue(issue: Partial<PedagogyIssue>): PedagogyIssue {
  return {
    severity: issue.severity === "major" || issue.severity === "minor" ? issue.severity : "minor",
    location: issue.location ?? "unknown",
    message: issue.message ?? "No details provided.",
    suggested_fix: issue.suggested_fix ?? "No suggested fix provided.",
    confidence: typeof issue.confidence === "number" ? Math.min(1, Math.max(0, issue.confidence)) : 0.5,
  };
}

function summarize(issues: PedagogyIssue[]): PedagogyReport["summary"] {
  return issues.reduce(
    (acc, item) => {
      acc[item.severity] += 1;
      return acc;
    },
    { major: 0, minor: 0 },
  );
}

export async function runPedagogyReview(input: { model: string; topic: Topic }): Promise<PedagogyReport> {
  const client = createLlmClient();
  const template = await loadPrompt("pedagogy_reviewer.md");
  const prompt = fillTemplate(template, {
    topic_json: JSON.stringify(input.topic, null, 2),
  });
  const parsed = await generateAndParseJson<Partial<PedagogyReport>>({
    client,
    model: input.model,
    prompt,
    agentName: "pedagogy",
    systemInstruction: "Return strictly valid JSON only.",
  });
  const issues = Array.isArray(parsed.issues) ? parsed.issues.map(normalizePedagogyIssue) : [];
  const alignmentScore =
    typeof parsed.alignment_score === "number"
      ? Math.min(1, Math.max(0, parsed.alignment_score))
      : Math.max(0, 1 - issues.length * 0.1);

  return {
    alignment_score: alignmentScore,
    issues,
    summary: summarize(issues),
  };
}
