import dagre from "dagre";

import { buildPersonalizedPilotDraft } from "./pilotPath";

const NODE_WIDTH = 176;
const NODE_HEIGHT = 54;
const PILOT_MAIN_ROUTE = [
  "pilot:getting-started",
  "pilot:market",
  "pilot:profile-preparation",
  "pilot:job-search",
  "pilot:applications",
  "pilot:assessments",
  "pilot:interviews",
  "pilot:interview-review",
  "pilot:offer",
];

const OPTIONAL_FIELD_BY_VALUE = {
  linkedin: "profile_branches",
  cover_letter: "profile_branches",
  portfolio: "profile_branches",
  personal_site: "profile_branches",
  networking: "search_branches",
  ai_job_search: "search_branches",
  technical: "skill_branches",
  cfa: "certificate_branches",
  frm: "certificate_branches",
  hkicpa: "certificate_branches",
};

export function buildConstellationElements(draft, options = {}) {
  const compact = Boolean(options.compact);
  const horizontal = options.direction === "horizontal";
  const nodeWidth = compact ? 168 : NODE_WIDTH;
  const nodeHeight = compact ? 46 : NODE_HEIGHT;
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: horizontal ? "LR" : "TB", ranksep: compact ? 58 : 82, nodesep: compact ? 14 : 34, edgesep: 12, marginx: 28, marginy: 30 });

  const draftNodes = Array.isArray(draft?.nodes) ? draft.nodes : [];
  const draftEdges = Array.isArray(draft?.edges) ? draft.edges : [];
  draftNodes.forEach((node) => graph.setNode(node.node_id, { width: nodeWidth, height: nodeHeight }));
  draftEdges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  dagre.layout(graph);

  const positions = new Map();
  if (horizontal && draftNodes.some((node) => node.metadata?.pilot_official_path)) {
    const mainIds = PILOT_MAIN_ROUTE.filter((id) => draftNodes.some((node) => node.node_id === id));
    const startX = 44;
    const mainY = 290;
    let cursorX = startX;
    mainIds.forEach((id) => {
      positions.set(id, { x: cursorX, y: mainY });
      const hasBranches = draftEdges.some((edge) => edge.source === id && edge.relation === "branches_to");
      cursorX += hasBranches ? 340 : 205;
    });

    const midpoint = (sourceId, targetId) => {
      const source = positions.get(sourceId);
      const target = positions.get(targetId);
      return {
        x: source ? source.x + 200 : startX,
        y: source && target ? (source.y + target.y) / 2 : mainY,
      };
    };

    const placeStack = (ids, anchor, offsets) => ids.filter((id) => draftNodes.some((node) => node.node_id === id))
      .forEach((id, index) => positions.set(id, { x: anchor.x, y: anchor.y + offsets[index] }));
    placeStack(
      ["pilot:resume", "pilot:linkedin", "pilot:cover-letter", "pilot:portfolio", "pilot:personal-site"],
      midpoint("pilot:profile-preparation", "pilot:job-search"),
      [-224, -152, -80, 82, 154],
    );
    placeStack(
      ["pilot:networking", "pilot:ai-job-search"],
      midpoint("pilot:job-search", "pilot:applications"),
      [108, 186],
    );
    placeStack(
      ["pilot:technical-skills", "pilot:finance-skills"],
      midpoint("pilot:interview-review", "pilot:offer"),
      [108, 186],
    );
    const financeAnchor = positions.get("pilot:finance-skills") || midpoint("pilot:interview-review", "pilot:offer");
    placeStack(
      ["pilot:certificate-cfa", "pilot:certificate-frm", "pilot:certificate-hkicpa"],
      { x: financeAnchor.x + 190, y: financeAnchor.y },
      [-44, 34, 112],
    );
  }

  const visualBackboneEdges = horizontal
    ? PILOT_MAIN_ROUTE.slice(0, -1).flatMap((source, index) => {
      const target = PILOT_MAIN_ROUTE[index + 1];
      if (!draftNodes.some((node) => node.node_id === source) || !draftNodes.some((node) => node.node_id === target)) return [];
      if (draftEdges.some((edge) => edge.source === source && edge.target === target)) return [];
      return [{ edge_id: `visual-backbone:${source}:${target}`, source, target, relation: "visual_backbone" }];
    })
    : [];

  return {
    nodes: draftNodes.map((node) => {
      const customPoint = positions.get(node.node_id);
      const point = customPoint
        ? { x: customPoint.x + nodeWidth / 2, y: customPoint.y + nodeHeight / 2 }
        : graph.node(node.node_id) || { x: 0, y: 0 };
      return {
        id: node.node_id,
        type: "constellation",
        position: { x: point.x - nodeWidth / 2, y: point.y - nodeHeight / 2 },
        data: { ...node, compact },
        draggable: false,
        connectable: false,
        selectable: false,
        focusable: false,
      };
    }),
    edges: [...visualBackboneEdges, ...draftEdges].map((edge) => {
      const sourcePosition = positions.get(edge.source);
      const relation = edge.relation || "precedes";
      return {
        id: edge.edge_id,
        source: edge.source,
        target: edge.target,
        type: "fixedRoute",
        animated: false,
        selectable: false,
        data: {
          relation,
          busX: relation === "branches_to" && sourcePosition
            ? sourcePosition.x + nodeWidth + 42
            : undefined,
        },
      };
    }),
  };
}

export function updateOptionalPathContent(draft, value, enabled, now = new Date()) {
  const field = OPTIONAL_FIELD_BY_VALUE[value];
  if (!field) return draft;
  const profile = { ...(draft?.metadata?.personalization || {}) };
  const values = new Set(Array.isArray(profile[field]) ? profile[field] : []);
  if (enabled) values.add(value);
  else values.delete(value);
  profile[field] = [...values];
  profile.setup_complete = true;
  return buildPersonalizedPilotDraft(draft, profile, now);
}
