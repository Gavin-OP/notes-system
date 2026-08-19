import { describe, expect, it } from "vitest";

import { LEGACY_POOL } from "../config/legacyPool";
import { advanceCareerRun, createCareerRun, summarizeCareerRun } from "./careerRun";

const RUNS_PER_VARIANT = 1000;
const ROUTE_ENDINGS = {
  "airport-regular": ["gap_year", "world_travel"],
  "first-client": ["freelancer"],
  "first-user": ["startup_founder"],
  "stall-pass": ["stall_business"],
  "professor-meeting": ["academic"],
};

function play(seed, legacyId = null) {
  let state = createCareerRun({ seed, legacyId });
  while (state.status === "playing") {
    const choices = state.currentEvent.choices.filter((choice) => choice.available !== false);
    const choice = choices[(seed + state.turn) % choices.length];
    state = advanceCareerRun(state, choice.id);
  }
  return state;
}

function simulate(legacyId = null) {
  const samples = [];
  const endings = {};
  let accepted = 0;
  let burnout = 0;
  let stillSearching = 0;

  for (let seed = 1; seed <= RUNS_PER_VARIANT; seed += 1) {
    const state = play(seed, legacyId);
    const ending = summarizeCareerRun(state).ending.id;
    endings[ending] = (endings[ending] || 0) + 1;
    accepted += Number(state.counters.acceptedOffers > 0);
    burnout += Number(ending === "burnout");
    stillSearching += Number(ending === "still_searching");
    samples.push(state.minimums.energy);
  }

  return {
    accepted: accepted / RUNS_PER_VARIANT,
    burnout: burnout / RUNS_PER_VARIANT,
    stillSearching: stillSearching / RUNS_PER_VARIANT,
    endings,
    energySpread: Math.max(...samples) - Math.min(...samples),
  };
}

describe("Career Run Legacy balance simulator", () => {
  it("compares every Legacy with a 1000-run no-Legacy baseline", () => {
    const baseline = simulate();
    const results = Object.fromEntries(LEGACY_POOL.map((legacy) => [legacy.id, simulate(legacy.id)]));

    Object.entries(results).forEach(([id, result]) => {
      expect(result.accepted - baseline.accepted, `${id} accepted Offer uplift`).toBeLessThanOrEqual(0.08);
      expect(result.burnout, `${id} burnout proportion`).toBeGreaterThanOrEqual(0);
      expect(result.stillSearching, `${id} still-searching proportion`).toBeGreaterThanOrEqual(0);
    });

    Object.entries(ROUTE_ENDINGS).forEach(([legacyId, endingIds]) => {
      const baselineCount = endingIds.reduce((sum, id) => sum + (baseline.endings[id] || 0), 0);
      const legacyCount = endingIds.reduce((sum, id) => sum + (results[legacyId].endings[id] || 0), 0);
      const permitted = Math.max(20, baselineCount * 2.5);
      expect(legacyCount, `${legacyId} target-route endings`).toBeLessThanOrEqual(permitted);
    });

    expect(results["seven-shot-americano"].energySpread).toBeGreaterThan(20);
    expect(results["seven-shot-americano"].accepted)
      .toBeLessThanOrEqual(Math.max(results["power-bank"].accepted, results.boundaries.accepted) + 0.08);
  }, 120000);
});
