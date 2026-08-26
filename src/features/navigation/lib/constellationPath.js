import dagre from "dagre";

import { buildPersonalizedPilotDraft } from "./pilotPath";

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

const EXPERIENCE_BUILDING_CHILD_IDS = [
  "pilot:business-competition",
  "pilot:kaggle-competition",
  "pilot:course-project-polish",
];

const PROFILE_ROUTE_GROUPS = [
  ...PROFILE_CHILD_IDS.map((id) => [id]),
  EXPERIENCE_BUILDING_CHILD_IDS,
];

const EARLY_EXPERIENCE_IDS = [
  "pilot:first-internship",
  "pilot:transition-first-internship",
];

const SEARCH_ROUTE_GROUPS = [
  ["pilot:networking", "pilot:referral"],
  ["pilot:job-board", "pilot:company-career-page", "pilot:social-media-research"],
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
  "pilot:interviews",
]);

const ROUTE_FAMILY_DEFINITIONS = [
  { id: "experience-building", parentId: "pilot:profile-preparation", title: "补充可展示的经历", titleKey: "pilot.family.experienceBuilding", tone: 1, nodeIds: EXPERIENCE_BUILDING_CHILD_IDS },
  { id: "search-social", parentId: "pilot:job-search", title: "沟通获取信息", titleKey: "pilot.family.searchSocial", tone: 1, nodeIds: ["pilot:networking", "pilot:referral"] },
  { id: "search-independent", parentId: "pilot:job-search", title: "自主查找信息", titleKey: "pilot.family.searchIndependent", tone: 1, nodeIds: ["pilot:job-board", "pilot:company-career-page", "pilot:social-media-research"] },
  { id: "search-campus", parentId: "pilot:job-search", title: "校园招聘", titleKey: "pilot.family.searchCampus", tone: 1, nodeIds: ["pilot:campus-recruiting", "pilot:career-fair", "pilot:alumni-networking"] },
  { id: "application-batch", parentId: "pilot:applications", title: "批量投递", titleKey: "pilot.family.applicationBatch", tone: 2, nodeIds: ["pilot:application-batch-planning", "pilot:application-tracker", "pilot:resume-version-management"] },
  { id: "application-precision", parentId: "pilot:applications", title: "精准投递", titleKey: "pilot.family.applicationPrecision", tone: 2, nodeIds: ["pilot:company-research", "pilot:jd-deep-dive", "pilot:tailored-materials"] },
];

