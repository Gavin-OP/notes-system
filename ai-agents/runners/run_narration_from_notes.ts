import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { runNarrationPedagogyReview } from "../agents/narrationPedagogy";
import { runNarrationVerifier } from "../agents/narrationVerifier";
import { runNarrationWriter } from "../agents/narration";
import { ensureDir, loadEnv, loadModelsConfig, writeJsonFile, writeTextFile } from "../lib/io/core";
import type { TopicOutline } from "../lib/types";

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function stripFrontMatter(markdown: string): string {
  if (!markdown.startsWith("---\n")) return markdown;
  const end = markdown.indexOf("\n---\n", 4);
  if (end === -1) return markdown;
  return markdown.slice(end + 5);
}

function titleFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/i, "").trim();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/\(([^)]+)\)/g, " $1 ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function listCourseNoteFiles(course: string): Promise<string[]> {
  const notesDir = path.join(process.cwd(), "public", "notes", course);
  const entries = await readdir(notesDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase().endsWith(".md"))
    .filter((name) => name !== "_index.md");
}

async function runForNote(input: {
  course: string;
  noteFileName: string;
  writerModel: string;
  verifierModel: string;
  pedagogyModel: string;
}) {
  const notesPath = path.join(process.cwd(), "public", "notes", input.course, input.noteFileName);
  const raw = await readFile(notesPath, "utf-8");
  const noteMarkdown = stripFrontMatter(raw).trim();
  const title = titleFromFileName(input.noteFileName);
  const slug = slugify(input.noteFileName);

  const topicOutline: TopicOutline = {
    slug,
    title,
  };

  const artifactsDir = path.join(process.cwd(), "ai-agents", "outputs", input.course, slug);
  await ensureDir(artifactsDir);

  const narrationDraftMarkdown = await runNarrationWriter({
    model: input.writerModel,
    topicOutline,
    draftMarkdown: noteMarkdown,
  });
  await writeTextFile(path.join(artifactsDir, "v1_narration_draft.md"), narrationDraftMarkdown);

  const narrationVerifiedMarkdown = await runNarrationVerifier({
    model: input.verifierModel,
    topicOutline,
    narrationDraftMarkdown,
  });
  await writeTextFile(path.join(artifactsDir, "v1_narration_verifier.md"), narrationVerifiedMarkdown);

  const narrationFinalMarkdown = await runNarrationPedagogyReview({
    model: input.pedagogyModel,
    topicOutline,
    narrationVerifiedMarkdown,
  });
  await writeTextFile(path.join(artifactsDir, "v1_narration_final.md"), narrationFinalMarkdown);

  await writeJsonFile(path.join(artifactsDir, "narration.json"), {
    course: input.course,
    topic_slug: slug,
    note_file_name: input.noteFileName,
    script_file: "v1_narration_final.md",
    audio_rel_path: `audio/${input.course}/${slug}.mp3`,
    voice_id: process.env.ELEVENLABS_VOICE_ID ?? "",
    model_id: process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2",
    duration_sec: null,
    generated_at: new Date().toISOString(),
    source: "public_note_markdown",
  });

  console.log(
    JSON.stringify(
      {
        course: input.course,
        note_file: input.noteFileName,
        artifacts_dir: artifactsDir,
        narration_script: path.join(artifactsDir, "v1_narration_final.md"),
      },
      null,
      2,
    ),
  );
}

async function main() {
  loadEnv();
  const course = getArg("--course");
  const noteArg = getArg("--note");

  if (!course) {
    throw new Error(
      "Usage: tsx ai-agents/runners/run_narration_from_notes.ts --course <course> [--note \"<file>.md\"]",
    );
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY. Set it in .env.local or environment.");
  }

  const models = await loadModelsConfig();
  const writerModel = models.narration_writer_model;
  const verifierModel = models.narration_verifier_model;
  const pedagogyModel = models.narration_pedagogy_model;
  console.log(
    `[ai-agents] narration models: writer=${writerModel}, verifier=${verifierModel}, pedagogy=${pedagogyModel}`,
  );

  const noteFiles = noteArg ? [noteArg] : await listCourseNoteFiles(course);
  if (noteFiles.length === 0) {
    throw new Error(`No markdown notes found in public/notes/${course}`);
  }

  for (const noteFileName of noteFiles) {
    await runForNote({
      course,
      noteFileName,
      writerModel,
      verifierModel,
      pedagogyModel,
    });
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
