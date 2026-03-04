import path from "node:path";
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
import type { TopicOutline } from "./types";

type OutlineFile = {
  course: string;
  topics: TopicOutline[];
};

export async function loadCourseOutline(course: string): Promise<OutlineFile> {
  const filePath = path.join(process.cwd(), "ai-agents", "inputs", course, "outline.json");
  return readJsonFile<OutlineFile>(filePath);
}

function buildImageSpec(input: { title: string; learning_objectives: string[] }) {
  const topObjectives = input.learning_objectives.slice(0, 3).map((o) => o.replaceAll('"', "'"));
  const source = [
    "mindmap",
    `  root((${input.title.replaceAll('"', "'")}))`,
    ...topObjectives.map((obj) => `    ${obj}`),
  ].join("\n");
  return {
    type: "mermaid" as const,
    source,
    alt_text: `Mindmap for topic ${input.title}`,
  };
}

function buildMindmapNode(input: {
  slug: string;
  title: string;
  prerequisites: string[];
  tags: string[];
  estimated_time_minutes: number;
  difficulty: number;
}) {
  return {
    slug: input.slug,
    title: input.title,
    prerequisites: input.prerequisites,
    tags: input.tags,
    estimated_time_minutes: input.estimated_time_minutes,
    difficulty: input.difficulty,
  };
}

export async function runTopicPipeline(input: {
  course: string;
  topicOutline: TopicOutline;
}) {
  const artifactsDir = path.join(process.cwd(), "ai-agents", "outputs", input.course, input.topicOutline.slug);
  const finalNotesDir = path.join(process.cwd(), "public", "notes", input.course);
  const finalMarkdownPath = path.join(finalNotesDir, `${input.topicOutline.slug}.md`);
  await ensureDir(artifactsDir);
  await ensureDir(finalNotesDir);

  const models = await loadModelsConfig();

  const writerModel = models.writer_model;
  const verifierModel = models.verifier_model;
  const pedagogyModel = models.pedagogy_model;
  console.log(
    `[ai-agents] models: writer=${writerModel}, verifier=${verifierModel}, pedagogy=${pedagogyModel}`,
  );

  const draftMarkdown = await runWriter({
    model: writerModel,
    outline: input.topicOutline,
  });
  await writeTextFile(path.join(artifactsDir, "v1_draft.md"), draftMarkdown);

  const verifiedMarkdown = await runVerifier({
    model: verifierModel,
    topicOutline: input.topicOutline,
    draftMarkdown,
  });
  await writeTextFile(path.join(artifactsDir, "v1_verifier.md"), verifiedMarkdown);

  const finalMarkdown = await runPedagogyReview({
    model: pedagogyModel,
    topicOutline: input.topicOutline,
    verifiedMarkdown,
  });
  await writeTextFile(path.join(artifactsDir, "v1_final.md"), finalMarkdown);
  await writeTextFile(finalMarkdownPath, finalMarkdown);

  const metadata = {
    slug: input.topicOutline.slug,
    title: input.topicOutline.title,
    prerequisites: input.topicOutline.prerequisites ?? [],
    learning_objectives: input.topicOutline.learning_objectives ?? [],
    tags: input.topicOutline.tags ?? [],
    difficulty: input.topicOutline.difficulty ?? 2,
    estimated_time_minutes: input.topicOutline.estimated_time_minutes ?? 25,
  };

  await writeJsonFile(path.join(artifactsDir, "metadata.json"), metadata);
  await writeJsonFile(path.join(artifactsDir, "image_spec.json"), buildImageSpec(metadata));
  await writeJsonFile(path.join(artifactsDir, "mindmap_node.json"), buildMindmapNode(metadata));

  await writeJsonFile(path.join(artifactsDir, "audit.json"), {
    topic_slug: input.topicOutline.slug,
    models: {
      writer_model: writerModel,
      verifier_model: verifierModel,
      pedagogy_model: pedagogyModel,
    },
    pipeline: ["writer", "verifier", "pedagogy"],
    iterations: 1,
    stop_reason: "completed_single_pass",
    output_files: ["v1_draft.md", "v1_verifier.md", "v1_final.md", "metadata.json", "mindmap_node.json", "image_spec.json", "audit.json"],
  });

  return {
    artifactsDir,
    finalMarkdownPath,
    iterationsRun: 1,
    stopReason: "completed_single_pass",
  };
}
