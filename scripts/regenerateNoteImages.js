import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const notesImageRoot = path.join(repoRoot, "public", "notes", "image");

const IMAGE_SAFE_LAYOUT_SUFFIX = [
  "Render this as a clean educational diagram.",
  "IMPORTANT layout constraints:",
  "- Keep the entire diagram fully contained inside the canvas.",
  "- Center the diagram and scale it down if needed.",
  "- Leave at least 15% safe margin on the left, right, top, and bottom.",
  "- No text, arrow, line, box, icon, node, label, or table cell may touch or cross the image boundaries.",
  "- Prefer a balanced landscape composition for wide diagrams.",
  "- Use a clean white background and readable Open Sans, Clear Sans, Helvetica Neue, Helvetica, Arial, Segoe UI Emoji, SF Pro, sans-serif typography.",
].join(" ");

function parseArgs(argv) {
  const args = {
    all: false,
    dryRun: false,
    manifest: null,
    slot: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") args.all = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--manifest") {
      args.manifest = argv[i + 1];
      i += 1;
    } else if (arg === "--slot") {
      args.slot = argv[i + 1];
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.all && !args.manifest) {
    throw new Error("Pass --all or --manifest <path/to/manifest.json>.");
  }

  return args;
}

async function collectManifestPaths(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await collectManifestPaths(fullPath)));
    } else if (entry.isFile() && entry.name === "manifest.json") {
      paths.push(fullPath);
    }
  }

  return paths;
}

function toOutputPath(manifestPath, imageRelPath) {
  const filename = path.basename(imageRelPath);
  return path.join(path.dirname(manifestPath), filename);
}

async function generateImage({ model, prompt }) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      size: "1536x1024",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI image generation failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI image generation response did not include b64_json.");
  }

  return Buffer.from(b64, "base64");
}

async function regenerateManifest(manifestPath, { dryRun, slot }) {
  const raw = await fs.readFile(manifestPath, "utf8");
  const manifest = JSON.parse(raw);
  const model = manifest.model || "gpt-image-1.5";
  const images = Array.isArray(manifest.images) ? manifest.images : [];
  const selectedImages = slot ? images.filter((image) => image.slot === slot) : images;

  for (const image of selectedImages) {
    if (!image?.prompt || !image?.image_rel_path) continue;

    const promptFinal = `${image.prompt}\n\n${IMAGE_SAFE_LAYOUT_SUFFIX}`;
    const outputPath = toOutputPath(manifestPath, image.image_rel_path);

    if (dryRun) {
      console.log(`[dry-run] ${outputPath}`);
      console.log(`  model: ${model}`);
      console.log(`  prompt: ${promptFinal}`);
      continue;
    }

    console.log(`Generating ${outputPath}`);
    const png = await generateImage({ model, prompt: promptFinal });
    await fs.writeFile(outputPath, png);

    image.prompt_final = promptFinal;
  }

  if (!dryRun && selectedImages.length > 0) {
    manifest.prompt_suffix = IMAGE_SAFE_LAYOUT_SUFFIX;
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.dryRun && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required unless --dry-run is passed.");
  }

  const manifestPaths = args.all
    ? await collectManifestPaths(notesImageRoot)
    : [path.resolve(repoRoot, args.manifest)];

  for (const manifestPath of manifestPaths) {
    await regenerateManifest(manifestPath, args);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
