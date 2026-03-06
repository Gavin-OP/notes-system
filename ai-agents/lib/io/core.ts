import dotenv from "dotenv";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AgentModels } from "../types";

export function loadEnv() {
  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
  dotenv.config();
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function writeTextFile(filePath: string, text: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, text, "utf-8");
}

export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

export async function loadPrompt(promptFileName: string): Promise<string> {
  const promptPath = path.join(process.cwd(), "ai-agents", "prompts", promptFileName);
  return readFile(promptPath, "utf-8");
}

export function fillTemplate(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

export async function loadModelsConfig(): Promise<AgentModels> {
  const modelsPath = path.join(process.cwd(), "ai-agents", "config", "models.json");
  return readJsonFile<AgentModels>(modelsPath);
}
