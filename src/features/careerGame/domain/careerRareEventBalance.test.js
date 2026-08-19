import { describe, expect, it } from "vitest";

import { advanceCareerRun, createCareerRun, summarizeCareerRun } from "./careerRun";

const balancedSeed = (index) => Math.imul(index + 1, 2654435761) >>> 0 || 1;

function outcomeRate({ eventId, choiceId, setup = () => {} }, runs = 2000) {
  let successes = 0;
  for (let index = 0; index < runs; index += 1) {
    const state = createCareerRun({ seed: balancedSeed(index) });
    state.currentEvent = { id: eventId, choices: [] };
    setup(state);
    successes += Number(advanceCareerRun(state, choiceId).lastOutcome.succeeded);
  }
  return successes / runs;
}

function play(seed) {
  let state = createCareerRun({ seed });
  while (state.status === "playing") {
    const choices = state.currentEvent.choices.filter((choice) => choice.available !== false);
    state = advanceCareerRun(state, choices[(seed + state.turn) % choices.length].id);
  }
  return state;
}

describe("Career Run rare Event balance simulator", () => {
  it("keeps conditional outcomes close to their approved state-dependent rates", () => {
    const startupLow = outcomeRate({
      eventId: "partner-disagreement", choiceId: "push",
      setup: (state) => { state.attributes.confidence = 30; state.behavior.networking = 0; },
    });
    const startupHigh = outcomeRate({
      eventId: "partner-disagreement", choiceId: "push",
      setup: (state) => { state.attributes.confidence = 60; state.behavior.networking = 12; },
    });
    const startupOneRisk = outcomeRate({
      eventId: "partner-disagreement", choiceId: "push",
      setup: (state) => { state.attributes.confidence = 60; state.behavior.networking = 0; },
    });
    const editorialLow = outcomeRate({
      eventId: "creator-commission", choiceId: "keep-voice",
      setup: (state) => { state.attributes.confidence = 35; },
    });
    const editorialHigh = outcomeRate({
      eventId: "creator-commission", choiceId: "keep-voice",
      setup: (state) => { state.attributes.confidence = 60; },
    });
    const improvLow = outcomeRate({
      eventId: "unexpected-interview-question", choiceId: "improvise",
      setup: (state) => { state.attributes.energy = 25; state.behavior.expression = 0; state.counters.interviewLeads = 1; },
    });
    const improvHigh = outcomeRate({
      eventId: "unexpected-interview-question", choiceId: "improvise",
      setup: (state) => { state.attributes.energy = 60; state.behavior.expression = 12; state.counters.interviewLeads = 1; },
    });
    const improvOneRisk = outcomeRate({
      eventId: "unexpected-interview-question", choiceId: "improvise",
      setup: (state) => { state.attributes.energy = 60; state.behavior.expression = 0; state.counters.interviewLeads = 1; },
    });

    expect(startupLow).toBeCloseTo(0.6, 1);
    expect(startupOneRisk).toBeCloseTo(0.7, 1);
    expect(startupHigh).toBeCloseTo(0.95, 1);
    expect(editorialLow).toBeCloseTo(0.6, 1);
    expect(editorialHigh).toBeCloseTo(0.9, 1);
    expect(improvLow).toBeCloseTo(0.55, 1);
    expect(improvOneRisk).toBeCloseTo(0.7, 1);
    expect(improvHigh).toBeCloseTo(0.9, 1);
  }, 30000);

  it("keeps a thousand varied full runs playable after the rare Event update", () => {
    const endings = {};
    let accepted = 0;
    for (let index = 0; index < 1000; index += 1) {
      const state = play(balancedSeed(index));
      const ending = summarizeCareerRun(state).ending.id;
      endings[ending] = (endings[ending] || 0) + 1;
      accepted += Number(state.counters.acceptedOffers > 0);
    }

    expect(Object.keys(endings).length).toBeGreaterThanOrEqual(5);
    expect(endings.burnout || 0).toBeLessThan(350);
    expect(endings.still_searching || 0).toBeLessThan(900);
    expect(accepted).toBeGreaterThan(20);
  }, 30000);
});
