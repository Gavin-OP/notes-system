# Career Run standard-event content refresh

## Status

Implemented and verified

## Scope

Update Career Run standard recruiting Events according to `常规事件优化.md`. Preserve rare Events, Learning Workspace behavior, existing Event identifiers, stages, weights, tags, cooldowns, and probability models unless the approved document explicitly changes a Choice.

## Public seams

- `CAREER_EVENT_POOL` for approved player-facing Event configuration
- `createCareerRun({ seed, legacyId })`
- `advanceCareerRun(state, choiceId)`
- Standalone Career Run page rendering of configured Events and outcomes

## Acceptance criteria

- [x] The twenty-three documented standard Events expose the approved titles, descriptions, Choices, effects, behavioral signals, and outcome copy.
- [x] LinkedIn Choice B grants `profile +4`, `network +8`, `networking +3`, and `action +2`.
- [x] Technical Interview Choice C grants configured `time -4`, `energy +8`, `pacing +4`, and `resilience +2` without a probability bonus.
- [x] Existing success/failure outcome pairs and probability models remain intact.
- [x] The unchanged Assessment Centre Event remains available.
- [x] Automated simulations confirm that the updated LinkedIn and Technical Interview Choices do not become dominant strategies.
- [x] Unit/page tests, lint, and production build pass.

## Verification

- Vitest: 9 files, 84 tests passed.
- Focused standard-event suite: 3 files, 42 tests passed.
- Balance simulations: 2,000 runs per compared strategy for LinkedIn and Technical Interview choices.
- ESLint: 0 errors; 5 pre-existing warnings outside this change.
- Vite production build: passed.
