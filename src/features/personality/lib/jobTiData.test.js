import { describe, expect, it } from "vitest";

import {
  QUIZ_ITEMS,
  TYPES,
  buildJobTiPathProfile,
  rankJobTiResults,
} from "./jobTiData";
import { buildPersonalizedPilotDraft } from "../../navigation/lib/pilotPath";

const personalityAnswers = Object.fromEntries(
  QUIZ_ITEMS.filter((item) => item.kind === "personality").map((item) => [item.id, 0]),
);

describe("JobTI questionnaire model", () => {
  it("combines eight personality questions with ten Path inputs", () => {
    expect(QUIZ_ITEMS).toHaveLength(18);
    expect(QUIZ_ITEMS.filter((item) => item.kind === "personality")).toHaveLength(8);
    expect(QUIZ_ITEMS.filter((item) => item.kind.startsWith("path-"))).toHaveLength(10);
    expect(QUIZ_ITEMS.some((item) => item.id === "company_types")).toBe(false);
    expect(QUIZ_ITEMS.some((item) => item.id === "search")).toBe(false);
  });

  it("does not let unscored Path answers change the personality result", () => {
    const first = rankJobTiResults({
      ...personalityAnswers,
      stage: "getting_started",
      materials: [],
      search: [],
      leetcode: false,
      certificates: "skip",
      interviews: [],
    });
    const second = rankJobTiResults({
      ...personalityAnswers,
      stage: "interviewing",
      candidate_background: "student",
      materials: ["linkedin", "cover_letter"],
      search: ["networking"],
      leetcode: true,
      certificates: "skip",
      interviews: ["hr", "panel"],
    });
    expect(second).toEqual(first);
  });

  it("uses the finance-certificate answer as personality evidence", () => {
    expect(rankJobTiResults({ certificates: "skip" })[0]).toBe("protector");
    expect(rankJobTiResults({ certificates: "learn" })[0]).toBe("researcher");
    expect(rankJobTiResults({ certificates: "consider" })[0]).toBe("engine");
    expect(rankJobTiResults({ certificates: "later" })[0]).toBe("explorer");
  });

  it("balances type exposure across every scored question", () => {
    const typeKeys = Object.keys(TYPES).sort();
    const scoredItems = QUIZ_ITEMS.filter((item) => item.options.some((option) => option.scores?.length));
    const primaryCounts = Object.fromEntries(typeKeys.map((key) => [key, 0]));
    const secondaryCounts = Object.fromEntries(typeKeys.map((key) => [key, 0]));

    expect(scoredItems).toHaveLength(9);
    scoredItems.forEach((item) => {
      expect(item.options.flatMap((option) => option.scores).sort()).toEqual(typeKeys);
      item.options.forEach((option) => {
        primaryCounts[option.scores[0]] += 1;
        secondaryCounts[option.scores[1]] += 1;
      });
    });

    expect(Math.max(...Object.values(primaryCounts)) - Math.min(...Object.values(primaryCounts))).toBeLessThanOrEqual(1);
    expect(Math.max(...Object.values(secondaryCounts)) - Math.min(...Object.values(secondaryCounts))).toBeLessThanOrEqual(1);
  });

  it("turns practical answers into a reusable Path profile", () => {
    const profile = buildJobTiPathProfile({
      stage: "interviewing",
      candidate_background: "student",
      materials: ["linkedin"],
      information_style: "social",
      application_strategy: "batch_then_precision",
      profile_competitiveness: "unsure",
      experience_level: "limited",
      leetcode: true,
      certificates: "learn",
      interviews: ["hr", "assessment_centre"],
    });

    expect(profile).toMatchObject({
      stage: "interviewing",
      jobti_type: expect.any(String),
      candidate_background: "student",
      profile_branches: ["linkedin"],
      information_style: "social",
      application_strategy: "batch_then_precision",
      profile_competitiveness: "unsure",
      experience_level: "limited",
      search_branches: [],
      skill_branches: ["technical"],
      certificate_interest: true,
      interview_branches: ["hr", "assessment_centre"],
      setup_complete: true,
    });
  });

  it("uses the legacy leetcode field to add the general skill-supplement overview", () => {
    const profile = buildJobTiPathProfile({ leetcode: true });
    const draft = buildPersonalizedPilotDraft({}, profile);

    expect(profile.skill_branches).toEqual(["technical"]);
    expect(draft.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({ node_id: "pilot:skill-supplement", note_url: "/note/fall-recruiting/skill-supplement.md" }),
    ]));
    expect(draft.nodes.some((node) => node.node_id === "pilot:technical-skills")).toBe(false);
    expect(draft.edges).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "pilot:market", target: "pilot:skill-supplement", relation: "branches_to" }),
      expect.objectContaining({ source: "pilot:skill-supplement", target: "pilot:profile-preparation", relation: "converges_to" }),
    ]));
  });

  it("keeps every finance-certificate answer visually distinct", () => {
    const question = QUIZ_ITEMS.find((item) => item.id === "certificates");
    expect(new Set(question.options.map((option) => option.value)).size).toBe(question.options.length);
    expect(buildJobTiPathProfile({ certificates: "learn" }).certificate_interest).toBe(true);
    expect(buildJobTiPathProfile({ certificates: "skip" }).certificate_interest).toBe(false);
  });

  it("turns the existing career-planning answer into a Path direction signal", () => {
    expect(buildJobTiPathProfile({ planning: 0 }).career_direction).toBe("focused");
    expect(buildJobTiPathProfile({ planning: 1 }).career_direction).toBe("exploring");
    expect(buildJobTiPathProfile({ planning: 2 }).career_direction).toBe("exploring");
  });

  it("maps the new practical questions to independent reusable Path signals", () => {
    const profile = buildJobTiPathProfile({
      information_style: "balanced",
      application_strategy: "precision_then_batch",
      profile_competitiveness: "competitive",
      experience_level: "limited",
    });

    expect(profile).toMatchObject({
      information_style: "balanced",
      application_strategy: "precision_then_batch",
      profile_competitiveness: "competitive",
      experience_level: "limited",
    });
  });

  it("turns questionnaire answers into the corresponding personalized Path nodes", () => {
    const profile = buildJobTiPathProfile({
      planning: 1,
      information_style: "social",
      application_strategy: "batch_then_precision",
      profile_competitiveness: "unsure",
      experience_level: "limited",
    });
    const draft = buildPersonalizedPilotDraft({}, profile);
    const ids = new Set(draft.nodes.map((node) => node.node_id));

    [
      "pilot:career-exploration",
      "pilot:networking",
      "pilot:networking-event",
      "pilot:application-batch-planning",
      "pilot:company-research",
      "pilot:resume-positioning",
      "pilot:experience-building",
      "pilot:business-competition",
      "pilot:kaggle-competition",
      "pilot:course-project-polish",
    ].forEach((id) => expect(ids.has(id), `${id} should exist`).toBe(true));
  });
});
