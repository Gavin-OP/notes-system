import { readFile } from "node:fs/promises";
import path from "node:path";

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
