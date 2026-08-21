import { expect, it } from "vitest";

import { advanceCareerRun, createCareerRun, summarizeCareerRun } from "./careerRun";

const balancedSeed = (index) => Math.imul(index + 1, 2654435761) >>> 0 || 1;

it("keeps Rare Events occasional across a thousand complete runs", () => {
  const counts = [];
  const turns = [];
  const adjacentRarePairs = [];
  const endings = [];
  for (let index = 0; index < 1000; index += 1) {
    const seed = balancedSeed(index);
    let state = createCareerRun({ seed });
    while (state.status === "playing") {
      const choices = state.currentEvent.choices.filter((choice) => choice.available !== false);
      state = advanceCareerRun(state, choices[(seed + state.turn) % choices.length].id);
    }
    const rareFlags = state.history.map((entry) => entry.rarity === "rare");
    counts.push(rareFlags.filter(Boolean).length);
    turns.push(state.history.length);
    adjacentRarePairs.push(rareFlags.slice(1).filter((isRare, position) => isRare && rareFlags[position]).length);
    endings.push(summarizeCareerRun(state).ending.id);
  }
  counts.sort((a, b) => a - b);
  turns.sort((a, b) => a - b);
  const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const percentile = (values, fraction) => values[Math.floor((values.length - 1) * fraction)];
  const audit = {
    runs: counts.length,
    rareMean: mean(counts),
    rareP50: percentile(counts, .5),
    rareP90: percentile(counts, .9),
    rareP95: percentile(counts, .95),
    rareMax: counts.at(-1),
    noRareRate: counts.filter((value) => value === 0).length / counts.length,
    threePlusRate: counts.filter((value) => value >= 3).length / counts.length,
    adjacentRareRunRate: adjacentRarePairs.filter((value) => value > 0).length / adjacentRarePairs.length,
    averageAdjacentPairs: mean(adjacentRarePairs),
    turnMean: mean(turns),
    turnP50: percentile(turns, .5),
    turnP90: percentile(turns, .9),
    turnMax: turns.at(-1),
    pausedSearchRate: endings.filter((ending) => ending === "paused_search").length / endings.length,
  };
  expect(audit.runs).toBe(1000);
  expect(audit.rareMean).toBeGreaterThanOrEqual(0.3);
  expect(audit.rareMean).toBeLessThanOrEqual(1.4);
  expect(audit.rareP50).toBeLessThanOrEqual(1);
  expect(audit.rareP90).toBeLessThanOrEqual(2);
  expect(audit.rareMax).toBeLessThanOrEqual(4);
  expect(audit.threePlusRate).toBeLessThanOrEqual(0.03);
  expect(audit.adjacentRareRunRate).toBe(0);
  expect(audit.noRareRate).toBeGreaterThan(0.1);
  expect(audit.pausedSearchRate).toBeGreaterThan(0.01);
  expect(audit.pausedSearchRate).toBeLessThan(0.35);
}, 30000);
