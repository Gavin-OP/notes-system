import { describe, expect, it } from "vitest";

import {
  QUIZ_ITEMS,
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

  it("does not let Path answers change the personality result", () => {
    const first = rankJobTiResults({
      ...personalityAnswers,
      stage: "getting_started",
      materials: [],
      search: [],
      leetcode: false,
      certificates: false,
      interviews: [],
    });
    const second = rankJobTiResults({
      ...personalityAnswers,
      stage: "interviewing",
      materials: ["linkedin", "cover_letter"],
      search: ["networking"],
      leetcode: true,
      certificates: true,
      interviews: ["hr", "panel"],
    });
    expect(second).toEqual(first);
  });

  it("turns practical answers into a reusable Path profile", () => {
    const profile = buildJobTiPathProfile({
      stage: "interviewing",
      materials: ["linkedin"],
      search: ["networking"],
      leetcode: true,
      certificates: true,
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
});
