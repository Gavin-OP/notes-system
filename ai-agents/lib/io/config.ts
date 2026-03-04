import path from "node:path";
import { readJsonFile } from "./json";
import type { AgentModels } from "../types";

export async function loadModelsConfig(): Promise<AgentModels> {
  const modelsPath = path.join(process.cwd(), "ai-agents", "config", "models.json");
  return readJsonFile<AgentModels>(modelsPath);
}
