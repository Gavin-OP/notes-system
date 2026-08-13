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
  it("builds editable search routes from behavior, student status, and explicit social choices", () => {
    const draft = buildPersonalizedPilotDraft({}, {
      ...profile,
      jobti_type: "radar",
      candidate_background: "student",
      search_branches: ["networking"],
      application_strategy: "auto",
    });
    const ids = new Set(draft.nodes.map((node) => node.node_id));

    [
      "pilot:networking",
      "pilot:referral",
      "pilot:job-board",
      "pilot:company-career-page",
      "pilot:ai-job-search",
      "pilot:campus-recruiting",
      "pilot:career-fair",
      "pilot:alumni-networking",
      "pilot:company-research",
      "pilot:jd-deep-dive",
      "pilot:tailored-materials",
    ].forEach((id) => expect(ids.has(id), `${id} should exist`).toBe(true));

    expect(draft.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "pilot:job-search", target: "pilot:networking", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:networking", target: "pilot:referral", relation: "precedes" }),
      expect.objectContaining({ source: "pilot:job-search", target: "pilot:job-board", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:job-search", target: "pilot:company-career-page", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:job-search", target: "pilot:ai-job-search", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:job-board", target: "pilot:applications", relation: "converges_to" }),
      expect.objectContaining({ source: "pilot:company-career-page", target: "pilot:applications", relation: "converges_to" }),
      expect.objectContaining({ source: "pilot:ai-job-search", target: "pilot:applications", relation: "converges_to" }),
      expect.objectContaining({ source: "pilot:job-search", target: "pilot:campus-recruiting", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:campus-recruiting", target: "pilot:career-fair", relation: "precedes" }),
      expect.objectContaining({ source: "pilot:career-fair", target: "pilot:alumni-networking", relation: "precedes" }),
      expect.objectContaining({ source: "pilot:applications", target: "pilot:company-research", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:company-research", target: "pilot:jd-deep-dive", relation: "precedes" }),
      expect.objectContaining({ source: "pilot:jd-deep-dive", target: "pilot:tailored-materials", relation: "precedes" }),
    ]));
    expect(draft.metadata.personalization.resolved_application_strategy).toBe("precision");

    const elements = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    const searchChannels = ["pilot:job-board", "pilot:company-career-page", "pilot:ai-job-search"]
      .map((id) => elements.nodes.find((node) => node.id === id));
    expect(new Set(searchChannels.map((node) => node.position.x)).size).toBe(1);
    expect(searchChannels.map((node) => node.position.y)).toEqual(
      [...searchChannels.map((node) => node.position.y)].sort((a, b) => a - b),
    );
  });

  it("lets non-radar users add individual analytical search channels", () => {
    const draft = buildPersonalizedPilotDraft({}, {
      ...profile,
      jobti_type: "protector",
      search_branches: ["job_board", "company_career_page"],
    });
    const ids = new Set(draft.nodes.map((node) => node.node_id));

    expect(ids.has("pilot:job-board")).toBe(true);
    expect(ids.has("pilot:company-career-page")).toBe(true);
    expect(ids.has("pilot:ai-job-search")).toBe(false);
  });

  it("does not generate deprecated company-type routes", () => {
    const draft = buildPersonalizedPilotDraft({}, {
      ...profile,
      company_types: ["big_tech", "startup", "consulting", "investment_banking", "graduate_program"],
    });
    expect(draft.nodes.some((node) => node.node_id.startsWith("pilot:company-"))).toBe(false);
    expect(draft.metadata.personalization).not.toHaveProperty("company_types");
  });

  it("uses the batch application route for the action-execution JobTI type", () => {
    const draft = buildPersonalizedPilotDraft({}, {
      ...profile,
      jobti_type: "engine",
      application_strategy: "auto",
    });
    expect(draft.metadata.personalization.resolved_application_strategy).toBe("batch");
    expect(draft.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "pilot:applications", target: "pilot:application-batch-planning", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:application-batch-planning", target: "pilot:application-tracker", relation: "precedes" }),
      expect.objectContaining({ source: "pilot:application-tracker", target: "pilot:resume-version-management", relation: "precedes" }),
      expect.objectContaining({ source: "pilot:resume-version-management", target: "pilot:assessments", relation: "converges_to" }),
    ]));
  });

  it("adds early-internship side routes and keeps HR Screening first under comprehensive interviews", () => {
    const draft = buildPersonalizedPilotDraft({}, {
      ...profile,
      experience_branches: ["first_internship", "transition_first_internship"],
      interview_branches: ["technical"],
    });
    expect(draft.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "pilot:getting-started", target: "pilot:first-internship", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:first-internship", target: "pilot:market", relation: "converges_to" }),
      expect.objectContaining({ source: "pilot:getting-started", target: "pilot:transition-first-internship", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:transition-first-internship", target: "pilot:market", relation: "converges_to" }),
      expect.objectContaining({ source: "pilot:interviews", target: "pilot:hr-screening-call", relation: "branches_to" }),
    ]));
    const screening = draft.nodes.find((node) => node.node_id === "pilot:hr-screening-call");
    const technical = draft.nodes.find((node) => node.node_id === "pilot:interview-technical");
    expect(screening.metadata.directory_order).toBeLessThan(technical.metadata.directory_order);
  });

  it("only creates explicitly selected early-internship nodes", () => {
    const none = buildPersonalizedPilotDraft({}, { ...profile, experience_branches: [] });
    const transition = buildPersonalizedPilotDraft({}, {
      ...profile,
      experience_branches: ["transition_first_internship"],
    });

    expect(none.nodes.some((node) => node.node_id === "pilot:first-internship")).toBe(false);
    expect(none.nodes.some((node) => node.node_id === "pilot:transition-first-internship")).toBe(false);
    expect(transition.nodes.some((node) => node.node_id === "pilot:first-internship")).toBe(false);
    expect(transition.nodes.some((node) => node.node_id === "pilot:transition-first-internship")).toBe(true);
  });

  it("gives every visible Path node a concrete note", () => {
    const draft = buildPersonalizedPilotDraft({}, {
      ...profile,
      jobti_type: "radar",
      experience_branches: ["first_internship"],
    });
    draft.nodes
      .forEach((id) => {
        expect(id.note_url, `${id.node_id} should navigate`).toMatch(/^\/note\/fall-recruiting\/.+\.md$/);
        expect(id.metadata?.content_status).not.toBe("planned");
      });
  });

  it("keeps titles visible for internship, Referral, and HR Screening nodes", () => {
    const draft = buildPersonalizedPilotDraft({}, {
      ...profile,
      experience_branches: ["first_internship", "transition_first_internship"],
      search_branches: ["networking"],
    });
    const elements = buildConstellationElements(draft, { compact: true, direction: "horizontal" });

    [
      ["pilot:first-internship", "如何开启第一段实习"],
      ["pilot:transition-first-internship", "如何在转专业 / 转行后开启第一段实习"],
      ["pilot:referral", "Referral"],
      ["pilot:hr-screening-call", "HR Screening Call"],
    ].forEach(([id, title]) => {
      const node = elements.nodes.find((candidate) => candidate.id === id);
      expect(node?.data?.title).toBe(title);
      expect(node?.data?.note_url).toMatch(/^\/note\/fall-recruiting\/.+\.md$/);
      expect(node?.style?.width).toBeGreaterThan(0);
    });
  });

  it("lays out the combined personalized branches without overlapping node cards", () => {
    const draft = buildPersonalizedPilotDraft({}, {
      ...profile,
      jobti_type: "radar",
      candidate_background: "student",
      experience_branches: ["first_internship", "transition_first_internship"],
      search_branches: ["networking", "ai_job_search"],
      application_strategy: "precision",
      interview_branches: ["hr", "technical", "group", "panel", "assessment_centre", "stress", "final", "special_situations"],
    });
    const { nodes, edges } = buildConstellationElements(draft, { compact: true, direction: "horizontal" });
    const branchNodes = nodes.filter((node) => node.data.metadata?.path_relation === "branch");
    const overlaps = (first, second) => !(
      first.position.x + first.style.width <= second.position.x
      || second.position.x + second.style.width <= first.position.x
      || first.position.y + first.style.minHeight <= second.position.y
      || second.position.y + second.style.minHeight <= first.position.y
    );

    branchNodes.forEach((node, index) => {
      branchNodes.slice(index + 1).forEach((other) => {
        expect(overlaps(node, other), `${node.id} should not overlap ${other.id}`).toBe(false);
      });
    });

    const earlyEdges = edges.filter((edge) => ["pilot:first-internship", "pilot:transition-first-internship"].includes(edge.target));
    expect(earlyEdges.every((edge) => edge.data.routeStyle === "midpoint-drop")).toBe(true);
    expect(new Set(earlyEdges.map((edge) => edge.data.customSourceX)).size).toBe(1);

    const screening = nodes.find((node) => node.id === "pilot:hr-screening-call");
    const hrInterview = nodes.find((node) => node.id === "pilot:interview-hr");
    expect(screening.position.y).toBeLessThan(hrInterview.position.y);
  });

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
