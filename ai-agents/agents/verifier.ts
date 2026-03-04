import { createLlmClient } from "../lib/clients";
import { fillTemplate, loadPrompt } from "../lib/io/core";
import { generateAndParseJson } from "../lib/io/llm";
import type { Topic, VerifierIssue, VerifierReport } from "../lib/types";

function normalizeVerifierIssue(issue: Partial<VerifierIssue>): VerifierIssue {
  return {
    severity:
      issue.severity === "blocker" || issue.severity === "major" || issue.severity === "minor"
        ? issue.severity
        : "minor",
    location: issue.location ?? "unknown",
    message: issue.message ?? "No details provided.",
    suggested_fix: issue.suggested_fix ?? "No suggested fix provided.",
    confidence: typeof issue.confidence === "number" ? Math.min(1, Math.max(0, issue.confidence)) : 0.5,
  };
}

function summarize(issues: VerifierIssue[]): VerifierReport["summary"] {
  return issues.reduce(
    (acc, item) => {
      acc[item.severity] += 1;
      return acc;
    },
    { blocker: 0, major: 0, minor: 0 },
  );
}

export async function runVerifier(input: { model: string; topic: Topic }): Promise<VerifierReport> {
  const client = createLlmClient();
  const template = await loadPrompt("verifier.md");
  const prompt = fillTemplate(template, {
    topic_json: JSON.stringify(input.topic, null, 2),
  });
  const parsed = await generateAndParseJson<Partial<VerifierReport>>({
    client,
    model: input.model,
    prompt,
    agentName: "verifier",
    systemInstruction: "Return strictly valid JSON only.",
  });
  const issues = Array.isArray(parsed.issues) ? parsed.issues.map(normalizeVerifierIssue) : [];
  return {
    issues,
    summary: summarize(issues),
  };
}
