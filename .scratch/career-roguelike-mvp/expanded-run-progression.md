# Career Run progression and alternative endings

## Status

Completed

## Source

`应届生开荒局_Roguelike_完整设计文档.md`, reviewed against the existing Career Run implementation and the public Personalized Path contract.

## Decision

Adopt the document's progression, opportunity-consumption, pity, hidden-route, and ending ideas where they make the current run more coherent. Keep the existing eight JobTI personas and browser-local Path handoff unchanged. Defer cross-run Legacy collectibles: they add a second progression system without improving the first-run Personalized Path.

## Public seams

- `createCareerRun({ seed })`
- `advanceCareerRun(state, choiceId)`
- `restoreCareerRun(savedState)`
- `summarizeCareerRun(state)`
- The standalone Career Run page from resume, through Choices, to Path handoff

## Acceptance criteria

- [x] A normal run supports twenty Events across preparation, application, selection, and closing stages.
- [x] Interview and final-round opportunities cannot silently expire; a matching Event appears within two Choices.
- [x] Repeated application, interview, and final-round failures receive visible probability support.
- [x] Offers are separated from the player's accept or decline decision.
- [x] Hidden momentum, wellbeing, and alternative-route progress change future Events and Endings.
- [x] Rare Event chains can lead to startup, freelance, academic, travel, stall, or startup-employee outcomes.
- [x] Ending and JobTI Persona remain independently calculated.
- [x] Every Ending still produces an explainable Personalized Path profile compatible with the current Learning Workspace.
- [x] Existing version-one browser saves restore safely or fall back without a blank page.
- [x] Domain tests, page tests, lint, and production build pass.

## Out of scope

- Cross-run Legacy cards or permanent stat bonuses
- Backend persistence, accounts, AI-generated Events, or paid APIs
- Learning Workspace, Path graph, questionnaire, or Note changes