const OPTIONAL_FIELD_BY_VALUE = {
  linkedin: "profile_branches",
  cover_letter: "profile_branches",
  portfolio: "profile_branches",
  personal_site: "profile_branches",
  networking: "search_branches",
  networking_event: "search_branches",
  job_board: "search_branches",
  company_career_page: "search_branches",
  social_media_research: "search_branches",
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
    const minimum = compact ? (isBranch ? 142 : 162) : (isBranch ? 168 : 196);
    const maximum = compact ? 258 : minimum;
    const contentWidth = measureTitle(node.title) + (isBranch ? 28 : 36);
    const width = Math.round(Math.max(minimum, Math.min(maximum, contentWidth)));
    const lineCapacity = Math.max(1, width - 54);
    const lines = Math.max(1, Math.ceil(measureTitle(node.title) / lineCapacity));
    const height = Math.max(compact ? 46 : (isBranch ? 48 : 92), (isBranch ? 20 : 42) + lines * 19);
    return { width, height };
  };
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: horizontal ? "LR" : "TB", ranksep: compact ? 58 : 96, nodesep: compact ? 14 : 38, edgesep: 14, marginx: 34, marginy: 36 });

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
    const mainY = 154;
    let cursorX = startX;
    mainIds.forEach((id) => {
      positions.set(id, { x: cursorX, y: mainY });
      const { width } = dimensions.get(id);
      const branchCount = draftEdges.filter((edge) => edge.source === id && edge.relation === "branches_to").length;
      const hasSkillBranch = id === "pilot:market"
        && draftNodes.some((node) => node.node_id === "pilot:skill-supplement");
      const hasEarlyExperience = id === "pilot:getting-started"
        && EARLY_EXPERIENCE_IDS.some((nodeId) => draftNodes.some((node) => node.node_id === nodeId));
      const routeIds = id === "pilot:job-search"
        ? SEARCH_ROUTE_GROUPS.flat()
        : id === "pilot:applications" ? APPLICATION_ROUTE_GROUPS.flat() : [];
      const routeWidth = Math.max(0, ...routeIds
        .filter((nodeId) => draftNodes.some((node) => node.node_id === nodeId))
        .map((nodeId) => dimensions.get(nodeId).width));
      const routeSpace = routeWidth > 0 ? routeWidth + 126 : 0;
      cursorX += width + Math.max(routeSpace, hasEarlyExperience ? 440 : hasSkillBranch ? 370 : branchCount === 0 ? 76 : Math.min(260, 108 + branchCount * 26));
    });

    const placeDirectoryChildren = (ids, parentId, { xOffset = 48, startY = 127, gap = 14 } = {}) => {
      const parent = positions.get(parentId);
      if (!parent) return;
      let childY = parent.y + startY;
      ids.filter((id) => draftNodes.some((node) => node.node_id === id))
        .forEach((id) => {
          positions.set(id, { x: parent.x + xOffset, y: childY });
          childY += dimensions.get(id).height + gap;
        });
    };
    const placeRouteFamilies = (groups, parentId, { xOffset = 48, startY = 127, itemGap = 14, unitGap = 34 } = {}) => {
      const parent = positions.get(parentId);
      if (!parent) return;
      const familyX = parent.x + xOffset;
      let unitTop = parent.y + startY;
      groups.forEach((group) => {
        const visible = group.filter((id) => draftNodes.some((node) => node.node_id === id));
        if (visible.length === 0) return;
        const isFamily = visible.length > 1 && ROUTE_FAMILY_DEFINITIONS.some((family) => (
          visible.every((id) => family.nodeIds.includes(id))
        ));
        let childY = unitTop + (isFamily ? 38 : 0);
        visible.forEach((id) => {
          positions.set(id, { x: familyX, y: childY });
          const childDimensions = dimensions.get(id);
          childY += childDimensions.height + itemGap;
        });
        const contentBottom = childY - itemGap;
        unitTop = contentBottom + (isFamily ? 20 : 0) + unitGap;
      });
    };
    const gettingStartedPosition = positions.get("pilot:getting-started");
    const marketPositionForExperience = positions.get("pilot:market");
    if (gettingStartedPosition && marketPositionForExperience) {
      const startDimensions = dimensions.get("pilot:getting-started");
      const experienceMidpointX = (gettingStartedPosition.x + startDimensions.width + marketPositionForExperience.x) / 2;
      let experienceY = mainY + 127;
      EARLY_EXPERIENCE_IDS.filter((id) => draftNodes.some((node) => node.node_id === id)).forEach((id) => {
        const childDimensions = dimensions.get(id);
        positions.set(id, { x: experienceMidpointX + 20, y: experienceY });
        experienceY += childDimensions.height + 16;
      });
    }
    placeRouteFamilies(PROFILE_ROUTE_GROUPS, "pilot:profile-preparation");
    placeRouteFamilies(SEARCH_ROUTE_GROUPS, "pilot:job-search");
    const applicationStrategy = draft?.metadata?.personalization?.resolved_application_strategy;
    const applicationGroups = applicationStrategy === "precision_then_batch"
      ? [...APPLICATION_ROUTE_GROUPS].reverse()
      : APPLICATION_ROUTE_GROUPS;
    placeRouteFamilies(applicationGroups, "pilot:applications");
    placeDirectoryChildren(INTERVIEW_CHILD_IDS, "pilot:interviews", { xOffset: 48, startY: 127, gap: 14 });

    const skillNode = draftNodes.find((node) => node.node_id === "pilot:skill-supplement");
    const marketPosition = positions.get("pilot:market");
    const profilePosition = positions.get("pilot:profile-preparation");
    if (skillNode && marketPosition && profilePosition) {
      const marketDimensions = dimensions.get("pilot:market");
      const skillDimensions = dimensions.get("pilot:skill-supplement");
      const branchMidpointX = (marketPosition.x + marketDimensions.width + profilePosition.x) / 2;
      positions.set("pilot:skill-supplement", {
        x: branchMidpointX - skillDimensions.width / 2,
        y: mainY + 127,
      });
      placeDirectoryChildren(CERTIFICATE_CHILD_IDS, "pilot:skill-supplement", { xOffset: 48, startY: 83, gap: 14 });
    } else if (skillNode) {
      const skillAnchor = marketPosition || profilePosition;
      if (skillAnchor) {
        const skillDimensions = dimensions.get("pilot:skill-supplement");
        const branchMidpointX = profilePosition
          ? profilePosition.x - PRIOR_PATH_LENGTH / 2
          : skillAnchor.x + dimensions.get(firstVisibleMainId).width / 2;
        positions.set("pilot:skill-supplement", {
          x: branchMidpointX - skillDimensions.width / 2,
          y: mainY + 127,
        });
        placeDirectoryChildren(CERTIFICATE_CHILD_IDS, "pilot:skill-supplement", { xOffset: 48, startY: 83, gap: 14 });
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
      .filter((node) => PILOT_MAIN_ROUTE.includes(node.node_id))
      .map((node) => [node.node_id, 0]),
  );
  for (let pass = 0; pass < draftNodes.length; pass += 1) {
    draftEdges.forEach((edge) => {
      if (!hierarchyLevels.has(edge.source) || PILOT_MAIN_ROUTE.includes(edge.target)) return;
      const sourceLevel = hierarchyLevels.get(edge.source);
      if (edge.relation !== "branches_to" && !(sourceLevel > 0 && edge.relation === "precedes")) return;
      const nextLevel = Math.min(3, sourceLevel + 1);
      if (!hierarchyLevels.has(edge.target) || hierarchyLevels.get(edge.target) > nextLevel) {
        hierarchyLevels.set(edge.target, nextLevel);
      }
    });
  }

  const routeGroups = ROUTE_FAMILY_DEFINITIONS.flatMap((family) => {
    const visibleIds = family.nodeIds.filter((id) => positions.has(id));
    if (visibleIds.length < 2) return [];
    const left = Math.min(...visibleIds.map((id) => positions.get(id).x));
    const top = Math.min(...visibleIds.map((id) => positions.get(id).y));
    const right = Math.max(...visibleIds.map((id) => positions.get(id).x + dimensions.get(id).width));
    const bottom = Math.max(...visibleIds.map((id) => positions.get(id).y + dimensions.get(id).height));
    return [{
      id: `route-family:${family.id}`,
      type: "routeGroup",
      position: { x: left - 20, y: top - 38 },
      style: { width: right - left + 40, height: bottom - top + 58, zIndex: 0 },
      data: { title: family.title, titleKey: family.titleKey, tone: family.tone, nodeIds: visibleIds, parentId: family.parentId },
      draggable: false,
      connectable: false,
      selectable: false,
      focusable: false,
    }];
  });
  const routeFamilyByNodeId = new Map();
  const routeGroupByFamilyId = new Map();
  routeGroups.forEach((group) => {
    const familyId = group.id.replace(/^route-family:/, "");
    routeGroupByFamilyId.set(familyId, group);
    group.data.nodeIds.forEach((nodeId) => routeFamilyByNodeId.set(nodeId, familyId));
  });

  const visualEdges = [];
  const visualEdgeKeys = new Set();
  [...visualBackboneEdges, ...draftEdges].forEach((edge) => {
    const relation = edge.relation || "precedes";
    const sourceFamilyId = routeFamilyByNodeId.get(edge.source);
    const targetFamilyId = routeFamilyByNodeId.get(edge.target);
    if (sourceFamilyId && sourceFamilyId === targetFamilyId) return;

    const sourceFamily = sourceFamilyId ? routeGroupByFamilyId.get(sourceFamilyId) : null;
    const targetFamily = targetFamilyId ? routeGroupByFamilyId.get(targetFamilyId) : null;
    const visualSource = sourceFamily?.id || edge.source;
    const visualTarget = targetFamily?.id || edge.target;
    const visualKey = `${visualSource}:${visualTarget}`;
    if (visualEdgeKeys.has(visualKey)) return;
    visualEdgeKeys.add(visualKey);

    const sourcePosition = positions.get(edge.source);
    const sourceDimensions = dimensions.get(edge.source);
    const entersFamily = Boolean(targetFamily && !sourceFamily);
    const exitsFamily = Boolean(sourceFamily && !targetFamily);
    const connectsFamilies = Boolean(sourceFamily && targetFamily);
    const isDirectoryBranch = relation === "branches_to" && DIRECTORY_PARENT_IDS.has(edge.source);
    const isSkillMidpointBranch = edge.target === "pilot:skill-supplement"
      && (edge.source === "pilot:market" || (edge.source === firstVisibleMainId && hasPriorPath));
    const isExperienceMidpointBranch = EARLY_EXPERIENCE_IDS.includes(edge.target)
      && edge.source === "pilot:getting-started";
    const isInterviewReturn = INTERVIEW_CHILD_IDS.includes(edge.source) && edge.target === "pilot:interview-review";
    if (isInterviewReturn) return;

    const marketPosition = positions.get("pilot:market");
    const profilePosition = positions.get("pilot:profile-preparation");
    const marketDimensions = dimensions.get("pilot:market");
    visualEdges.push({
      id: sourceFamily || targetFamily ? `visual-family:${visualSource}:${visualTarget}` : edge.edge_id,
      source: visualSource,
      target: visualTarget,
      sourceHandle: connectsFamilies ? "family-source-bottom" : sourceFamily ? "family-source-right" : entersFamily ? "branch-source" : relation === "branches_to" ? "branch-source" : "main-source",
      targetHandle: connectsFamilies ? "family-target-top" : targetFamily ? "family-target-left" : exitsFamily ? "main-target" : isDirectoryBranch ? "tree-target" : relation === "branches_to" ? "branch-target" : "main-target",
      type: "fixedRoute",
      animated: false,
      selectable: false,
      hidden: false,
      data: {
        relation,
        endpointGap: 10,
        routeStyle: connectsFamilies
          ? "family-stack"
          : entersFamily
            ? "family-directory"
            : exitsFamily
              ? "family-exit"
              : isSkillMidpointBranch
                ? "midpoint-drop"
                : isDirectoryBranch || isExperienceMidpointBranch ? "directory" : undefined,
        customSourceX: isExperienceMidpointBranch
          ? positions.get(edge.target)?.x - 20
          : isSkillMidpointBranch
            ? marketPosition && profilePosition
              ? (marketPosition.x + marketDimensions.width + profilePosition.x) / 2
              : sourcePosition?.x - PRIOR_PATH_LENGTH / 2
            : undefined,
        customSourceY: isExperienceMidpointBranch || isSkillMidpointBranch
          ? sourcePosition?.y + sourceDimensions.height / 2
          : undefined,
        busY: relation === "branches_to" && sourcePosition
          ? sourcePosition.y + sourceDimensions.height + 34
          : undefined,
      },
    });
  });

  return {
    groups: routeGroups,
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
        style: { width: nodeDimensions.width, minHeight: nodeDimensions.height, zIndex: 2 },
        data: {
          ...node,
          compact,
          hasPriorPath: hasPriorPath && node.node_id === firstVisibleMainId,
          hierarchyLevel: hierarchyLevels.get(node.node_id) ?? (node.metadata?.path_relation === "branch" ? 1 : 0),
          visualToneLevel: node.metadata?.route_family
            ? ROUTE_FAMILY_DEFINITIONS.find((family) => family.id === node.metadata.route_family)?.tone
            : undefined,
          mainParentId: node.metadata?.route_family
            ? ROUTE_FAMILY_DEFINITIONS.find((family) => family.id === node.metadata.route_family)?.parentId
            : undefined,
          nodeWidth: nodeDimensions.width,
          nodeHeight: nodeDimensions.height,
        },
        draggable: false,
        connectable: false,
        selectable: false,
        focusable: false,
      };
    }),
    edges: visualEdges,
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
