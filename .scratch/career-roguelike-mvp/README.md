# Career Roguelike MVP

## Status

Implemented MVP

## Goal

Create a standalone, browser-local Career Run that turns recruiting choices into a separate Ending, JobTI Persona, and editable Personalized Career Path.

## Public seams

- `createCareerRun({ seed })`
- `advanceCareerRun(state, choiceId)`
- `summarizeCareerRun(state)`

Tests exercise only these interfaces and the standalone route behavior.

## Acceptance criteria

- [x] A run starts from the same Graduate baseline and lasts roughly 10–14 Events.
- [x] Event selection is deterministic for a seed but weighted by stage, Attributes, history, and resources.
- [x] Every Event has two to four non-obviously-correct Choices.
- [x] Choices visibly change Attributes, counters, future eligibility, and hidden behavioral dimensions.
- [x] Duplicate Events are prevented and cooldown tags affect selection.
- [x] Ending and JobTI Persona are resolved separately.
- [x] The result includes run statistics, strongest strategy, bottleneck, and a generated editable Path profile.
- [x] Completing the run can save a browser-local Path draft without a backend or paid API.
- [x] The standalone page is keyboard accessible, responsive, reduced-motion aware, and independent of the Learning Workspace and JobTI questionnaire routes.
- [x] Event content and tuning values live outside React modules.

## Out of scope

- Fifty fully balanced Events in the first slice
- Equipment, currency, combat, map movement, or progression trees
- Backend persistence, accounts, multiplayer, or AI-generated Events
- New career Notes
