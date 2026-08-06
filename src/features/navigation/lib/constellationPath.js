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

const INTERVIEW_CHILD_IDS = [
  "pilot:interview-hr",
  "pilot:interview-technical",
  "pilot:interview-group",
  "pilot:interview-panel",
  "pilot:interview-assessment-centre",
  "pilot:interview-stress",
  "pilot:interview-final",
  "pilot:interview-special-situations",
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
    const mainY = 168;
    let cursorX = startX;
    mainIds.forEach((id) => {
      positions.set(id, { x: cursorX, y: mainY });
      const branchCount = draftEdges.filter((edge) => edge.source === id && edge.relation === "branches_to").length;
      cursorX += branchCount === 0 ? 205 : Math.min(500, 170 + branchCount * 80);
    });

    const placeChildren = (ids, parentId, slots) => {
      const parent = positions.get(parentId);
      if (!parent) return;
      ids.filter((id) => draftNodes.some((node) => node.node_id === id))
        .forEach((id, index) => {
          const slot = slots[index] || slots[slots.length - 1];
          positions.set(id, { x: parent.x + slot.x, y: parent.y + slot.y });
        });
    };
    placeChildren(
      ["pilot:resume", "pilot:linkedin", "pilot:cover-letter", "pilot:portfolio", "pilot:personal-site"],
      "pilot:profile-preparation",
      [
        { x: -170, y: 104 },
        { x: 0, y: 104 },
        { x: 170, y: 104 },
        { x: -85, y: 178 },
        { x: 85, y: 178 },
      ],
    );
    placeChildren(
      ["pilot:networking", "pilot:ai-job-search"],
      "pilot:job-search",
      [{ x: -85, y: 104 }, { x: 85, y: 104 }],
    );
    placeChildren(
      INTERVIEW_CHILD_IDS,
      "pilot:interviews",
      INTERVIEW_CHILD_IDS.map((_, index) => ({ x: 190, y: 104 + index * 68 })),
    );
    placeChildren(
      ["pilot:technical-skills", "pilot:finance-skills"],
      "pilot:interview-review",
      [{ x: -85, y: 104 }, { x: 85, y: 104 }],
    );
    placeChildren(
      ["pilot:certificate-cfa", "pilot:certificate-frm", "pilot:certificate-hkicpa"],
      "pilot:finance-skills",
      [{ x: -170, y: 94 }, { x: 0, y: 94 }, { x: 170, y: 94 }],
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
      const isInterviewBranch = edge.source === "pilot:interviews" && INTERVIEW_CHILD_IDS.includes(edge.target);
      const isInterviewReturn = INTERVIEW_CHILD_IDS.includes(edge.source) && edge.target === "pilot:interview-review";
      return {
        id: edge.edge_id,
        source: edge.source,
        target: edge.target,
        sourceHandle: relation === "branches_to" ? "branch-source" : "main-source",
        targetHandle: isInterviewBranch ? "tree-target" : relation === "branches_to" ? "branch-target" : "main-target",
        type: "fixedRoute",
        animated: false,
        selectable: false,
        hidden: isInterviewReturn,
        data: {
          relation,
          routeStyle: isInterviewBranch ? "directory" : undefined,
          busY: relation === "branches_to" && sourcePosition
            ? sourcePosition.y + nodeHeight + 34
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
