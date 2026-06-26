import {
  findMeta,
  normalizeNoteRoute,
  normalizeUrl,
} from "./notesIndexUtils";

export function findSubjectFolderInIndex(data, subjectId) {
  if (!Array.isArray(data) || !subjectId) return null;
  const targetUrl = normalizeUrl(`/note/${subjectId}`);
  return findMeta(data, targetUrl);
}

function toReadableTitle(rawValue) {
  const source = String(rawValue || "")
    .replace(/\.md$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!source) return "Untitled";
  return source.replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeDisplayTitle(rawValue, fallbackValue) {
  const candidate = String(rawValue || "").trim();
  if (!candidate) return toReadableTitle(fallbackValue);
  const slugLike = /[-_]/.test(candidate) || /^[a-z0-9\s]+$/.test(candidate);
  return slugLike ? toReadableTitle(candidate) : candidate;
}

const IMPORTANCE_RANK = { high: 0, medium: 1, low: 2 };

function formatConceptNode(node) {
  const subject = node.subject || "";
  const noteSlug = node.noteSlug || "";
  const noteUrl =
    normalizeNoteRoute(node.noteUrl) ||
    (noteSlug && subject ? normalizeNoteRoute(`/note/${subject}/${noteSlug}.md`) : "");
  const slug = String(node.id || "").split("/").pop() || "";
  const anchorId = node.anchorId || (slug ? `concept-${slug}` : "");

  return {
    id: node.id,
    label: node.displayTitle ?? node.title ?? node.name ?? slug,
    noteUrl,
    anchorId,
    importance: node.importance || "medium",
    learningOrder: Number.isFinite(node.learningOrder) ? node.learningOrder : 999,
  };
}

function conceptHref(concept) {
  if (!concept.noteUrl) return null;
  const hash = concept.anchorId ? `#${concept.anchorId}` : "";
  return `${concept.noteUrl}${hash}`;
}

export async function loadSubjectSyllabus(subjectId) {
  if (!subjectId) return null;

  const configuredApiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const apiPaths = [
    configuredApiBase ? `${configuredApiBase}/api/v1/subjects/${subjectId}/syllabus` : null,
    `${import.meta.env.BASE_URL}api/v1/subjects/${subjectId}/syllabus`,
    `/api/v1/subjects/${subjectId}/syllabus`,
  ].filter(Boolean);

  for (const path of apiPaths) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) continue;
      const data = await response.json();
      if (data && typeof data === "object") return data;
    } catch {
      // try next candidate
    }
  }

  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}subjects/${subjectId}/syllabus.json`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || typeof data !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

export function buildConceptPreviewFromSyllabus(syllabus) {
  const groups = Array.isArray(syllabus?.conceptGroups) ? syllabus.conceptGroups : [];
  if (groups.length === 0) {
    return { groups: [], totalConcepts: 0 };
  }

  const normalizedGroups = [...groups]
    .sort((a, b) => (a.topicOrder ?? 999) - (b.topicOrder ?? 999))
    .map((group) => {
      const concepts = (Array.isArray(group.concepts) ? group.concepts : []).map((concept) => {
        const noteUrl = normalizeNoteRoute(concept.noteUrl);
        const anchorId = concept.anchorId || "";
        const hash = anchorId ? `#${anchorId}` : "";
        return {
          ...concept,
          label: concept.label || concept.title || concept.slug,
          href: noteUrl ? `${noteUrl}${hash}` : null,
        };
      });
      return {
        id: group.id,
        title: group.title,
        color: group.color || "",
        concepts,
        totalInCategory: concepts.length,
      };
    })
    .filter((group) => group.concepts.length > 0);

  const totalConcepts =
    Number(syllabus?.meta?.conceptCount) ||
    normalizedGroups.reduce((sum, group) => sum + group.concepts.length, 0);

  return { groups: normalizedGroups, totalConcepts };
}

export function buildDefaultSyllabus(subjectId, graphMeta = {}) {
  const name = graphMeta.subjectName || normalizeDisplayTitle(subjectId, subjectId);
  return {
    subjectId,
    summary: `${name} is organized as a connected knowledge system. Use the syllabus sections below as they are published, or explore concepts and notes from the sidebar.`,
    outcomes: [],
    level: "",
    prerequisites: [],
    whyLearn: "",
    whoItsFor: [],
    isFallback: true,
  };
}

export function buildConceptPreviewByCategory(graphData, options = {}) {
  const conceptsPerCategory = options.conceptsPerCategory ?? 8;
  const categories = Array.isArray(graphData?.categories) ? graphData.categories : [];
  const nodesById = new Map(
    (Array.isArray(graphData?.nodes) ? graphData.nodes : []).map((node) => [node.id, node]),
  );
  const subjectRootId = graphData?.meta?.subjectId || "";

  const groups = categories
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((category) => {
      const concepts = (category.nodes || [])
        .map((nodeId) => nodesById.get(nodeId))
        .filter((node) => node && node.id && node.id !== subjectRootId)
        .sort(
          (a, b) =>
            (IMPORTANCE_RANK[a.importance] ?? 1) - (IMPORTANCE_RANK[b.importance] ?? 1) ||
            (a.learningOrder ?? 999) - (b.learningOrder ?? 999),
        )
        .slice(0, conceptsPerCategory)
        .map((node) => {
          const concept = formatConceptNode(node);
          return {
            ...concept,
            href: conceptHref(concept),
          };
        });

      return {
        id: category.id,
        title: category.displayName || category.name || category.id,
        color: category.color || "",
        concepts,
        totalInCategory: Array.isArray(category.nodes) ? category.nodes.length : 0,
      };
    })
    .filter((group) => group.concepts.length > 0);

  const totalConcepts = Number(graphData?.meta?.nodeCount) || nodesById.size;
  return { groups, totalConcepts };
}

export function buildFlatConceptPreview(graphData, options = {}) {
  const limit = options.limit ?? 32;
  const subjectRootId = graphData?.meta?.subjectId || "";
  const nodes = (Array.isArray(graphData?.nodes) ? graphData.nodes : [])
    .filter((node) => node?.id && node.id !== subjectRootId && node.id.includes("/"))
    .sort(
      (a, b) =>
        (IMPORTANCE_RANK[a.importance] ?? 1) - (IMPORTANCE_RANK[b.importance] ?? 1) ||
        (a.learningOrder ?? 999) - (b.learningOrder ?? 999),
    )
    .slice(0, limit)
    .map((node) => {
      const concept = formatConceptNode(node);
      return {
        ...concept,
        href: conceptHref(concept),
      };
    });

  const totalConcepts = Number(graphData?.meta?.nodeCount) || graphData?.nodes?.length || 0;
  return { concepts: nodes, totalConcepts };
}

export function getSubjectDisplayTitle(subjectFolder, graphMeta = {}, subjectId = "") {
  if (graphMeta?.subjectName) return graphMeta.subjectName;
  if (subjectFolder?.title && !String(subjectFolder.title).includes("-")) {
    return normalizeDisplayTitle(subjectFolder.title, subjectFolder.name);
  }
  return normalizeDisplayTitle(subjectId, subjectId);
}
