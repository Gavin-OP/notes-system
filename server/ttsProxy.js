import dotenv from "dotenv";
import { createServer } from "node:http";
import { synthesizeSpeechToFile } from "./ttsCore.js";

dotenv.config({ path: ".env.local" });
dotenv.config();

const port = Number(process.env.TTS_PROXY_PORT ?? "8787");
const rootDir = process.cwd();

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.url === "/api/tts/health" && req.method === "GET") {
    sendJson(res, 200, { ok: true, service: "tts-proxy" });
    return;
  }

  if (req.url === "/api/tts/generate" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const text = String(body.text ?? "");
      const outputRelPath = String(body.outputRelPath ?? "");
      const voiceId = String(body.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? "");
      const modelId = String(body.modelId ?? process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2");

      if (!text || !outputRelPath) {
        sendJson(res, 400, { ok: false, error: "text and outputRelPath are required." });
        return;
      }
      if (!outputRelPath.startsWith("audio/")) {
        sendJson(res, 400, { ok: false, error: "outputRelPath must start with audio/." });
        return;
      }

      await synthesizeSpeechToFile({
        rootDir,
        text,
        outputRelPath,
        apiKey: process.env.ELEVENLABS_API_KEY ?? "",
        voiceId,
        modelId,
      });

      sendJson(res, 200, {
        ok: true,
        audioUrl: `/${outputRelPath.replace(/^\/+/, "")}`,
        outputRelPath,
      });
      return;
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  }

  sendJson(res, 404, { ok: false, error: "Not found" });
});

server.listen(port, () => {
  console.log(`[tts-proxy] listening on http://localhost:${port}`);
});
