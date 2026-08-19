import { describe, expect, it } from "vitest";

import {
  advanceCareerRun,
  createCareerRun,
  restoreCareerRun,
  summarizeCareerRun,
} from "./careerRun";
import { CAREER_EVENT_POOL } from "../config/careerEventPool";
import { MAX_TURNS } from "../config/gameConfig";
import { LEGACY_POOL } from "../config/legacyPool";

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

  it("keeps the complete twenty-one-item Legacy catalog within the approved strength bands", () => {
    expect(LEGACY_POOL).toHaveLength(21);
    expect(LEGACY_POOL.map((legacy) => legacy.title)).toEqual(expect.arrayContaining([
      "校友的联系方式",
      "教授的 Meeting 邀请",
      "超级舒服的枕头",
      "大容量充电宝",
      "七倍浓缩美式",
      "“我真的投过这家公司吗？”",
      "E人面具",
    ]));
    const routeWeights = LEGACY_POOL.flatMap((legacy) => Object.entries(legacy.modifiers || {})
      .filter(([key]) => key.endsWith("Weight"))
      .map(([, value]) => value));
    expect(routeWeights).toEqual([1.3, 1.3, 1.3, 1.3, 1.3]);
  });

  it("fires the low-Energy power bank only once and records the underlying resource pressure", () => {
    let state = createCareerRun({ seed: 91, legacyId: "power-bank" });
    state.attributes.energy = 22;
    state.currentEvent = { id: "resume-first-draft", choices: [] };

    state = advanceCareerRun(state, "ship");
    const firstEnergy = state.attributes.energy;
    expect(state.legacyUsage.powerBankUsed).toBe(true);
    expect(state.minimums.energy).toBeLessThanOrEqual(20);
    expect(firstEnergy).toBeGreaterThan(20);

    state.attributes.energy = 22;
    state.currentEvent = { id: "resume-first-draft", choices: [] };
    state.seenEventIds = state.seenEventIds.filter((id) => id !== "resume-first-draft");
    state = advanceCareerRun(state, "ship");
    expect(state.attributes.energy).toBeLessThan(firstEnergy);
  });

  it("applies one-shot Final Round and interview-format probability bonuses", () => {
    const play = (legacyId, eventId, choiceId) => {
      const state = createCareerRun({ seed: 100, legacyId });
      state.currentEvent = { id: eventId, choices: [] };
      state.counters.interviewLeads = 1;
      state.counters.offerLeads = 1;
      return advanceCareerRun(state, choiceId);
    };

    const finalBaseline = play(null, "final-round", "deep");
    const finalBoosted = play("comfortable-pillow", "final-round", "deep");
    const groupBaseline = play(null, "group-interview", "facilitate");
    const groupBoosted = play("extrovert-mask", "group-interview", "facilitate");

    expect(finalBoosted.lastOutcome.probability - finalBaseline.lastOutcome.probability).toBeCloseTo(0.04, 5);
    expect(finalBoosted.attributes.energy - finalBaseline.attributes.energy).toBe(4);
    expect(finalBoosted.legacyUsage.pillowUsed).toBe(true);
    expect(groupBoosted.lastOutcome.probability - groupBaseline.lastOutcome.probability).toBeCloseTo(0.07, 5);
  });

  it("gives Campus Celebrity a deterministic opportunity or its Network fallback", () => {
    const runs = [1, 1972].map((seed) => createCareerRun({
      seed,
      legacyId: "campus-celebrity",
    }));

    expect(runs.some((state) => state.counters.networkingOpportunities === 1)).toBe(true);
    runs.forEach((state) => {
      expect(state.counters.networkingOpportunities === 1 || state.attributes.network === 12).toBe(true);
    });
  });

  it("turns the first interview failure into one review bonus for the next interview", () => {
    let failedRun;
    for (let seed = 1; seed < 3000 && !failedRun; seed += 1) {
      const candidate = createCareerRun({ seed, legacyId: "interview-review" });
      candidate.currentEvent = { id: "behavioral-interview", choices: [] };
      candidate.counters.interviewLeads = 1;
      const next = advanceCareerRun(candidate, "honest");
      if (next.lastOutcome.succeeded === false) failedRun = next;
    }

    expect(failedRun).toBeTruthy();
    expect(failedRun.legacyUsage.interviewReviewUsed).toBe(true);
    expect(failedRun.legacyUsage.nextInterviewBonus).toBe(0.05);
    failedRun.currentEvent = { id: "technical-interview", choices: [] };
    failedRun.counters.interviewLeads = 1;
    const reviewed = advanceCareerRun(failedRun, "wing");
    expect(reviewed.legacyUsage.nextInterviewBonus).toBe(0);
  });

  it("caps the free Application Legacy at two extra Applications per run", () => {
    let state = createCareerRun({ seed: 1972, legacyId: "application-amnesia" });
    for (let index = 0; index < 80; index += 1) {
      state.status = "playing";
      state.turn = 1;
      state.attributes.time = 100;
      state.attributes.energy = 100;
      state.currentEvent = { id: "dream-job-deadline", choices: [] };
      state.seenEventIds = [];
      state = advanceCareerRun(state, "direct");
    }

    expect(state.legacyUsage.bonusApplications).toBe(2);
  });

  it("can unlock E人面具 through two distinct Group Interview Events", () => {
    let state = createCareerRun({ seed: 1500 });
    state.currentEvent = { id: "group-interview", choices: [] };
    state.counters.interviewLeads = 2;
    state = advanceCareerRun(state, "facilitate");
    state.currentEvent = { id: "assessment-centre-group", choices: [] };
    state.counters.interviewLeads = Math.max(1, state.counters.interviewLeads);
    state = advanceCareerRun(state, "coordinate");
    state.status = "complete";
    state.currentEvent = null;

    expect(state.counters.groupInterviews).toBe(2);
    expect(summarizeCareerRun(state).unlockedLegacyIds).toContain("extrovert-mask");
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

  it("grows the Content Creator story through four configured rare Events", () => {
    const creatorEvents = ["creator-essay", "creator-readers", "creator-commission", "creator-crossroads"]
      .map((id) => CAREER_EVENT_POOL.find((event) => event.id === id));

    expect(creatorEvents.every(Boolean)).toBe(true);
    expect(creatorEvents.every((event) => event.rarity === "rare")).toBe(true);
    expect(creatorEvents.map((event) => event.requirements?.minRoutes?.creator || 0)).toEqual([0, 1, 2, 3]);
  });

  it("resolves Content Creator only after the player explicitly commits to the route", () => {
    const playCreatorChoice = (state, eventId, choiceId) => {
      const next = structuredClone(state);
      next.currentEvent = { id: eventId, choices: [] };
      return advanceCareerRun(next, choiceId);
    };
    let state = createCareerRun({ seed: 20260819 });
    state.turn = 8;
    state.stage = "application";
    state.counters.rejections = 2;
    state = playCreatorChoice(state, "creator-essay", "read-comments");
    state = playCreatorChoice(state, "creator-readers", "keep-writing");
    state = playCreatorChoice(state, "creator-commission", "accept-commission");
    state = playCreatorChoice(state, "creator-crossroads", "try-creator-path");
    state.status = "complete";
    state.currentEvent = null;

    const result = summarizeCareerRun(state);

    expect(state.routes.creator).toBe(4);
    expect(result.ending.id).toBe("content_creator");
    expect(result.path.profile.profile_branches).toEqual(expect.arrayContaining(["portfolio", "personal_site"]));
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
