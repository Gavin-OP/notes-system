import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function assertInsidePublic(rootDir, outputRelPath) {
  const publicDir = path.resolve(rootDir, "public");
  const resolved = path.resolve(publicDir, outputRelPath);
  if (!resolved.startsWith(publicDir)) {
    throw new Error("Invalid output path. Must stay inside public/.");
  }
  return resolved;
}

export function narrationMarkdownToTtsText(markdown) {
  return String(markdown ?? "")
    .replace(/\[PAUSE_LONG\]/g, "\n\n")
    .replace(/\[PAUSE_SHORT\]/g, "\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/```[\s\S]*?```/g, (match) => {
      const codeBody = match.replace(/```[a-z]*\n?/i, "").replace(/```$/, "").trim();
      if (!codeBody) return "";
      return `\nCode cue. Listen carefully to this code snippet.\n${codeBody}\n`;
    })
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function synthesizeSpeechToFile(input) {
  const {
    rootDir,
    text,
    outputRelPath,
    apiKey,
    voiceId,
    modelId = "eleven_multilingual_v2",
  } = input;

  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY.");
  }
  if (!voiceId) {
    throw new Error("Missing ElevenLabs voice id.");
  }
  const finalPath = assertInsidePublic(rootDir, outputRelPath);
  await mkdir(path.dirname(finalPath), { recursive: true });

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs request failed (${response.status}): ${errText}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  await writeFile(finalPath, audioBuffer);
  return finalPath;
}
