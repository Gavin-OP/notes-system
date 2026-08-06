import { describe, expect, it } from "vitest";

import { buildPersonalizedPilotDraft } from "./pilotPath";
import { buildConstellationElements, updateOptionalPathContent } from "./constellationPath";

const profile = {
  stage: "getting_started",
  profile_branches: ["linkedin", "cover_letter", "portfolio", "personal_site"],
  search_branches: ["networking"],
  skill_branches: ["technical"],
  certificate_branches: ["cfa", "frm", "hkicpa"],
  setup_complete: true,
};

describe("fall recruiting constellation", () => {
  it("builds a stable non-interactive graph without cross-linking LeetCode to certificates", () => {
    const draft = buildPersonalizedPilotDraft({}, profile, new Date("2026-08-05T00:00:00Z"));
    const first = buildConstellationElements(draft);
    const second = buildConstellationElements(draft);
    expect(first).toEqual(second);
    expect(first.nodes.every((node) => node.draggable === false && node.connectable === false)).toBe(true);
    expect(first.edges.some((edge) => edge.source === "pilot:technical-skills" && edge.target.includes("certificate"))).toBe(false);
  });

  it("adds optional content through profile choices and lets the model rebuild the DAG", () => {
    const draft = buildPersonalizedPilotDraft({}, { ...profile, profile_branches: [] });
    const next = updateOptionalPathContent(draft, "linkedin", true);
    expect(next.metadata.personalization.profile_branches).toContain("linkedin");
    expect(next.nodes.some((node) => node.node_id === "pilot:linkedin")).toBe(true);
  });
});
