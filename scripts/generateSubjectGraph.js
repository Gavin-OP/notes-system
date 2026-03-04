/**
 * Generate knowledge graph JSON for a subject (unified).
 *
 * Supports two data sources:
 * 1. ai-agents outputs: reads metadata.json from ai-agents/outputs/<course>/<topic>/
 * 2. Markdown notes: reads front matter from public/notes/<subject>/concepts/*.md
 *
 * Output: public/graphs/{subjectId}-graph.json
 * Data contract matches existing mindmap renderers (graphLoader, networkGraphLoader, radialTreeUtils).
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

// ====== Utils ======
function logInfo(message) {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] [${timestamp}] ${message}`);
}

function logError(message) {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] [${timestamp}] ${message}`);
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalize(str) {
  return String(str ?? "")
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeCategoryId(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function toSubjectName(subjectId) {
  return subjectId
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// ====== Resolve ai-agents outputs directory (case-insensitive) ======
function resolveAiAgentsOutputsDir(subjectId) {
  const outputsBase = path.join(rootDir, "ai-agents", "outputs");
  if (!fs.existsSync(outputsBase)) return null;
  const candidates = [
    subjectId,
    subjectId.toLowerCase(),
    toSubjectName(subjectId).replace(/\s/g, ""),
  ].filter((c, i, arr) => arr.indexOf(c) === i);
  for (const name of candidates) {
    const dir = path.join(outputsBase, name);
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return dir;
    }
  }
  return null;
}

// ====== Category mapping (extensible per subject) ======
function getCategoryFromTags(subjectId, tags) {
  const values = new Set((tags ?? []).map((t) => String(t).toLowerCase()));
  if (subjectId === "python") {
    if (values.has("matplotlib") || values.has("seaborn") || values.has("visualization")) return "Visualization";
    if (values.has("numpy") || values.has("pandas") || values.has("data-analysis")) return "Data Libraries";
    if (
      values.has("control-flow") || values.has("functions") || values.has("file-io") ||
      values.has("algorithms") || values.has("basics") || values.has("data-types") || values.has("data-structures")
    ) return "Core Python";
    if (values.has("foundations") || values.has("computer-science") || values.has("setup")) return "Foundations";
    return "Core Python";
  }
  return "Uncategorized";
}

// ====== Build title/slug -> note URL map from notes-index ======
function buildTitleToNoteUrlMap(subjectId) {
  const notesIndexPath = path.join(rootDir, "public", "notes-index.json");
  if (!fs.existsSync(notesIndexPath)) return new Map();
  const notesIndex = loadJson(notesIndexPath);
  const folder = notesIndex.find(
    (item) => item.type === "folder" && (item.directory === subjectId || item.slug === subjectId)
  );
  const map = new Map();
  const collect = (items) => {
    for (const child of items ?? []) {
      if (child.type === "file") {
        const url = child.url;
        const keys = [
          normalize(child.slug),
          normalize(child.title),
          normalize(child.name),
          normalize((url || "").split("/").pop() ?? ""),
        ];
        for (const key of keys) {
          if (key) map.set(key, url);
        }
      }
      if (child.children) collect(child.children);
    }
  };
  collect(folder?.children ?? []);
  return map;
}

// ====== Topological order for learning order ======
function topologicalOrder(nodes) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const inDegree = new Map(nodes.map((n) => [n.id, 0]));
  const next = new Map(nodes.map((n) => [n.id, []]));
  for (const n of nodes) {
    for (const prereq of n.prerequisites ?? []) {
      if (!byId.has(prereq)) continue;
      inDegree.set(n.id, (inDegree.get(n.id) ?? 0) + 1);
      next.get(prereq)?.push(n.id);
    }
  }
  const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id);
  const order = [];
  while (queue.length > 0) {
    const id = queue.shift();
    if (!id) break;
    order.push(id);
    for (const childId of next.get(id) ?? []) {
      const deg = (inDegree.get(childId) ?? 0) - 1;
      inDegree.set(childId, deg);
      if (deg === 0) queue.push(childId);
    }
  }
  return order.length === nodes.length ? order : nodes.map((n) => n.id);
}

// ====== Extract bidirectional links from markdown ======
function extractBidirectionalLinks(content) {
  const linkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const slug = match[1].trim();
    if (slug && !links.includes(slug)) links.push(slug);
  }
  return links;
}

// ====== Source A: Build graph from ai-agents metadata ======
function buildGraphFromAiAgents(subjectId, outputsDir) {
  const topicDirs = fs
    .readdirSync(outputsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(outputsDir, e.name));

  const titleToUrl = buildTitleToNoteUrlMap(subjectId);
  const nodes = [];

  for (const topicDir of topicDirs) {
    const metadataPath = path.join(topicDir, "metadata.json");
    if (!fs.existsSync(metadataPath)) continue;
    const metadata = loadJson(metadataPath);
    const keyCandidates = [normalize(metadata.slug), normalize(metadata.title)];
    const matchedUrl = keyCandidates.map((k) => titleToUrl.get(k)).find(Boolean);
    const noteFileName = metadata.note_file_name ?? `${metadata.slug}.md`;
    nodes.push({
      id: metadata.slug,
      title: metadata.title,
      displayTitle: metadata.title,
      noteUrl: matchedUrl ?? `/note/${subjectId}/${noteFileName.replace(/\.md$/i, "")}`,
      filePath: `${subjectId}/${noteFileName}`,
      category: getCategoryFromTags(subjectId, metadata.tags),
      categoryId: normalizeCategoryId(getCategoryFromTags(subjectId, metadata.tags)),
      importance: (metadata.difficulty ?? 2) >= 3 ? "high" : "medium",
      learningPhase: (metadata.difficulty ?? 1) <= 1 ? 0 : (metadata.difficulty ?? 1) <= 2 ? 1 : 2,
      prerequisites: Array.isArray(metadata.prerequisites) ? metadata.prerequisites : [],
      estimatedMinutes: metadata.estimated_time_minutes ?? null,
      difficulty: (metadata.difficulty ?? 2) <= 2 ? "medium" : "hard",
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      description: "",
      keywords: [],
      linkedConcepts: [],
    });
  }

  const order = topologicalOrder(nodes);
  const orderMap = new Map(order.map((id, idx) => [id, idx + 1]));

  const categoryColors = {
    Foundations: "#FF7675",
    "Core Python": "#5DBBDB",
    "Data Libraries": "#74D3AE",
    Visualization: "#4A9FF5",
    Uncategorized: "#95A5A6",
  };

  const categoriesByName = new Map();
  for (const node of nodes) {
    node.learningOrder = orderMap.get(node.id) ?? 999;
    const cat = node.category;
    if (!categoriesByName.has(cat)) {
      categoriesByName.set(cat, {
        id: normalizeCategoryId(cat),
        name: cat,
        displayName: cat,
        color: categoryColors[cat] ?? "#95A5A6",
        order: categoriesByName.size + 1,
        description: "",
        nodes: [],
      });
    }
    categoriesByName.get(cat).nodes.push(node.id);
  }

  const edges = [];
  const edgeSet = new Set();
  const addEdge = (source, target, type, strength) => {
    const key = `${source}->${target}:${type}`;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push({
      id: `edge-${edges.length}`,
      source,
      target,
      type,
      label: type === "prerequisite" ? "Prerequisite" : "Related",
      strength,
      bidirectional: false,
    });
  };

  for (const node of nodes) {
    for (const prereq of node.prerequisites) {
      if (nodes.some((n) => n.id === prereq)) addEdge(prereq, node.id, "prerequisite", 1.0);
    }
  }

  const byCategory = new Map();
  for (const node of nodes) {
    const arr = byCategory.get(node.categoryId) ?? [];
    arr.push(node);
    byCategory.set(node.categoryId, arr);
  }
  for (const arr of byCategory.values()) {
    arr.sort((a, b) => a.learningOrder - b.learningOrder);
    for (let i = 1; i < arr.length; i += 1) {
      addEdge(arr[i - 1].id, arr[i].id, "related", 0.6);
    }
  }

  for (const node of nodes) {
    node.linkedConcepts = edges
      .filter((e) => e.source === node.id || e.target === node.id)
      .map((e) => (e.source === node.id ? e.target : e.source))
      .filter((id, idx, list) => list.indexOf(id) === idx);
  }

  const learningPhases = [
    { phase: 0, name: "Foundations", description: "Core setup and fundamentals", estimatedHours: 0 },
    { phase: 1, name: "Core Skills", description: "Primary skills", estimatedHours: 0 },
    { phase: 2, name: "Applied Tools", description: "Libraries and advanced workflow", estimatedHours: 0 },
  ];

  return {
    meta: {
      subjectId,
      subjectName: toSubjectName(subjectId),
      version: "1.0.0",
      lastGenerated: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
    categories: Array.from(categoriesByName.values()),
    learningPhases,
    nodes,
    edges,
  };
}

// ====== Source B: Build graph from markdown concepts ======
function processConceptNote(filePath, subjectId) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { data: frontMatter, content: markdownContent } = matter(content);
    const fileName = path.basename(filePath, ".md");
    const slug = frontMatter.slug || fileName;
    const linkedConcepts = extractBidirectionalLinks(markdownContent);

    return {
      id: slug,
      title: frontMatter.title || fileName,
      displayTitle: frontMatter.displayTitle || frontMatter.title || fileName,
      noteUrl: `/note/${subjectId}/concepts/${slug}`,
      filePath: `${subjectId}/concepts/${fileName}.md`,
      category: frontMatter.mindmap_category || "Uncategorized",
      subcategory: frontMatter.mindmap_subcategory || null,
      importance: frontMatter.mindmap_importance || "medium",
      position: frontMatter.mindmap_position || null,
      learningPhase: frontMatter.learning_phase !== undefined ? frontMatter.learning_phase : -1,
      learningOrder: frontMatter.learning_order !== undefined ? frontMatter.learning_order : -1,
      prerequisites: Array.isArray(frontMatter.prerequisites) ? frontMatter.prerequisites : [],
      estimatedMinutes: frontMatter.estimated_minutes || null,
      difficulty: frontMatter.difficulty || "medium",
      tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
      description: frontMatter.description || "",
      keywords: Array.isArray(frontMatter.keywords) ? frontMatter.keywords : [],
      linkedConcepts,
    };
  } catch (e) {
    logError(`Failed to process ${filePath}: ${e.message}`);
    return null;
  }
}

function buildEdges(nodes) {
  const edges = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  let edgeId = 0;
  nodes.forEach((sourceNode) => {
    sourceNode.prerequisites.forEach((prereqId) => {
      if (nodeMap.has(prereqId)) {
        edges.push({
          id: `edge-${edgeId++}`,
          source: prereqId,
          target: sourceNode.id,
          type: "prerequisite",
          label: "前置知识",
          strength: 1.0,
          bidirectional: false,
        });
      }
    });
    sourceNode.linkedConcepts.forEach((targetId) => {
      if (nodeMap.has(targetId)) {
        const existing = edges.find(
          (e) =>
            (e.source === sourceNode.id && e.target === targetId) ||
            (e.source === targetId && e.target === sourceNode.id)
        );
        if (!existing) {
          edges.push({
            id: `edge-${edgeId++}`,
            source: sourceNode.id,
            target: targetId,
            type: "related",
            label: "相关概念",
            strength: 0.7,
            bidirectional: true,
          });
        }
      }
    });
  });
  return edges;
}

function extractCategories(nodes) {
  const categoryMap = new Map();
  const categoryColors = {
    Foundations: "#FF7675",
    "Data & Data Handling": "#FF9A76",
    "Statistics & Probability": "#74D3AE",
    "Machine Learning": "#5DBBDB",
    "Modeling & Evaluation": "#4A9FF5",
    "Ethics & Applications": "#FFA94D",
    Uncategorized: "#95A5A6",
  };
  nodes.forEach((node) => {
    const cat = node.category;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, {
        id: cat.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-"),
        name: cat,
        displayName: cat,
        color: categoryColors[cat] || "#95A5A6",
        order: categoryMap.size + 1,
        description: "",
        nodes: [],
      });
    }
    categoryMap.get(cat).nodes.push(node.id);
  });
  return Array.from(categoryMap.values());
}

function extractLearningPhases(nodes) {
  const phaseMap = new Map();
  const phaseNames = { 0: "入门阶段", 1: "基础阶段", 2: "进阶阶段", 3: "高级阶段" };
  const phaseDescriptions = {
    0: "了解基本概念和定义",
    1: "掌握核心知识和技能",
    2: "深入学习高级技术",
    3: "综合应用和优化",
  };
  nodes.forEach((node) => {
    const phase = node.learningPhase;
    if (phase >= 0 && !phaseMap.has(phase)) {
      phaseMap.set(phase, {
        phase,
        name: phaseNames[phase] || `阶段 ${phase}`,
        description: phaseDescriptions[phase] || "",
        estimatedHours: 0,
      });
    }
  });
  return Array.from(phaseMap.values()).sort((a, b) => a.phase - b.phase);
}

function buildGraphFromMarkdown(subjectId, conceptsDir) {
  const conceptFiles = fs
    .readdirSync(conceptsDir)
    .filter((f) => f.endsWith(".md") && f !== ".meta.yaml");

  const nodes = [];
  conceptFiles.forEach((file) => {
    const node = processConceptNote(path.join(conceptsDir, file), subjectId);
    if (node) nodes.push(node);
  });

  const edges = buildEdges(nodes);
  const categories = extractCategories(nodes);
  const learningPhases = extractLearningPhases(nodes);

  return {
    meta: {
      subjectId,
      subjectName: toSubjectName(subjectId),
      version: "1.0.0",
      lastGenerated: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
    categories,
    learningPhases,
    nodes,
    edges,
  };
}

// ====== Main ======
function generateSubjectGraph(subjectId) {
  const outputDir = path.join(rootDir, "public", "graphs");
  const outputFile = path.join(outputDir, `${subjectId}-graph.json`);

  const aiOutputsDir = resolveAiAgentsOutputsDir(subjectId);
  const notesDir = path.join(rootDir, "public", "notes");
  const subjectDir = path.join(notesDir, subjectId);
  const conceptsDir = path.join(subjectDir, "concepts");

  let graph;
  let source;

  if (aiOutputsDir) {
    source = "ai-agents";
    logInfo(`Using ai-agents outputs: ${aiOutputsDir}`);
    graph = buildGraphFromAiAgents(subjectId, aiOutputsDir);
  } else if (fs.existsSync(conceptsDir) && fs.statSync(conceptsDir).isDirectory()) {
    source = "markdown";
    logInfo(`Using markdown concepts: ${conceptsDir}`);
    graph = buildGraphFromMarkdown(subjectId, conceptsDir);
  } else {
    logError(
      `No data source for subject "${subjectId}". ` +
        `Expected ai-agents/outputs/${subjectId}/ or public/notes/${subjectId}/concepts/`
    );
    process.exit(1);
  }

  // Resolve subject name from .meta.yaml if available
  const metaPath = path.join(subjectDir, ".meta.yaml");
  if (fs.existsSync(metaPath)) {
    try {
      const meta = yaml.load(fs.readFileSync(metaPath, "utf8"));
      if (meta?.title) graph.meta.subjectName = meta.title;
    } catch (_) {}
  }

  graph.layouts = {
    radial: { centerX: 500, centerY: 400, mainRadius: 300, subRadius: 150 },
    hierarchical: { direction: "TB", levelSeparation: 150, nodeSeparation: 100 },
  };
  graph.viewConfigs = {
    mindmap: { defaultLayout: "radial", showLabels: true, showEdges: true, nodeSize: { high: 80, medium: 60, low: 40 } },
    learningPath: { defaultLayout: "hierarchical", showPrerequisites: true, showEstimatedTime: true, groupByPhase: true },
  };

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(graph, null, 2), "utf8");

  logInfo(`Graph generated (source: ${source}): ${outputFile}`);
  logInfo(`Statistics: ${graph.meta.nodeCount} nodes, ${graph.meta.edgeCount} edges`);
}

// ====== Discover all subjects with data ======
function discoverSubjects() {
  const subjects = new Set();
  const outputsBase = path.join(rootDir, "ai-agents", "outputs");
  const notesBase = path.join(rootDir, "public", "notes");
  if (fs.existsSync(outputsBase)) {
    for (const name of fs.readdirSync(outputsBase)) {
      const dir = path.join(outputsBase, name);
      if (fs.statSync(dir).isDirectory()) subjects.add(name.toLowerCase());
    }
  }
  if (fs.existsSync(notesBase)) {
    for (const name of fs.readdirSync(notesBase)) {
      const conceptsDir = path.join(notesBase, name, "concepts");
      if (fs.existsSync(conceptsDir) && fs.statSync(conceptsDir).isDirectory()) {
        subjects.add(name.toLowerCase());
      }
    }
  }
  return Array.from(subjects);
}

// ====== CLI ======
const args = process.argv.slice(2);
const subjectIds = args.length > 0 ? args : discoverSubjects();

if (subjectIds.length === 0) {
  logError("No subjects found. Pass subject IDs as args, e.g. node generateSubjectGraph.js python data-science");
  process.exit(1);
}

subjectIds.forEach((id) => generateSubjectGraph(id));
