import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_ROOT = path.resolve(__dirname, "..");

const DEFAULT_BACKEND_ROOT = "/Users/lyukexin/Desktop/notes-system-backend";

function parseArgs(argv) {
  const args = {
    subject: "data-science",
    backendRoot: process.env.NOTES_BACKEND_ROOT || DEFAULT_BACKEND_ROOT,
    includeImages: true,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--subject") {
      args.subject = argv[i + 1] || args.subject;
      i += 1;
    } else if (arg === "--backend-root") {
      args.backendRoot = argv[i + 1] || args.backendRoot;
      i += 1;
    } else if (arg === "--skip-images") {
      args.includeImages = false;
    }
  }
  return args;
}

function subjectFsId(subject) {
  return String(subject || "").trim().replaceAll("-", "_");
}

function subjectRouteId(subject) {
  return String(subject || "").trim().replaceAll("_", "-");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyMatchingFiles(srcDir, destDir, extensions) {
  if (!fs.existsSync(srcDir)) {
    return 0;
  }
  ensureDir(destDir);
  let count = 0;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isFile()) {
      continue;
    }
    const ext = path.extname(entry.name);
    if (!extensions.has(ext)) {
      continue;
    }
    copyFile(path.join(srcDir, entry.name), path.join(destDir, entry.name));
    count += 1;
  }
  return count;
}

function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    return 0;
  }
  ensureDir(destDir);
  let count = 0;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") {
      continue;
    }
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      count += copyDirRecursive(src, dest);
    } else if (entry.isFile()) {
      copyFile(src, dest);
      count += 1;
    }
  }
  return count;
}

function main() {
  const args = parseArgs(process.argv);
  const subjectFs = subjectFsId(args.subject);
  const subjectRoute = subjectRouteId(args.subject);
  const backendRoot = path.resolve(args.backendRoot);

  const backendNotesDir = path.join(
    backendRoot,
    "output",
    "content",
    "subjects",
    subjectFs,
    "notes",
    "current",
  );
  const frontendNotesDir = path.join(FRONTEND_ROOT, "public", "notes", subjectRoute);
  const noteCount = copyMatchingFiles(backendNotesDir, frontendNotesDir, new Set([".md", ".json"]));

  const backendGraphDir = path.join(backendRoot, "output", "graph");
  const frontendGraphDir = path.join(FRONTEND_ROOT, "public", "graphs");
  const graphFiles = [`${subjectRoute}-graph.json`, `${subjectRoute}-network-graph.json`];
  let graphCount = 0;
  for (const fileName of graphFiles) {
    const src = path.join(backendGraphDir, fileName);
    if (!fs.existsSync(src)) {
      continue;
    }
    copyFile(src, path.join(frontendGraphDir, fileName));
    graphCount += 1;
  }

  let imageCount = 0;
  if (args.includeImages) {
    const backendImageDir = path.join(backendRoot, "output", "image", subjectFs);
    const frontendImageDir = path.join(FRONTEND_ROOT, "public", "notes", "image", subjectFs);
    imageCount = copyDirRecursive(backendImageDir, frontendImageDir);
  }

  const backendOverviewPath = path.join(
    backendRoot,
    "output",
    "content",
    "subjects",
    subjectFs,
    "overview",
    "syllabus.json",
  );
  let overviewCopied = 0;
  if (fs.existsSync(backendOverviewPath)) {
    const frontendOverviewDir = path.join(FRONTEND_ROOT, "public", "subjects", subjectRoute);
    copyFile(backendOverviewPath, path.join(frontendOverviewDir, "syllabus.json"));
    overviewCopied = 1;
  }

  console.log(
    JSON.stringify(
      {
        subject: subjectRoute,
        backendRoot,
        notesCopied: noteCount,
        graphsCopied: graphCount,
        imagesCopied: imageCount,
        overviewCopied,
      },
      null,
      2,
    ),
  );
}

main();
