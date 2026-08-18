import { describe, expect, it } from "vitest";

import {
  advanceCareerRun,
  createCareerRun,
  restoreCareerRun,
  summarizeCareerRun,
} from "./careerRun";
import { EVENT_POOL } from "../config/eventPool";

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
      time: 100,
      energy: 78,
      confidence: 58,
      profile: 32,
      network: 12,
    });
    expect(state.currentEvent.id).toBe("market-crossroads");
    expect(state.currentEvent.choices.length).toBeGreaterThanOrEqual(2);
    expect(state.currentEvent.choices.length).toBeLessThanOrEqual(4);
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
    EVENT_POOL.forEach((event) => {
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

  it("resolves an Ending and Persona separately and explains its Path defaults", () => {
    const state = finishRun(4096, (choices) => {
      return choices.find((choice) => choice.behaviorEffects?.analysis) ?? choices[0];
    });
    const result = summarizeCareerRun(state);

    expect(result.ending).toMatchObject({ id: expect.any(String), title: expect.any(String) });
    expect(result.persona).toMatchObject({
      key: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
    });
    expect(result.ending.id).not.toBe(result.persona.key);
    expect(result.stats).toEqual({
      applications: expect.any(Number),
      interviews: expect.any(Number),
      referrals: expect.any(Number),
      offers: expect.any(Number),
    });
    expect(result.path.signals.length).toBeGreaterThan(0);
    expect(result.path.profile).toMatchObject({
      stage: expect.any(String),
      jobti_type: result.persona.key,
      candidate_background: "student",
      profile_branches: expect.any(Array),
      search_branches: expect.any(Array),
      interview_branches: expect.any(Array),
    });
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

    expect(actionResult.persona.key).not.toBe(reflectiveResult.persona.key);
  });
});
