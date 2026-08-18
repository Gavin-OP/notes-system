import { describe, expect, it } from "vitest";

import {
  advanceCareerRun,
  createCareerRun,
  restoreCareerRun,
  summarizeCareerRun,
} from "./careerRun";
import { CAREER_EVENT_POOL } from "../config/careerEventPool";
import { MAX_TURNS } from "../config/gameConfig";

function availableChoices(state) {
  return state.currentEvent?.choices.filter((choice) => choice.available !== false) ?? [];
}

function finishRun(seed, choose) {
  let state = createCareerRun({ seed });
  let safety = 0;

  while (state.status !== "complete" && safety < 30) {
    const choices = availableChoices(state);
    expect(choices.length).toBeGreaterThanOrEqual(2);
    const choice = choose(choices, state) ?? choices[0];
    state = advanceCareerRun(state, choice.id);
    safety += 1;
  }

  expect(safety).toBeLessThan(30);
  expect(state.status).toBe("complete");
  return state;
}

describe("Career Run public behavior", () => {
  it("starts every player from the configured Graduate baseline", () => {
    const state = createCareerRun({ seed: 1953 });

    expect(state.status).toBe("playing");
    expect(state.role).toBe("graduate");
    expect(state.turn).toBe(0);
    expect(state.attributes).toEqual({
      time: 70,
      energy: 60,
      confidence: 45,
      profile: 15,
      network: 10,
    });
    expect(state.currentEvent.id).toBe("market-crossroads");
    expect(state.currentEvent.choices.length).toBeGreaterThanOrEqual(2);
    expect(state.currentEvent.choices.length).toBeLessThanOrEqual(4);
  });

  it("runs a twenty-event recruiting season before normal closing", () => {
    expect(MAX_TURNS).toBe(20);
    const state = finishRun(20260818, (choices) => choices.toSorted(
      (a, b) => (b.effects?.energy || 0) - (a.effects?.energy || 0),
    )[0]);

    expect(state.history).toHaveLength(20);
    expect(state.stage).toBe("closing");
  });

  it("surfaces an earned interview opportunity before it can silently expire", () => {
    const state = createCareerRun({ seed: 1953 });
    state.turn = 8;
    state.stage = "application";
    state.counters.interviewLeads = 1;
    state.opportunityAges.interview = 2;

    const next = advanceCareerRun(state, "research");

    expect(next.currentEvent.category).toBe("interview");
    expect(next.currentEvent.id).toMatch(/screening|interview/);
  });

  it("keeps an Offer pending until the player accepts or declines it", () => {
    const state = createCareerRun({ seed: 31 });
    state.turn = 17;
    state.currentEvent = {
      id: "ordinary-offer",
      choices: [],
    };
    state.counters.pendingOffers = 1;

    const accepted = advanceCareerRun(state, "accept");

    expect(accepted.counters.offers).toBeGreaterThanOrEqual(1);
    expect(accepted.counters.acceptedOffers).toBe(1);
    expect(accepted.counters.pendingOffers).toBe(0);
  });

  it("ends the run immediately when Time or Energy reaches zero", () => {
    const noTime = createCareerRun({ seed: 12 });
    noTime.attributes.time = 1;
    const timeEnding = advanceCareerRun(noTime, "research");

    const noEnergy = createCareerRun({ seed: 13 });
    noEnergy.currentEvent = { id: "resume-first-draft", choices: [] };
    noEnergy.attributes.energy = 1;
    const energyEnding = advanceCareerRun(noEnergy, "ship");

    expect(timeEnding).toMatchObject({ status: "complete", stage: "closing" });
    expect(timeEnding.attributes.time).toBe(0);
    expect(energyEnding).toMatchObject({ status: "complete", stage: "burnout" });
    expect(energyEnding.attributes.energy).toBe(0);
  });

  it("applies one equipped Legacy to a new run", () => {
    const networkRun = createCareerRun({ seed: 22, legacyId: "senior-contact" });
    const boundaryRun = createCareerRun({ seed: 22, legacyId: "boundaries" });

    expect(networkRun.attributes.network).toBeGreaterThan(createCareerRun({ seed: 22 }).attributes.network);
    expect(boundaryRun.attributes.energy).toBeGreaterThan(createCareerRun({ seed: 22 }).attributes.energy);
    expect(networkRun.legacy.id).toBe("senior-contact");
  });

  it("applies transparent pity support after repeated screening failures", () => {
    const baseline = createCareerRun({ seed: 99 });
    baseline.turn = 6;
    baseline.currentEvent = { id: "dream-job-deadline", choices: [] };
    const supported = structuredClone(baseline);
    supported.failureStreaks.application = 6;

    const first = advanceCareerRun(baseline, "direct");
    const second = advanceCareerRun(supported, "direct");

    expect(second.lastOutcome.probability - first.lastOutcome.probability).toBeCloseTo(0.18, 5);
  });

  it("resolves a developed alternative route without losing Personalized Path output", () => {
    const state = createCareerRun({ seed: 8 });
    state.status = "complete";
    state.currentEvent = null;
    state.flags.startupReady = true;
    state.routes.startup = 82;
    state.metrics.alternativePath = 55;

    const result = summarizeCareerRun(state);

    expect(result.ending.id).toBe("startup_founder");
    expect(result.path.profile).toMatchObject({
      profile_branches: expect.any(Array),
      search_branches: expect.any(Array),
    });
    expect(result.path.signals.some((signal) => signal.includes("项目"))).toBe(true);
  });

  it("replays the same Events and outcomes for the same seed and choices", () => {
    const play = () => finishRun(20260811, (choices) => choices[0]);

    const first = play();
    const second = play();

    expect(second.history).toEqual(first.history);
    expect(second.attributes).toEqual(first.attributes);
    expect(summarizeCareerRun(second)).toEqual(summarizeCareerRun(first));
  });

  it("prevents duplicate Events and keeps every Attribute within 0–100", () => {
    const state = finishRun(88, (choices) => choices.at(-1));
    const eventIds = state.history.map((entry) => entry.eventId);

    expect(new Set(eventIds).size).toBe(eventIds.length);
    Object.values(state.attributes).forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    });
  });

  it("rejects unknown and unavailable Choices without mutating the run", () => {
    const state = createCareerRun({ seed: 7 });
    const snapshot = structuredClone(state);

    expect(() => advanceCareerRun(state, "not-a-choice")).toThrow(/choice/i);
    expect(state).toEqual(snapshot);
  });

  it("rebuilds the current Event from config when restoring an older browser snapshot", () => {
    const saved = createCareerRun({ seed: 1953 });
    saved.currentEvent = {
      id: "market-crossroads",
      title: "stale title",
      choices: [{ id: "removed-choice", label: "stale choice" }],
    };

    const restored = restoreCareerRun(JSON.parse(JSON.stringify(saved)));

    expect(restored.currentEvent.title).toBe("求职季开始了，你打算先做什么？");
    expect(restored.currentEvent.choices.some((choice) => choice.id === "research")).toBe(true);
    expect(() => advanceCareerRun(restored, "research")).not.toThrow();
  });

  it("configures a concrete consequence for every playable Choice", () => {
    CAREER_EVENT_POOL.forEach((event) => {
      event.choices.forEach((choice) => {
        if (choice.successModel) {
          expect(choice.success?.message, `${event.id}/${choice.id} success`).toBeTruthy();
          expect(choice.failure?.message, `${event.id}/${choice.id} failure`).toBeTruthy();
        } else {
          expect(choice.outcome?.message, `${event.id}/${choice.id} outcome`).toBeTruthy();
        }
      });
    });
  });

  it("resolves an Ending and hidden strategy signals without returning a personality result", () => {
    const state = finishRun(4096, (choices) => {
      return choices.find((choice) => choice.behaviorEffects?.analysis) ?? choices[0];
    });
    const result = summarizeCareerRun(state);

    expect(result.ending).toMatchObject({ id: expect.any(String), title: expect.any(String) });
    expect(result.persona).toBeUndefined();
    expect(result.stats).toEqual({
      applications: expect.any(Number),
      interviews: expect.any(Number),
      referrals: expect.any(Number),
      offers: expect.any(Number),
    });
    expect(result.path.signals.length).toBeGreaterThan(0);
    expect(result.path.profile).toMatchObject({
      stage: expect.any(String),
      jobti_type: expect.any(String),
      candidate_background: "student",
      profile_branches: expect.any(Array),
      search_branches: expect.any(Array),
      interview_branches: expect.any(Array),
    });
    expect(result.achievements.length).toBeGreaterThan(0);
    expect(result.legacyChoices).toHaveLength(3);
    expect(result.runStory).toEqual(expect.any(String));
  });

  it("uses behavioral trajectory, rather than Offer count alone, for Persona scoring", () => {
    const actionRun = finishRun(314159, (choices) => {
      return choices.toSorted((a, b) =>
        (b.behaviorEffects?.action ?? 0) - (a.behaviorEffects?.action ?? 0)
      )[0];
    });
    const reflectiveRun = finishRun(314159, (choices) => {
      return choices.toSorted((a, b) =>
        ((b.behaviorEffects?.reflection ?? 0) + (b.behaviorEffects?.pacing ?? 0)) -
        ((a.behaviorEffects?.reflection ?? 0) + (a.behaviorEffects?.pacing ?? 0))
      )[0];
    });

    const actionResult = summarizeCareerRun(actionRun);
    const reflectiveResult = summarizeCareerRun(reflectiveRun);

    expect(actionResult.path.profile.jobti_type).not.toBe(reflectiveResult.path.profile.jobti_type);
  });

  it("keeps seeded runs varied without making resource exhaustion the default ending", () => {
    const endings = {};
    let timeExhausted = 0;
    let energyExhausted = 0;
    let confidencePressure = 0;
    for (let seed = 1; seed <= 200; seed += 1) {
      const state = finishRun(seed, (choices, run) => choices[(seed + run.turn) % choices.length]);
      const ending = summarizeCareerRun(state).ending.id;
      endings[ending] = (endings[ending] || 0) + 1;
      if (state.attributes.time === 0) timeExhausted += 1;
      if (state.attributes.energy === 0) energyExhausted += 1;
      if (state.minimums.confidence <= 30) confidencePressure += 1;
    }

    expect(Object.keys(endings).length).toBeGreaterThanOrEqual(5);
    expect(endings.burnout || 0).toBeLessThan(60);
    expect(timeExhausted).toBeGreaterThan(5);
    expect(energyExhausted).toBeGreaterThan(5);
    expect(confidencePressure).toBeGreaterThan(20);
  });
});
