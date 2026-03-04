import { readFile } from "node:fs/promises";
import path from "node:path";
import { runEditor } from "../agents/editor";
import { runPedagogyReview } from "../agents/pedagogy";
import { runVerifier } from "../agents/verifier";
import { runWriter } from "../agents/writer";
import {
  ensureDir,
  loadModelsConfig,
  readJsonFile,
  writeJsonFile,
  writeTextFile,
} from "./io/core";
import type { PedagogyReport, Topic, TopicOutline, VerifierReport } from "./types";

type OutlineFile = {
  course: string;
  topics: TopicOutline[];
};

export async function loadCourseOutline(course: string): Promise<OutlineFile> {
  const filePath = path.join(process.cwd(), "ai-agents", "inputs", course, "outline.json");
  return readJsonFile<OutlineFile>(filePath);
}

function shouldStop(report: { verifier: VerifierReport; pedagogy: PedagogyReport }): boolean {
  return (
    report.verifier.summary.blocker === 0 &&
    report.verifier.summary.major <= 1 &&
    report.pedagogy.summary.major <= 1 &&
    report.pedagogy.alignment_score >= 0.85
  );
}

function buildImageSpec(topic: Topic) {
  const topObjectives = topic.learning_objectives.slice(0, 3).map((o) => o.replaceAll('"', "'"));
  const source = [
    "mindmap",
    `  root((${topic.title.replaceAll('"', "'")}))`,
    ...topObjectives.map((obj) => `    ${obj}`),
  ].join("\n");
  return {
    type: "mermaid" as const,
    source,
    alt_text: `Mindmap for topic ${topic.title}`,
  };
}

function buildMindmapNode(topic: Topic) {
  return {
    slug: topic.slug,
    title: topic.title,
    prerequisites: topic.prerequisites,
    tags: topic.tags,
    estimated_time_minutes: topic.estimated_time_minutes,
    difficulty: topic.difficulty,
  };
}

function renderTopicMarkdown(topic: Topic): string {
  const workedExamples = topic.worked_examples.map((item) => `- ${item}`).join("\n");
  const pitfalls = topic.common_pitfalls.map((item) => `- ${item}`).join("\n");
  const objectives = topic.learning_objectives.map((item) => `- ${item}`).join("\n");
  const prerequisites = topic.prerequisites.length ? topic.prerequisites.join(", ") : "none";
  const tasks = topic.practice_tasks.map((item) => `- ${item}`).join("\n");
  const tags = topic.tags.join(", ");

  return [
    `# ${topic.title}`,
    "",
    `- slug: ${topic.slug}`,
    `- prerequisites: ${prerequisites}`,
    `- difficulty: ${topic.difficulty}/5`,
    `- estimated_time_minutes: ${topic.estimated_time_minutes}`,
    `- tags: ${tags}`,
    "",
    "## Learning Objectives",
    objectives,
    "",
    "## Core Explanation",
    topic.core_explanation,
    "",
    "## Worked Examples",
    workedExamples || "- none",
    "",
    "## Common Pitfalls",
    pitfalls || "- none",
    "",
    "## Practice Tasks",
    tasks || "- none",
    "",
  ].join("\n");
}

export async function runTopicPipeline(input: {
  course: string;
  topicOutline: TopicOutline;
  maxIters?: number;
}) {
  const maxIters = input.maxIters ?? 3;
  const artifactsDir = path.join(process.cwd(), "ai-agents", "outputs", input.course, input.topicOutline.slug);
  const finalNotesDir = path.join(process.cwd(), "public", "notes", input.course);
  const finalMarkdownPath = path.join(finalNotesDir, `${input.topicOutline.slug}.md`);
  await ensureDir(artifactsDir);
  await ensureDir(finalNotesDir);

  const models = await loadModelsConfig();
  const schemaJson = await readFile(path.join(process.cwd(), "ai-agents", "config", "schema.json"), "utf-8");

  const writerModel = models.writer_model;
  const verifierModel = models.verifier_model;
  const pedagogyModel = models.pedagogy_model;
  const editorModel = models.editor_model;
  console.log(
    `[ai-agents] models: writer=${writerModel}, verifier=${verifierModel}, pedagogy=${pedagogyModel}, editor=${editorModel}`,
  );

  let currentTopic = await runWriter({
    model: writerModel,
    outline: input.topicOutline,
    schemaJson,
  });
  await writeJsonFile(path.join(artifactsDir, "v1_draft.json"), currentTopic);

  const iterationSummaries: Array<{
    iter: number;
    verifier: VerifierReport["summary"];
    pedagogy: { major: number; minor: number; alignment_score: number };
  }> = [];

  let stopReason = "max_iters_reached";
  let iterationsRun = 0;
  for (let iter = 1; iter <= maxIters; iter += 1) {
    const verifier = await runVerifier({
      model: verifierModel,
      topic: currentTopic,
    });
    await writeJsonFile(path.join(artifactsDir, `v${iter}_verifier.json`), verifier);

    const pedagogy = await runPedagogyReview({
      model: pedagogyModel,
      topic: currentTopic,
    });
    await writeJsonFile(path.join(artifactsDir, `v${iter}_pedagogy.json`), pedagogy);

    currentTopic = await runEditor({
      model: editorModel,
      draft: currentTopic,
      verifier,
      pedagogy,
      schemaJson,
    });
    await writeJsonFile(path.join(artifactsDir, `v${iter}_final.json`), currentTopic);

    iterationSummaries.push({
      iter,
      verifier: verifier.summary,
      pedagogy: {
        major: pedagogy.summary.major,
        minor: pedagogy.summary.minor,
        alignment_score: pedagogy.alignment_score,
      },
    });

    iterationsRun = iter;
    if (shouldStop({ verifier, pedagogy })) {
      stopReason = "quality_threshold_met";
      break;
    }
  }

  await writeJsonFile(path.join(artifactsDir, "image_spec.json"), buildImageSpec(currentTopic));
  await writeJsonFile(path.join(artifactsDir, "mindmap_node.json"), buildMindmapNode(currentTopic));
  await writeTextFile(finalMarkdownPath, renderTopicMarkdown(currentTopic));

  await writeJsonFile(path.join(artifactsDir, "audit.json"), {
    topic_slug: input.topicOutline.slug,
    models: {
      writer_model: writerModel,
      verifier_model: verifierModel,
      pedagogy_model: pedagogyModel,
      editor_model: editorModel,
    },
    iterations: iterationsRun,
    max_iters: maxIters,
    stop_reason: stopReason,
    issues_found: iterationSummaries,
  });

  return {
    artifactsDir,
    finalMarkdownPath,
    iterationsRun,
    stopReason,
  };
}
