/**
 * Learning Path graph data loader and adapters.
 * Reuses the same subject graph endpoint used by mindmap.
 */

function parseDifficultyLevel(node) {
  const levelFromField = Number(node?.difficultyLevel);
  if (Number.isFinite(levelFromField)) return levelFromField;

  const raw = String(node?.difficulty ?? "").toLowerCase();
  if (!raw) return 99;
  if (/^\d+$/.test(raw)) return Number(raw);
  if (raw === "easy") return 1;
  if (raw === "medium") return 2;
  if (raw === "hard") return 3;
  return 99;
}

function compareNodePriority(a, b) {
  const levelA = parseDifficultyLevel(a);
  const levelB = parseDifficultyLevel(b);
  if (levelA !== levelB) return levelA - levelB;

  const timeA =
    typeof a?.estimatedMinutes === "number" && Number.isFinite(a.estimatedMinutes)
      ? a.estimatedMinutes
      : Number.POSITIVE_INFINITY;
  const timeB =
    typeof b?.estimatedMinutes === "number" && Number.isFinite(b.estimatedMinutes)
      ? b.estimatedMinutes
      : Number.POSITIVE_INFINITY;
  if (timeA !== timeB) return timeA - timeB;

  return String(a?.id ?? "").localeCompare(String(b?.id ?? ""));
}

function deriveLearningPathFromNodes(nodes) {
  const validNodes = Array.isArray(nodes) ? nodes.filter((n) => n?.id) : [];
  const byId = new Map(validNodes.map((node) => [node.id, node]));
  const inDegree = new Map(validNodes.map((node) => [node.id, 0]));
  const next = new Map(validNodes.map((node) => [node.id, []]));
  const warnings = [];

  for (const node of validNodes) {
    for (const prereq of node.prerequisites ?? []) {
      if (!byId.has(prereq)) {
        warnings.push(
          `Topic "${node.id}" references missing prerequisite "${prereq}"`,
        );
        continue;
      }
      inDegree.set(node.id, (inDegree.get(node.id) ?? 0) + 1);
      next.get(prereq)?.push(node.id);
    }
  }

  const sortIds = (ids) =>
    [...ids].sort((a, b) =>
      compareNodePriority(byId.get(a), byId.get(b)),
    );

  let available = sortIds(
    validNodes
      .filter((node) => (inDegree.get(node.id) ?? 0) === 0)
      .map((node) => node.id),
  );
  const roots = [...available];

  const ordered = [];
  const layers = [];

  while (available.length > 0) {
    const currentLayer = [...available];
    layers.push(currentLayer);
    available = [];

    for (const id of currentLayer) {
      ordered.push(id);
      for (const childId of next.get(id) ?? []) {
        const degree = (inDegree.get(childId) ?? 0) - 1;
        inDegree.set(childId, degree);
        if (degree === 0) available.push(childId);
      }
    }

    available = sortIds(available);
  }

  const orderedSet = new Set(ordered);
  const cycleNodes = validNodes
    .map((node) => node.id)
    .filter((id) => !orderedSet.has(id))
    .sort((a, b) => String(a).localeCompare(String(b)));

  return {
    ordered,
    layers,
    roots,
    hasCycle: cycleNodes.length > 0,
    cycleNodes,
    warnings,
  };
}

export async function loadSubjectGraph(subjectId) {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}graphs/${subjectId}-graph.json`,
    );
    if (!response.ok) {
      throw new Error(`Failed to load graph: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading subject graph:", error);
    return null;
  }
}

export function extractLearningPathData(graphData) {
  if (!graphData) return null;

  const learningPath =
    graphData.learningPath && typeof graphData.learningPath === "object"
      ? graphData.learningPath
      : deriveLearningPathFromNodes(graphData.nodes);

  const nodesById = new Map((graphData.nodes ?? []).map((node) => [node.id, node]));
  const orderedNodes = (learningPath.ordered ?? [])
    .map((id) => nodesById.get(id))
    .filter(Boolean);
  const layeredNodes = (learningPath.layers ?? []).map((layer) =>
    layer.map((id) => nodesById.get(id)).filter(Boolean),
  );

  return {
    subjectName: graphData.meta?.subjectName,
    orderedNodes,
    layeredNodes,
    roots: learningPath.roots ?? [],
    hasCycle: Boolean(learningPath.hasCycle),
    cycleNodes: learningPath.cycleNodes ?? [],
    warnings: learningPath.warnings ?? [],
  };
}
