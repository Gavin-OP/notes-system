import { describe, expect, it } from "vitest";

import { buildPersonalizedPilotDraft } from "./pilotPath";
import { buildConstellationElements, updateOptionalPathContent } from "./constellationPath";

const profile = {
  stage: "getting_started",
  profile_branches: ["linkedin", "cover_letter", "portfolio", "personal_site"],
  search_branches: ["networking"],
  skill_branches: ["technical"],
  certificate_branches: ["cfa", "frm", "hkicpa"],
  certificate_interest: true,
  interview_branches: ["hr", "technical", "group", "panel"],
  setup_complete: true,
};

describe("fall recruiting constellation", () => {
  it("cuts completed preparation stages from the path when the learner advances", () => {
    const materialsDraft = buildPersonalizedPilotDraft({}, { ...profile, stage: "materials" });
    expect(materialsDraft.nodes.some((node) => node.node_id === "pilot:getting-started")).toBe(false);
    expect(materialsDraft.nodes.some((node) => node.node_id === "pilot:profile-preparation")).toBe(true);

    const applyingDraft = buildPersonalizedPilotDraft({}, { ...profile, stage: "applying" });
    expect(applyingDraft.nodes.some((node) => node.node_id === "pilot:profile-preparation")).toBe(false);
    expect(applyingDraft.nodes.some((node) => node.node_id === "pilot:applications")).toBe(true);
  });

  it("places every optional child below the parent it grows from", () => {
    const draft = buildPersonalizedPilotDraft({}, profile);
    const { nodes } = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    const positionById = new Map(nodes.map((node) => [node.id, node.position]));
    const parentByChild = new Map([
      ["pilot:resume", "pilot:profile-preparation"],
      ["pilot:linkedin", "pilot:profile-preparation"],
      ["pilot:cover-letter", "pilot:profile-preparation"],
      ["pilot:portfolio", "pilot:profile-preparation"],
      ["pilot:personal-site", "pilot:profile-preparation"],
      ["pilot:networking", "pilot:job-search"],
      ["pilot:skill-supplement", "pilot:market"],
      ["pilot:technical-skills", "pilot:skill-supplement"],
      ["pilot:finance-skills", "pilot:skill-supplement"],
      ["pilot:certificate-cfa", "pilot:finance-skills"],
    ]);

    parentByChild.forEach((parentId, childId) => {
      expect(positionById.get(childId).y, `${childId} should be below ${parentId}`)
        .toBeGreaterThan(positionById.get(parentId).y);
    });

    const profileChildren = ["pilot:resume", "pilot:linkedin", "pilot:cover-letter", "pilot:portfolio", "pilot:personal-site"]
      .map((id) => positionById.get(id));
    expect(new Set(profileChildren.map((position) => position.x)).size).toBe(1);
    expect(profileChildren.map((position) => position.y)).toEqual(
      [...profileChildren.map((position) => position.y)].sort((a, b) => a - b),
    );
  });

  it("builds a stable non-interactive graph without cross-linking LeetCode to certificates", () => {
    const draft = buildPersonalizedPilotDraft({}, profile, new Date("2026-08-05T00:00:00Z"));
    const first = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    const second = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    expect(first).toEqual(second);
    expect(first.nodes.every((node) => node.draggable === false && node.connectable === false)).toBe(true);
    expect(first.edges.some((edge) => edge.source === "pilot:technical-skills" && edge.target.includes("certificate"))).toBe(false);
    expect(first.edges).toContainEqual(expect.objectContaining({
      source: "pilot:market",
      target: "pilot:skill-supplement",
      data: expect.objectContaining({ routeStyle: "midpoint-drop" }),
    }));
    expect(first.edges).toContainEqual(expect.objectContaining({
      source: "pilot:skill-supplement",
      target: "pilot:technical-skills",
    }));
    expect(first.edges.some((edge) => edge.source === "pilot:interview-review" && ["pilot:technical-skills", "pilot:finance-skills"].includes(edge.target))).toBe(false);
    const market = first.nodes.find((node) => node.id === "pilot:market");
    const profilePreparation = first.nodes.find((node) => node.id === "pilot:profile-preparation");
    const skillSupplement = first.nodes.find((node) => node.id === "pilot:skill-supplement");
    const skillBranch = first.edges.find((edge) => edge.source === "pilot:market" && edge.target === "pilot:skill-supplement");
    const expectedMidpoint = (market.position.x + market.style.width + profilePreparation.position.x) / 2;
    expect(skillBranch.data.customSourceX).toBe(expectedMidpoint);
    expect(skillBranch.data.routeStyle).toBe("midpoint-drop");
    expect(skillSupplement.position.x + skillSupplement.style.width / 2).toBe(expectedMidpoint);
  });

  it("sizes cards to their complete labels instead of forcing one width", () => {
    const draft = buildPersonalizedPilotDraft({}, profile);
    const { nodes } = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    const shortNode = nodes.find((node) => node.id === "pilot:resume");
    const longNode = nodes.find((node) => node.id === "pilot:interview-technical");
    expect(longNode.style.width).toBeGreaterThan(shortNode.style.width);
    expect(longNode.data.nodeWidth).toBe(longNode.style.width);
  });

  it("assigns one orb color level to each directory depth", () => {
    const draft = buildPersonalizedPilotDraft({}, profile);
    const { nodes } = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    const levelById = new Map(nodes.map((node) => [node.id, node.data.hierarchyLevel]));

    expect(levelById.get("pilot:market")).toBe(0);
    expect(levelById.get("pilot:skill-supplement")).toBe(0);
    expect(levelById.get("pilot:resume")).toBe(1);
    expect(levelById.get("pilot:technical-skills")).toBe(1);
    expect(levelById.get("pilot:finance-skills")).toBe(1);
    expect(levelById.get("pilot:certificate-cfa")).toBe(2);
    expect(levelById.get("pilot:certificate-frm")).toBe(2);
    expect(levelById.get("pilot:certificate-hkicpa")).toBe(2);
  });

  it("keeps a prior-route lead-in and branches skills from its midpoint after the first stage", () => {
    const draft = buildPersonalizedPilotDraft({}, { ...profile, stage: "materials" });
    const { nodes, edges } = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    const profilePreparation = nodes.find((node) => node.id === "pilot:profile-preparation");
    const skillSupplement = nodes.find((node) => node.id === "pilot:skill-supplement");
    const skillBranch = edges.find((edge) => edge.target === "pilot:skill-supplement");
    const leadInMidpoint = profilePreparation.position.x - 60;

    expect(nodes.some((node) => node.id === "pilot:market")).toBe(false);
    expect(profilePreparation.data.hasPriorPath).toBe(true);
    expect(skillBranch.data.routeStyle).toBe("midpoint-drop");
    expect(skillBranch.data.customSourceX).toBe(leadInMidpoint);
    expect(skillSupplement.position.x + skillSupplement.style.width / 2).toBe(leadInMidpoint);
  });

  it("keeps comprehensive preparation and branches selected interview formats from it", () => {
    const draft = buildPersonalizedPilotDraft({}, profile);
    expect(draft.nodes.find((node) => node.node_id === "pilot:interviews")?.title).toBe("综合面试准备");
    expect(draft.nodes.some((node) => node.node_id === "pilot:interview-hr")).toBe(true);
    expect(draft.edges).toContainEqual(expect.objectContaining({
      source: "pilot:interviews",
      target: "pilot:interview-hr",
      relation: "branches_to",
    }));
    expect(draft.edges).toContainEqual(expect.objectContaining({
      source: "pilot:interview-hr",
      target: "pilot:interview-review",
      relation: "converges_to",
    }));

    const elements = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    const parent = elements.nodes.find((node) => node.id === "pilot:interviews");
    const children = ["pilot:interview-hr", "pilot:interview-technical", "pilot:interview-group", "pilot:interview-panel"]
      .map((id) => elements.nodes.find((node) => node.id === id));
    expect(children.every((node) => node.position.x > parent.position.x)).toBe(true);
    expect(new Set(children.map((node) => node.position.x)).size).toBe(1);
    expect(children.map((node) => node.position.y)).toEqual([...children.map((node) => node.position.y)].sort((a, b) => a - b));
    expect(elements.edges.filter((edge) => edge.source.startsWith("pilot:interview-") && edge.target === "pilot:interview-review").every((edge) => edge.hidden)).toBe(true);
  });

  it("adds optional content through profile choices and lets the model rebuild the DAG", () => {
    const draft = buildPersonalizedPilotDraft({}, { ...profile, profile_branches: [] });
    const next = updateOptionalPathContent(draft, "linkedin", true);
    expect(next.metadata.personalization.profile_branches).toContain("linkedin");
    expect(next.nodes.some((node) => node.node_id === "pilot:linkedin")).toBe(true);
  });
});
