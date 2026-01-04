/**
 * notes-index.json meta fields:
 *
 * type            - file or folder (auto detected)
 * name            - The file/folder name (auto detected)
 * directory       - The relative directory path (auto detected)
 * url             - The unique URL or route for the note or folder (auto generated)
 *                   Need to double check for duplicate URLs, if so, then raise error, xxxx and xxxx are duplicated.
 * slug            - user defined slug
 * title           - The title of the note/folder to display in the sidebar
 * order           - The order number for sorting
 *                   If not provided, first sort by order, then by name alphabetically
 * display         - Whether to display the note/folder in the sidebar (true/false)
 * tags            - An array of tags associated with the note
 * lastEditName    - The name of the last person who edited the file (from git log)
 * lastEditTime    - The last edit time in format "YYYY-MM-DD HH:mm:ss +0800"
 *
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

import yaml from "js-yaml";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { url } from "inspector";

// ====== utils ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function logInfo(message) {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] [${timestamp}] ${message}`);
}

function logError(message) {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] [${timestamp}] ${message}`);
}

function formatSlug(str) {
  // replace space with -, remove /, all lower case
  let slug = str.replace(/\s+/g, "-").replace(/\/+/, "").toLowerCase();
  slug = slug.replace(/^[\.]+/, ""); // remove leading dots
  slug = slug.replace(/^[\-]+/, ""); // remove leading hyphens
  return slug;
}

// ====== process meta ======
function getGitInfo(filePath) {
  try {
    const name = execSync(`git log -1 --pretty=format:"%an" "${filePath}"`, {
      encoding: "utf8",
    }).trim();
    const time = execSync(
      `git log -1 --pretty=format:"%ad" --date=format:"%Y-%m-%d %H:%M:%S %z" "${filePath}"`,
      {
        encoding: "utf8",
      }
    ).trim();
    return { name, time };
  } catch (e) {
    return { name: "", time: "" };
  }
}

function processFileMeta(fullPath, notesDir, parentSlugs, urlSet) {
  const relPath = path.relative(notesDir, fullPath);
  const relDir = path.dirname(relPath).replace(/\\/g, "/");
  const fileName = path.basename(fullPath);
  let fileMeta = {};
  let content = "";

  if (fileName.endsWith(".md")) {
    content = fs.readFileSync(fullPath, "utf8");
    try {
      fileMeta = matter(content).data || {};
    } catch (e) {
      logError(`Failed to parse front matter in ${fullPath}: ${e}`);
    }
  }

  const { name: lastEditName, time: lastEditTimeRaw } = getGitInfo(fullPath);
  const slug = fileMeta.slug ? formatSlug(fileMeta.slug) : formatSlug(fileName);
  const title = fileMeta.title || fileName;
  const display = fileMeta.display !== undefined ? fileMeta.display : true;
  const order = fileMeta.order !== undefined ? fileMeta.order : -1;
  const tags = Array.isArray(fileMeta.tags)
    ? fileMeta.tags
    : Array.isArray(fileMeta.tag)
    ? fileMeta.tag
    : [];
  const url = "/notes/" + [...parentSlugs, slug].filter(Boolean).join("/");

  if (urlSet.has(url)) {
    logError(`Duplicate url detected: ${url}`);
    process.exit(1);
  }
  urlSet.add(url);

  return {
    type: "file",
    name: fileName,
    directory: relDir,
    url,
    slug,
    title,
    display,
    order,
    tags,
    lastEditName,
    lastEditTime: lastEditTimeRaw,
  };
}

function processFolderMeta(
  currentDir,
  notesDir,
  children,
  parentSlugs,
  urlSet
) {
  const relDir = path.relative(notesDir, currentDir).replace(/\\/g, "/");
  const metaPath = path.join(currentDir, ".meta.yaml");
  let meta = {};

  if (fs.existsSync(metaPath)) {
    try {
      meta = yaml.load(fs.readFileSync(metaPath, "utf8")) || {};
    } catch (e) {
      logError(`Failed to parse ${metaPath}: ${e}`);
    }
  }

  const slug = meta.slug
    ? formatSlug(meta.slug)
    : formatSlug(path.basename(currentDir));
  const title = meta.title || path.basename(currentDir);
  const display = meta.display !== undefined ? meta.display : true;
  const order = meta.order !== undefined ? meta.order : -1;

  // tags
  function collectTags(nodes) {
    let tags = [];
    for (const node of nodes) {
      if (node.type === "file") {
        tags = tags.concat(node.tags || []);
      } else if (node.type === "folder" && Array.isArray(node.children)) {
        tags = tags.concat(collectTags(node.children));
      }
    }
    return tags;
  }
  let tags = collectTags(children);
  if (Array.isArray(meta.tags)) {
    tags = tags.concat(meta.tags);
  } else if (Array.isArray(meta.tag)) {
    tags = tags.concat(meta.tag);
  }
  tags = Array.from(new Set(tags));

  // url
  const url = "/notes/" + [...parentSlugs, slug].filter(Boolean).join("/");
  if (urlSet.has(url)) {
    logError(`Duplicate url detected: ${url}`);
    process.exit(1);
  }
  urlSet.add(url);

  return {
    type: "folder",
    name: path.basename(currentDir),
    directory: relDir,
    url,
    slug,
    title,
    display,
    order,
    tags,
    children,
  };
}

function processDirTree(
  currentDir,
  notesDir,
  parentSlugs = [],
  urlSet = new Set()
) {
  const items = fs.readdirSync(currentDir);
  const children = [];

  for (const file of items) {
    const fullPath = path.join(currentDir, file);
    if (file === ".meta.yaml") continue;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      let meta = {};
      const metaPath = path.join(fullPath, ".meta.yaml");
      if (fs.existsSync(metaPath)) {
        try {
          meta = yaml.load(fs.readFileSync(metaPath, "utf8")) || {};
        } catch (e) {
          logError(`Failed to parse ${metaPath}: ${e}`);
        }
      }

      const slug = meta.slug
        ? formatSlug(meta.slug)
        : formatSlug(path.basename(fullPath));
      const subChildren = processDirTree(
        fullPath,
        notesDir,
        [...parentSlugs, slug],
        urlSet
      );
      children.push(
        processFolderMeta(fullPath, notesDir, subChildren, parentSlugs, urlSet)
      );
    } else {
      children.push(processFileMeta(fullPath, notesDir, parentSlugs, urlSet));
    }
  }

  return children;
}

function sortTree(nodes) {
  if (!Array.isArray(nodes)) return;
  nodes.sort((a, b) => {
    const aOrder = a.order === undefined ? -1 : a.order;
    const bOrder = b.order === undefined ? -1 : b.order;
    if (aOrder === -1 && bOrder === -1) {
      return a.name.localeCompare(b.name);
    } else if (aOrder === -1) {
      return 1;
    } else if (bOrder === -1) {
      return -1;
    } else if (aOrder !== bOrder) {
      return aOrder - bOrder;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  for (const node of nodes) {
    if (node.type === "folder" && Array.isArray(node.children)) {
      sortTree(node.children);
    }
  }
}

// ====== main ======
function main() {
  if (!fs.existsSync(notesDir)) {
    logError(`notes directory not found: ${notesDir}`);
    process.exit(1);
  }

  const treeNotes = processDirTree(notesDir, notesDir);
  sortTree(treeNotes);

  fs.writeFileSync(outputFile, JSON.stringify(treeNotes, null, 2), "utf8");
  logInfo(`notes-index.json generated at ${outputFile}`);
}

const notesDir = path.join(__dirname, "../public/notes");
const outputFile = path.join(__dirname, "../public/notes-index.json");
main();
