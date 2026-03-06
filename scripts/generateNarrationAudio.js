import dotenv from "dotenv";
import fs from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { narrationMarkdownToTtsText, synthesizeSpeechToFile } from "../server/ttsCore.js";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function splitTextForTts(text, maxChars = 9000) {
  const normalized = String(text ?? "").trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks = [];
  let current = "";

  const pushCurrent = () => {
    const value = current.trim();
    if (value) chunks.push(value);
    current = "";
  };

  for (const paragraph of paragraphs) {
    if (!paragraph) continue;
    if (paragraph.length > maxChars) {
      pushCurrent();
      let start = 0;
      while (start < paragraph.length) {
        const end = Math.min(start + maxChars, paragraph.length);
        chunks.push(paragraph.slice(start, end));
        start = end;
      }
      continue;
    }
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      pushCurrent();
      current = paragraph;
    }
  }
  pushCurrent();
  return chunks;
}

async function main() {
  const rootDir = process.cwd();
  const requestedCourse = getArg("--course");
  const outputsBase = path.join(rootDir, "ai-agents", "outputs");
  const publicAudioDir = path.join(rootDir, "public", "audio");
  const indexPath = path.join(publicAudioDir, "narration-index.json");
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? "";
  const modelId = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";

  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("Missing ELEVENLABS_API_KEY. Set it in .env.local or environment.");
  }
  if (!voiceId) {
    throw new Error("Missing ELEVENLABS_VOICE_ID. Set it in .env.local or environment.");
  }
  if (!fs.existsSync(outputsBase)) {
    throw new Error(`ai-agents outputs directory not found: ${outputsBase}`);
  }

  const courses = fs
    .readdirSync(outputsBase, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((course) => !requestedCourse || course.toLowerCase() === requestedCourse.toLowerCase());

  await mkdir(publicAudioDir, { recursive: true });

  const byNoteKey = {};
  for (const course of courses) {
    const courseDir = path.join(outputsBase, course);
    const topicDirs = fs
      .readdirSync(courseDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(courseDir, entry.name));

    for (const topicDir of topicDirs) {
      const narrationPath = path.join(topicDir, "narration.json");
      if (!fs.existsSync(narrationPath)) continue;

      const narration = await readJson(narrationPath);
      const scriptPath = path.join(topicDir, narration.script_file ?? "v1_narration_final.md");
      if (!fs.existsSync(scriptPath)) continue;

      const scriptMarkdown = await readFile(scriptPath, "utf8");
      const ttsText = narrationMarkdownToTtsText(scriptMarkdown);
      const audioRelPath = String(narration.audio_rel_path ?? `audio/${course}/${narration.topic_slug}.mp3`);
      const audioRelPathNoExt = audioRelPath.replace(/\.mp3$/i, "");
      const noteFileName = String(narration.note_file_name ?? `${narration.topic_slug}.md`);
      const noteKey = `${course}/${noteFileName}`;
      const textChunks = splitTextForTts(ttsText, 9000);
      const audioRelPaths = [];

      for (let i = 0; i < textChunks.length; i += 1) {
        const partNumber = String(i + 1).padStart(2, "0");
        const outputRelPath =
          textChunks.length === 1
            ? audioRelPath
            : `${audioRelPathNoExt}.part-${partNumber}.mp3`;
        await synthesizeSpeechToFile({
          rootDir,
          text: textChunks[i],
          outputRelPath,
          apiKey: process.env.ELEVENLABS_API_KEY,
          voiceId: String(narration.voice_id || voiceId),
          modelId: String(narration.model_id || modelId),
        });
        audioRelPaths.push(outputRelPath);
      }

      byNoteKey[noteKey] = {
        note_key: noteKey,
        course,
        topic_slug: narration.topic_slug,
        note_file_name: noteFileName,
        audio_rel_path: audioRelPaths[0],
        audio_rel_paths: audioRelPaths,
        audio_url: `/${audioRelPaths[0].replace(/^\/+/, "")}`,
        audio_urls: audioRelPaths.map((p) => `/${p.replace(/^\/+/, "")}`),
        chunk_count: audioRelPaths.length,
        voice_id: String(narration.voice_id || voiceId),
        model_id: String(narration.model_id || modelId),
        generated_at: new Date().toISOString(),
      };

      console.log(
        `[narration] generated ${audioRelPaths.length} audio chunk(s) for ${noteKey}`,
      );
    }
  }

  await writeFile(
    indexPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        by_note_key: byNoteKey,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`[narration] index written to ${indexPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
