import { describe, expect, it } from "vitest";

import {
  QUIZ_ITEMS,
  TYPES,
  buildJobTiPathProfile,
  rankJobTiResults,
} from "./jobTiData";

const personalityAnswers = Object.fromEntries(
  QUIZ_ITEMS.filter((item) => item.kind === "personality").map((item) => [item.id, 0]),
);

describe("JobTI questionnaire model", () => {
  it("combines eight personality questions with six Path inputs", () => {
    expect(QUIZ_ITEMS).toHaveLength(14);
    expect(QUIZ_ITEMS.filter((item) => item.kind === "personality")).toHaveLength(8);
    expect(QUIZ_ITEMS.filter((item) => item.kind.startsWith("path-"))).toHaveLength(6);
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
      materials: ["linkedin"],
      search: ["networking"],
      leetcode: true,
      certificates: "learn",
      interviews: ["hr", "assessment_centre"],
    });

    expect(profile).toMatchObject({
      stage: "interviewing",
      profile_branches: ["linkedin"],
      search_branches: ["networking"],
      skill_branches: ["technical"],
      certificate_interest: true,
      interview_branches: ["hr", "assessment_centre"],
      setup_complete: true,
    });
  });

  it("keeps every finance-certificate answer visually distinct", () => {
    const question = QUIZ_ITEMS.find((item) => item.id === "certificates");
    expect(new Set(question.options.map((option) => option.value)).size).toBe(question.options.length);
    expect(buildJobTiPathProfile({ certificates: "learn" }).certificate_interest).toBe(true);
    expect(buildJobTiPathProfile({ certificates: "skip" }).certificate_interest).toBe(false);
  });
});
