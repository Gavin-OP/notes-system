import path from "node:path";
import { runNarrationWriter } from "../agents/narration";
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

function toTitleFileName(title: string): string {
  return title
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function loadCourseOutline(course: string): Promise<OutlineFile> {
  const candidates = [course, course.toLowerCase()];
  let lastError: unknown;
  for (const name of candidates) {
    const filePath = path.join(process.cwd(), "ai-agents", "inputs", name, "outline.json");
    try {
      return await readJsonFile<OutlineFile>(filePath);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Failed to load course outline.");
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
  const finalMarkdownPath = path.join(finalNotesDir, `${toTitleFileName(input.topicOutline.title)}.md`);
  await ensureDir(artifactsDir);
  await ensureDir(finalNotesDir);

  const models = await loadModelsConfig();

  const writerModel = models.writer_model;
  const verifierModel = models.verifier_model;
  const pedagogyModel = models.pedagogy_model;
  const narrationModel = models.narration_model;
  console.log(
    `[ai-agents] models: writer=${writerModel}, verifier=${verifierModel}, pedagogy=${pedagogyModel}, narration=${narrationModel}`,
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

  const narrationFinalMarkdown = await runNarrationWriter({
    model: narrationModel,
    topicOutline: input.topicOutline,
    finalNoteMarkdown: finalMarkdown,
  });
  await writeTextFile(path.join(artifactsDir, "v1_narration_final.md"), narrationFinalMarkdown);

  const metadata = {
    slug: input.topicOutline.slug,
    title: input.topicOutline.title,
    note_file_name: `${toTitleFileName(input.topicOutline.title)}.md`,
    prerequisites: input.topicOutline.prerequisites ?? [],
    learning_objectives: input.topicOutline.learning_objectives ?? [],
    tags: input.topicOutline.tags ?? [],
    difficulty: input.topicOutline.difficulty ?? 2,
    estimated_time_minutes: input.topicOutline.estimated_time_minutes ?? 25,
  };

  const narrationManifest = {
    course: input.course,
    topic_slug: input.topicOutline.slug,
    note_file_name: metadata.note_file_name,
    script_file: "v1_narration_final.md",
    audio_rel_path: `audio/${input.course}/${input.topicOutline.slug}.mp3`,
    voice_id: process.env.ELEVENLABS_VOICE_ID ?? "",
    model_id: process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2",
    duration_sec: null,
    generated_at: new Date().toISOString(),
  };

  await writeJsonFile(path.join(artifactsDir, "metadata.json"), metadata);
  await writeJsonFile(path.join(artifactsDir, "image_spec.json"), buildImageSpec(metadata));
  await writeJsonFile(path.join(artifactsDir, "mindmap_node.json"), buildMindmapNode(metadata));
  await writeJsonFile(path.join(artifactsDir, "narration.json"), narrationManifest);

  await writeJsonFile(path.join(artifactsDir, "audit.json"), {
    topic_slug: input.topicOutline.slug,
    models: {
      writer_model: writerModel,
      verifier_model: verifierModel,
      pedagogy_model: pedagogyModel,
      narration_model: narrationModel,
    },
    pipeline: ["writer", "verifier", "pedagogy", "narration"],
    iterations: 1,
    stop_reason: "completed_single_pass",
    output_files: [
      "v1_draft.md",
      "v1_verifier.md",
      "v1_final.md",
      "v1_narration_final.md",
      "metadata.json",
      "mindmap_node.json",
      "image_spec.json",
      "narration.json",
      "audit.json",
    ],
  });

  return {
    artifactsDir,
    finalMarkdownPath,
    iterationsRun: 1,
    stopReason: "completed_single_pass",
  };
}
