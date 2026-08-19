import { describe, expect, it } from "vitest";

import { advanceCareerRun, createCareerRun } from "./careerRun";

const balancedSeed = (index) => Math.imul(index + 1, 2654435761) >>> 0 || 1;

function successRate(eventId, choiceId, runs = 2000) {
  let successes = 0;
  for (let index = 0; index < runs; index += 1) {
    const state = createCareerRun({ seed: balancedSeed(index) });
    state.currentEvent = { id: eventId, choices: [] };
    state.counters.interviewLeads = 1;
    successes += Number(advanceCareerRun(state, choiceId).lastOutcome.succeeded);
  }
  return successes / runs;
}

describe("Career Run standard Event balance", () => {
  it("keeps Technical Interview preparation, fundamentals, and recovery as distinct trade-offs", () => {
    const drilling = successRate("technical-interview", "drill");
    const fundamentals = successRate("technical-interview", "fundamentals");
    const recovery = successRate("technical-interview", "wing");

    const recovered = createCareerRun({ seed: 1953 });
    recovered.currentEvent = { id: "technical-interview", choices: [] };
    recovered.counters.interviewLeads = 1;
    const afterRecovery = advanceCareerRun(recovered, "wing");

    expect(drilling - recovery).toBeGreaterThan(0.08);
    expect(fundamentals).toBeGreaterThanOrEqual(recovery);
    expect(afterRecovery.attributes.energy).toBeGreaterThan(recovered.attributes.energy);
    expect(afterRecovery.attributes.profile).toBe(recovered.attributes.profile);
  }, 30000);

  it("makes LinkedIn connections useful without overwhelming Networking probability", () => {
    const probabilityAfter = (choiceId) => {
      let state = createCareerRun({ seed: 1953 });
      state.currentEvent = { id: "linkedin-cleanup", choices: [] };
      state = advanceCareerRun(state, choiceId);
      state.currentEvent = { id: "alumni-reply", choices: [] };
      return advanceCareerRun(state, "ask-referral").lastOutcome.probability;
    };

    const profileFirst = probabilityAfter("rewrite");
    const connectionsFirst = probabilityAfter("benchmark");

    expect(connectionsFirst - profileFirst).toBeGreaterThan(0.01);
    expect(connectionsFirst - profileFirst).toBeLessThanOrEqual(0.03);
  });
});
