import dotenv from "dotenv";
import path from "node:path";

export function loadEnv() {
  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
  dotenv.config();
}
