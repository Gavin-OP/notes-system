import { loadEnv } from "../lib/io/env";
import { loadCourseOutline, runTopicPipeline } from "../lib/pipeline";

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  loadEnv();

  const course = getArg("--course");
  const maxItersArg = getArg("--max-iters");
  const maxIters = maxItersArg ? Number(maxItersArg) : 3;

  if (!course) {
    throw new Error("Usage: tsx ai-agents/runners/run_batch.ts --course <course> [--max-iters 3]");
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY. Set it in .env.local or environment.");
  }

  const outline = await loadCourseOutline(course);

  for (const topicOutline of outline.topics) {
    console.log(`Running pipeline for ${course}/${topicOutline.slug} ...`);
    const result = await runTopicPipeline({
      course,
      topicOutline,
      maxIters,
    });
    console.log(
      JSON.stringify(
        {
          topic: topicOutline.slug,
          artifacts_dir: result.artifactsDir,
          final_markdown: result.finalMarkdownPath,
          iterations: result.iterationsRun,
          stop_reason: result.stopReason,
        },
        null,
        2,
      ),
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
