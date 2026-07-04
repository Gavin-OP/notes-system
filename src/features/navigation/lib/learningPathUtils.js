export function normalizePathKey(key = "") {
  return String(key || "").replace(/\/+$/, "");
}

export function pathKeyToNodeId(path = "") {
  const match = normalizePathKey(path).match(/^\/note\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return "";
  return `${match[1]}.${match[2]}`;
}

export function nodeIdToPath(nodeId = "") {
  const [subject, ...slugParts] = String(nodeId || "").split(".");
  const slug = slugParts.join(".");
  if (!subject || !slug) return "";
  return `/note/${subject}/${slug}.md`;
}

export function buildCanonicalOrderMap(canonicalGraph = null) {
  const defaultPathIds = Array.isArray(canonicalGraph?.default_path?.node_ids)
    ? canonicalGraph.default_path.node_ids
    : Array.isArray(canonicalGraph?.defaultPath?.nodeIds)
      ? canonicalGraph.defaultPath.nodeIds
      : [];
  const graphNodes = Array.isArray(canonicalGraph?.nodes) ? canonicalGraph.nodes : [];
  const order = new Map();

  defaultPathIds.forEach((nodeId, index) => {
    order.set(String(nodeId), index + 1);
  });

  graphNodes.forEach((node) => {
    const nodeId = String(node?.node_id || node?.nodeId || "");
    if (!nodeId || order.has(nodeId)) return;
    const estimated = Number(
      node?.metadata?.estimated_order ??
        node?.metadata?.estimatedOrder ??
        node?.estimated_order ??
        node?.estimatedOrder,
    );
    order.set(nodeId, Number.isFinite(estimated) ? estimated : 10_000 + order.size);
  });

  return order;
}

export function resolvePathOrderMode(learningPathDraft, steps = [], canonicalGraph = null) {
  const explicit = String(learningPathDraft?.metadata?.order_mode || learningPathDraft?.metadata?.orderMode || "")
    .trim()
    .toLowerCase();
  if (explicit === "custom" || explicit === "free") return "custom";
  if (explicit === "canonical" || explicit === "recommended") return "canonical";

  const canonicalOrder = getCanonicalOrderedNodeIds(steps, canonicalGraph);
  const draftOrder = steps.map((step) => pathKeyToNodeId(step.key)).filter(Boolean);
  if (canonicalOrder.length !== draftOrder.length) return "custom";
  return canonicalOrder.every((nodeId, index) => nodeId === draftOrder[index]) ? "canonical" : "custom";
}

export function getCanonicalOrderedNodeIds(steps = [], canonicalGraph = null) {
  const orderMap = buildCanonicalOrderMap(canonicalGraph);
  return [...steps]
    .map((step, index) => ({
      nodeId: step.nodeId || pathKeyToNodeId(step.key),
      index,
    }))
    .filter((entry) => entry.nodeId)
    .sort(
      (a, b) =>
        (orderMap.get(a.nodeId) ?? 10_000 + a.index) - (orderMap.get(b.nodeId) ?? 10_000 + b.index) ||
        a.index - b.index,
    )
    .map((entry) => entry.nodeId);
}

export function sortPathNodesCanonically(nodes = [], canonicalGraph = null) {
  const orderMap = buildCanonicalOrderMap(canonicalGraph);
  return [...nodes].sort((a, b) => {
    const aId = String(a?.node_id || a?.nodeId || pathKeyToNodeId(a?.note_url || a?.noteUrl || ""));
    const bId = String(b?.node_id || b?.nodeId || pathKeyToNodeId(b?.note_url || b?.noteUrl || ""));
    return (orderMap.get(aId) ?? Number.MAX_SAFE_INTEGER) - (orderMap.get(bId) ?? Number.MAX_SAFE_INTEGER);
  });
}

export function buildNearbyPathSuggestions({
  anchorNoteUrl = "",
  pathNodeIds = [],
  canonicalGraph = null,
  menuSteps = [],
  limit = 12,
}) {
  const anchorId = pathKeyToNodeId(anchorNoteUrl);
  const inPath = new Set(pathNodeIds);
  const graphNodes = Array.isArray(canonicalGraph?.nodes) ? canonicalGraph.nodes : [];
  const nodeById = new Map(
    graphNodes.map((node) => [String(node?.node_id || node?.nodeId || ""), node]).filter(([id]) => id),
  );
  const suggestions = [];
  const seen = new Set();

  const pushNode = (nodeId, reason) => {
    if (!nodeId || inPath.has(nodeId) || seen.has(nodeId)) return;
    const node = nodeById.get(nodeId);
    if (!node) return;
    seen.add(nodeId);
    suggestions.push({
      nodeId,
      title: node.title || nodeId,
      subject: node.subject || nodeId.split(".")[0] || "",
      noteUrl: nodeIdToPath(nodeId),
      reason,
    });
  };

  const pushMenuStep = (step, reason) => {
    const nodeId = pathKeyToNodeId(step?.key || "");
    if (!nodeId || inPath.has(nodeId) || seen.has(nodeId)) return;
    seen.add(nodeId);
    suggestions.push({
      nodeId,
      title: step.title || step.key,
      subject: nodeId.split(".")[0] || "",
      noteUrl: normalizePathKey(step.key),
      reason,
    });
  };

  if (anchorId) {
    (canonicalGraph?.edges || []).forEach((edge) => {
      const source = String(edge?.source || "");
      const target = String(edge?.target || "");
      if (source === anchorId) pushNode(target, "related");
      if (target === anchorId) pushNode(source, "related");
    });

    const defaultIds = Array.isArray(canonicalGraph?.default_path?.node_ids)
      ? canonicalGraph.default_path.node_ids
      : [];
    const anchorIndex = defaultIds.indexOf(anchorId);
    if (anchorIndex >= 0) {
      for (let offset = -2; offset <= 2; offset += 1) {
        if (offset === 0) continue;
        pushNode(defaultIds[anchorIndex + offset], "path");
      }
    }

    const anchorSubject = anchorId.split(".")[0] || "";
    const subjectSteps = (menuSteps || []).filter((step) => {
      const nodeId = pathKeyToNodeId(step?.key || "");
      return nodeId && nodeId.startsWith(`${anchorSubject}.`);
    });
    const menuIndex = subjectSteps.findIndex(
      (step) => normalizePathKey(step.key) === normalizePathKey(anchorNoteUrl),
    );
    if (menuIndex >= 0) {
      for (let offset = -2; offset <= 2; offset += 1) {
        if (offset === 0) continue;
        const neighbor = subjectSteps[menuIndex + offset];
        if (neighbor) pushMenuStep(neighbor, "subject");
      }
    }
  }

  return suggestions.slice(0, limit);
}
