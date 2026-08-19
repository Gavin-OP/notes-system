# Career Run rare-event round two

## Status

Implemented and verified

## Scope

Update Career Run rare Events and their domain behavior only. Do not change JobTI or the Learning Workspace.

## Public seams

- `createCareerRun({ seed, legacyId })`
- `advanceCareerRun(state, choiceId)`
- `summarizeCareerRun(state)`
- Standalone Career Run page rendering of configured Events and outcomes

## Product decisions

- Retain twenty-four non-repeating rare Events with the player-facing copy and balanced effects defined in `稀有事件优化.md`.
- Add declarative state-dependent probability rules for startup conflict, editorial independence, and improvised interview answers.
- A failed unilateral startup push closes the startup route without removing previously earned Profile or other Attributes.
- Split Creator progress into `careerCreator` and `writingCreator`, while retaining `creator` as the route-progression gate.
- The final Creator Event exposes one serious-creation Choice; its outcome and Ending candidate are determined by the stronger hidden Creator branch.
- Neutral and failed outcomes remain useful story developments rather than universal punishment.

## Acceptance criteria

- [x] All twenty-four Events match the approved titles, descriptions, Choices, effects, route changes, and outcomes.
- [x] The three conditional probability Choices expose both success and failure outcomes with state-dependent rates.
- [x] Startup closure prevents later startup Events while preserving earned Attributes.
- [x] Both Creator branches can produce their corresponding Ending candidate.
- [x] Event history records neutral, successful, and failed outcomes explicitly.
- [x] Automated simulations cover conditional-outcome rates and 1,000 varied full runs without destabilizing accepted Offer, Still Searching, or Burnout proportions.
- [x] Unit/page tests, lint, and production build pass.

## Verification

- Vitest: 8 test files, 79 tests passed.
- Rare-event simulation: 2,000 runs per probability state and 1,000 varied full runs passed.
- ESLint: 0 errors; 5 pre-existing warnings outside Career Run.
- Vite production build: passed.
