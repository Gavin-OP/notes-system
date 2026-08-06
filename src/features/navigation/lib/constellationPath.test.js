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
      ["pilot:technical-skills", "pilot:interview-review"],
      ["pilot:finance-skills", "pilot:interview-review"],
      ["pilot:certificate-cfa", "pilot:finance-skills"],
    ]);

    parentByChild.forEach((parentId, childId) => {
      expect(positionById.get(childId).y, `${childId} should be below ${parentId}`)
        .toBeGreaterThan(positionById.get(parentId).y);
    });
  });

  it("builds a stable non-interactive graph without cross-linking LeetCode to certificates", () => {
    const draft = buildPersonalizedPilotDraft({}, profile, new Date("2026-08-05T00:00:00Z"));
    const first = buildConstellationElements(draft);
    const second = buildConstellationElements(draft);
    expect(first).toEqual(second);
    expect(first.nodes.every((node) => node.draggable === false && node.connectable === false)).toBe(true);
    expect(first.edges.some((edge) => edge.source === "pilot:technical-skills" && edge.target.includes("certificate"))).toBe(false);
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
