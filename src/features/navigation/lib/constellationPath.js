import dagre from "dagre";

import { buildPersonalizedPilotDraft } from "./pilotPath";

const NODE_WIDTH = 176;
const NODE_HEIGHT = 54;
const PRIOR_PATH_LENGTH = 120;
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
  "pilot:hr-screening-call",
  "pilot:interview-hr",
  "pilot:interview-technical",
  "pilot:interview-group",
  "pilot:interview-panel",
  "pilot:interview-assessment-centre",
  "pilot:interview-stress",
  "pilot:interview-final",
  "pilot:interview-special-situations",
];

const SKILL_CHILD_IDS = [
  "pilot:technical-skills",
  "pilot:finance-skills",
];

const CERTIFICATE_CHILD_IDS = [
  "pilot:certificate-cfa",
  "pilot:certificate-frm",
  "pilot:certificate-hkicpa",
];

const PROFILE_CHILD_IDS = [
  "pilot:resume",
  "pilot:linkedin",
  "pilot:cover-letter",
  "pilot:portfolio",
  "pilot:personal-site",
];

const EARLY_EXPERIENCE_IDS = [
  "pilot:first-internship",
  "pilot:transition-first-internship",
];

const SEARCH_ROUTE_GROUPS = [
  ["pilot:networking", "pilot:referral"],
  ["pilot:job-board"],
  ["pilot:company-career-page"],
  ["pilot:ai-job-search"],
  ["pilot:campus-recruiting", "pilot:career-fair", "pilot:alumni-networking"],
];

const APPLICATION_ROUTE_GROUPS = [
  ["pilot:application-batch-planning", "pilot:application-tracker", "pilot:resume-version-management"],
  ["pilot:company-research", "pilot:jd-deep-dive", "pilot:tailored-materials"],
];

const DIRECTORY_PARENT_IDS = new Set([
  "pilot:profile-preparation",
  "pilot:getting-started",
  "pilot:market",
  "pilot:job-search",
  "pilot:applications",
  "pilot:skill-supplement",
  "pilot:finance-skills",
  "pilot:interviews",
]);

const OPTIONAL_FIELD_BY_VALUE = {
  linkedin: "profile_branches",
  cover_letter: "profile_branches",
  portfolio: "profile_branches",
  personal_site: "profile_branches",
  networking: "search_branches",
  job_board: "search_branches",
  company_career_page: "search_branches",
  ai_job_search: "search_branches",
  technical: "skill_branches",
  cfa: "certificate_branches",
  frm: "certificate_branches",
  hkicpa: "certificate_branches",
};

