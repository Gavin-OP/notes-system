import fs from "fs";
import path from "path";
import { execSync } from "child_process";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesDir = path.join(__dirname, "../public/notes");
const outputFile = path.join(__dirname, "../public/notes-index.json");

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// get last edit name and time from git log
function getGitInfo(filePath) {
  try {
    const name = execSync(`git log -1 --pretty=format:"%an" "${filePath}"`, {
      encoding: "utf8",
    }).trim();
    const time = execSync(
      `git log -1 --pretty=format:"%ad" --date=iso "${filePath}"`,
      {
        encoding: "utf8",
      }
    ).trim();
    return { name, time };
  } catch (e) {
    return { name: "", time: "" };
  }
}

function logInfo(message) {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] [${timestamp}] ${message}`);
}

function logError(message) {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] [${timestamp}] ${message}`);
}

function main() {
  if (!fs.existsSync(notesDir)) {
    logError(`notes directory not found: ${notesDir}`);
    process.exit(1);
  }

  const files = walk(notesDir);

  const urlSet = new Set();
  const notes = [];
  for (const filePath of files) {
    const relPath = path.relative(notesDir, filePath);
    const url = `/notes/${relPath.replace(/\\/g, "/")}`;
    if (urlSet.has(url)) {
      logError(`Duplicate fileUrl detected: ${url}`);
      process.exit(1);
    }
    urlSet.add(url);
    const dir = path.dirname(relPath).replace(/\\/g, "/");
    const { name, time } = getGitInfo(filePath);
    notes.push({
      fileName: path.basename(filePath),
      fileDirectory: dir,
      fileUrl: url,
      lastEditName: name,
      lastEditTime: time,
    });
  }

  fs.writeFileSync(outputFile, JSON.stringify(notes, null, 2), "utf8");
  logInfo(`notes-index.json generated at ${outputFile}`);
}

main();
