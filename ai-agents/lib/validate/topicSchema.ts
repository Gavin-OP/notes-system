import Ajv2020 from "ajv/dist/2020";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Topic } from "../types";

const ajv = new Ajv2020({ allErrors: true, strict: true });

let validatorPromise: Promise<(data: unknown) => data is Topic> | null = null;

async function getValidator(): Promise<(data: unknown) => data is Topic> {
  if (!validatorPromise) {
    validatorPromise = (async () => {
      const schemaPath = path.join(process.cwd(), "ai-agents", "config", "schema.json");
      const schemaRaw = await readFile(schemaPath, "utf-8");
      const schema = JSON.parse(schemaRaw);
      const validate = ajv.compile<Topic>(schema);
      return (data: unknown): data is Topic => {
        const ok = validate(data);
        if (!ok) {
          const issues = (validate.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message ?? "validation error"}`);
          throw new Error(`Topic schema validation failed: ${issues.join("; ")}`);
        }
        return true;
      };
    })();
  }
  return validatorPromise;
}

export async function assertValidTopic(data: unknown): Promise<Topic> {
  const validate = await getValidator();
  if (validate(data)) {
    return data;
  }
  throw new Error("Unknown topic validation error.");
}