export function buildConstellationElements(draft, options = {}) {
  const compact = Boolean(options.compact);
  const horizontal = options.direction === "horizontal";
  const measureTitle = (title) => Array.from(String(title || "")).reduce(
    (width, character) => width + (character.codePointAt(0) > 0xff ? 13 : 7.2),
    0,
  );
  const getDimensions = (node) => {
    const isBranch = node.metadata?.path_relation === "branch";
    const minimum = compact ? (isBranch ? 142 : 162) : (isBranch ? 156 : NODE_WIDTH);
    const maximum = compact ? 258 : 292;
    const contentWidth = measureTitle(node.title) + 58;
    const width = Math.round(Math.max(minimum, Math.min(maximum, contentWidth)));
    const lineCapacity = Math.max(1, width - 54);
    const lines = Math.max(1, Math.ceil(measureTitle(node.title) / lineCapacity));
    const height = Math.max(compact ? 46 : NODE_HEIGHT, 22 + lines * 18);
    return { width, height };
  };
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: horizontal ? "LR" : "TB", ranksep: compact ? 58 : 82, nodesep: compact ? 14 : 34, edgesep: 12, marginx: 28, marginy: 30 });

  const draftNodes = Array.isArray(draft?.nodes) ? draft.nodes : [];
  const draftEdges = Array.isArray(draft?.edges) ? draft.edges : [];
  const currentStage = draft?.metadata?.personalization?.stage || "getting_started";
  const hasPriorPath = horizontal && currentStage !== "getting_started";
  const firstVisibleMainId = PILOT_MAIN_ROUTE.find((id) => draftNodes.some((node) => node.node_id === id));
  const dimensions = new Map(draftNodes.map((node) => [node.node_id, getDimensions(node)]));
  draftNodes.forEach((node) => graph.setNode(node.node_id, dimensions.get(node.node_id)));
  draftEdges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  dagre.layout(graph);

  const positions = new Map();
  if (horizontal && draftNodes.some((node) => node.metadata?.pilot_official_path)) {
    const mainIds = PILOT_MAIN_ROUTE.filter((id) => draftNodes.some((node) => node.node_id === id));
    const startX = hasPriorPath ? 164 : 44;
    const mainY = 168;
    let cursorX = startX;
    mainIds.forEach((id) => {
      positions.set(id, { x: cursorX, y: mainY });
      const { width } = dimensions.get(id);
      const branchCount = draftEdges.filter((edge) => edge.source === id && edge.relation === "branches_to").length;
      const hasSkillBranch = id === "pilot:market"
        && draftNodes.some((node) => node.node_id === "pilot:skill-supplement");
      const hasEarlyExperience = id === "pilot:getting-started"
        && EARLY_EXPERIENCE_IDS.some((nodeId) => draftNodes.some((node) => node.node_id === nodeId));
      const routeDepth = id === "pilot:job-search"
        ? Math.max(0, ...SEARCH_ROUTE_GROUPS.map((route) => route.filter((nodeId) => draftNodes.some((node) => node.node_id === nodeId)).length))
        : id === "pilot:applications"
          ? Math.max(0, ...APPLICATION_ROUTE_GROUPS.map((route) => route.filter((nodeId) => draftNodes.some((node) => node.node_id === nodeId)).length))
          : 0;
      const routeSpace = routeDepth > 0 ? routeDepth * 190 + 70 : 0;
      cursorX += width + Math.max(routeSpace, hasEarlyExperience ? 420 : hasSkillBranch ? 350 : branchCount === 0 ? 64 : Math.min(240, 92 + branchCount * 24));
    });

    const placeDirectoryChildren = (ids, parentId, { xOffset = 44, startY = 88, gap = 16 } = {}) => {
      const parent = positions.get(parentId);
      if (!parent) return;
      let childY = parent.y + startY;
      ids.filter((id) => draftNodes.some((node) => node.node_id === id))
        .forEach((id) => {
          positions.set(id, { x: parent.x + xOffset, y: childY });
          childY += dimensions.get(id).height + gap;
        });
    };
    const placeRouteRows = (groups, parentId, { xOffset = 44, startY = 92, rowGap = 18, columnGap = 34 } = {}) => {
      const parent = positions.get(parentId);
      if (!parent) return;
      let rowY = parent.y + startY;
      groups.forEach((group) => {
        const visible = group.filter((id) => draftNodes.some((node) => node.node_id === id));
        if (visible.length === 0) return;
        let childX = parent.x + xOffset;
        let rowHeight = 0;
        visible.forEach((id) => {
          positions.set(id, { x: childX, y: rowY });
          const childDimensions = dimensions.get(id);
          childX += childDimensions.width + columnGap;
          rowHeight = Math.max(rowHeight, childDimensions.height);
        });
        rowY += rowHeight + rowGap;
      });
    };
    const gettingStartedPosition = positions.get("pilot:getting-started");
    const marketPositionForExperience = positions.get("pilot:market");
    if (gettingStartedPosition && marketPositionForExperience) {
      const startDimensions = dimensions.get("pilot:getting-started");
      const experienceMidpointX = (gettingStartedPosition.x + startDimensions.width + marketPositionForExperience.x) / 2;
      let experienceY = mainY + 92;
      EARLY_EXPERIENCE_IDS.filter((id) => draftNodes.some((node) => node.node_id === id)).forEach((id) => {
        const childDimensions = dimensions.get(id);
        positions.set(id, { x: experienceMidpointX - childDimensions.width / 2, y: experienceY });
        experienceY += childDimensions.height + 16;
      });
    }
    placeDirectoryChildren(PROFILE_CHILD_IDS, "pilot:profile-preparation");
    placeRouteRows(SEARCH_ROUTE_GROUPS, "pilot:job-search");
    placeRouteRows(APPLICATION_ROUTE_GROUPS, "pilot:applications");
    placeDirectoryChildren(INTERVIEW_CHILD_IDS, "pilot:interviews", { xOffset: 54, startY: 88, gap: 16 });

    const skillNode = draftNodes.find((node) => node.node_id === "pilot:skill-supplement");
    const marketPosition = positions.get("pilot:market");
    const profilePosition = positions.get("pilot:profile-preparation");
    if (skillNode && marketPosition && profilePosition) {
      const marketDimensions = dimensions.get("pilot:market");
      const skillDimensions = dimensions.get("pilot:skill-supplement");
      const branchMidpointX = (marketPosition.x + marketDimensions.width + profilePosition.x) / 2;
      positions.set("pilot:skill-supplement", {
        x: branchMidpointX - skillDimensions.width / 2,
        y: mainY + 92,
      });
      placeDirectoryChildren(SKILL_CHILD_IDS, "pilot:skill-supplement");
      placeDirectoryChildren(CERTIFICATE_CHILD_IDS, "pilot:finance-skills", { xOffset: 44, startY: 78, gap: 16 });
    } else if (skillNode) {
      const skillAnchor = marketPosition || profilePosition;
      if (skillAnchor) {
        const skillDimensions = dimensions.get("pilot:skill-supplement");
        const branchMidpointX = profilePosition
          ? profilePosition.x - PRIOR_PATH_LENGTH / 2
          : skillAnchor.x + dimensions.get(firstVisibleMainId).width / 2;
        positions.set("pilot:skill-supplement", {
          x: branchMidpointX - skillDimensions.width / 2,
          y: mainY + 92,
        });
        placeDirectoryChildren(SKILL_CHILD_IDS, "pilot:skill-supplement");
        placeDirectoryChildren(CERTIFICATE_CHILD_IDS, "pilot:finance-skills", { xOffset: 44, startY: 78, gap: 16 });
      }
    }
  }

  const visualBackboneEdges = horizontal
    ? PILOT_MAIN_ROUTE.slice(0, -1).flatMap((source, index) => {
      const target = PILOT_MAIN_ROUTE[index + 1];
      if (!draftNodes.some((node) => node.node_id === source) || !draftNodes.some((node) => node.node_id === target)) return [];
      if (draftEdges.some((edge) => edge.source === source && edge.target === target)) return [];
      return [{ edge_id: `visual-backbone:${source}:${target}`, source, target, relation: "visual_backbone" }];
    })
    : [];

  const hierarchyLevels = new Map(
    draftNodes
      .filter((node) => PILOT_MAIN_ROUTE.includes(node.node_id) || node.node_id === "pilot:skill-supplement")
      .map((node) => [node.node_id, 0]),
  );
  for (let pass = 0; pass < draftNodes.length; pass += 1) {
    draftEdges.forEach((edge) => {
      if (edge.relation !== "branches_to" || !hierarchyLevels.has(edge.source)) return;
      const nextLevel = edge.target === "pilot:skill-supplement"
        ? 0
        : Math.min(2, hierarchyLevels.get(edge.source) + 1);
      if (!hierarchyLevels.has(edge.target) || hierarchyLevels.get(edge.target) > nextLevel) {
        hierarchyLevels.set(edge.target, nextLevel);
      }
    });
  }

  return {
    nodes: draftNodes.map((node) => {
      const nodeDimensions = dimensions.get(node.node_id);
      const customPoint = positions.get(node.node_id);
      const point = customPoint
        ? { x: customPoint.x + nodeDimensions.width / 2, y: customPoint.y + nodeDimensions.height / 2 }
        : graph.node(node.node_id) || { x: 0, y: 0 };
      return {
        id: node.node_id,
        type: "constellation",
        position: { x: point.x - nodeDimensions.width / 2, y: point.y - nodeDimensions.height / 2 },
        style: { width: nodeDimensions.width, minHeight: nodeDimensions.height },
        data: {
          ...node,
          compact,
          hasPriorPath: hasPriorPath && node.node_id === firstVisibleMainId,
          hierarchyLevel: hierarchyLevels.get(node.node_id) ?? (node.metadata?.path_relation === "branch" ? 1 : 0),
          nodeWidth: nodeDimensions.width,
          nodeHeight: nodeDimensions.height,
        },
        draggable: false,
        connectable: false,
        selectable: false,
        focusable: false,
      };
    }),
    edges: [...visualBackboneEdges, ...draftEdges].map((edge) => {
      const sourcePosition = positions.get(edge.source);
      const sourceDimensions = dimensions.get(edge.source);
      const relation = edge.relation || "precedes";
      const isDirectoryBranch = relation === "branches_to" && DIRECTORY_PARENT_IDS.has(edge.source);
      const isSkillMidpointBranch = edge.target === "pilot:skill-supplement"
        && (edge.source === "pilot:market" || (edge.source === firstVisibleMainId && hasPriorPath));
      const isExperienceMidpointBranch = EARLY_EXPERIENCE_IDS.includes(edge.target)
        && edge.source === "pilot:getting-started";
      const isInterviewReturn = INTERVIEW_CHILD_IDS.includes(edge.source) && edge.target === "pilot:interview-review";
      const marketPosition = positions.get("pilot:market");
      const profilePosition = positions.get("pilot:profile-preparation");
      const marketDimensions = dimensions.get("pilot:market");
      return {
        id: edge.edge_id,
        source: edge.source,
        target: edge.target,
        sourceHandle: relation === "branches_to" ? "branch-source" : "main-source",
        targetHandle: isDirectoryBranch ? "tree-target" : relation === "branches_to" ? "branch-target" : "main-target",
        type: "fixedRoute",
        animated: false,
        selectable: false,
        hidden: isInterviewReturn,
        data: {
          relation,
          routeStyle: isSkillMidpointBranch || isExperienceMidpointBranch ? "midpoint-drop" : isDirectoryBranch ? "directory" : undefined,
          customSourceX: isExperienceMidpointBranch
            ? positions.get(edge.target)?.x + dimensions.get(edge.target).width / 2
            : isSkillMidpointBranch
            ? marketPosition && profilePosition
              ? (marketPosition.x + marketDimensions.width + profilePosition.x) / 2
              : sourcePosition?.x - PRIOR_PATH_LENGTH / 2
            : undefined,
          customSourceY: isExperienceMidpointBranch
            ? sourcePosition?.y + sourceDimensions.height / 2
            : isSkillMidpointBranch
            ? sourcePosition?.y + sourceDimensions.height / 2
            : undefined,
          busY: relation === "branches_to" && sourcePosition
            ? sourcePosition.y + sourceDimensions.height + 34
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
