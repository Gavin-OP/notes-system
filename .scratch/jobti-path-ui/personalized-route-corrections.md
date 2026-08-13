# Personalized route corrections

- [x] Remove target-company-type questions, profile data, and generated Path nodes.
- [x] Generate early-internship nodes only from explicit Path selections.
- [x] Model Job Board, Company Career Page, and AI Job Search as independent children.
- [x] Keep the batch and precision application routes as separate ordered chains.
- [x] Keep the student route as Campus Recruiting → Career Fair → Alumni Networking.
- [x] Verify the generated graph, JobTI profile, localization, tests, and production build.

## Follow-up: concrete content

- [x] Replace every remaining planned-only node with a concrete Note route.
- [x] Add Simplified Chinese, Traditional Chinese, and English starter Notes.
- [x] Collapse finance-certificate editing into one multi-select decision.
- [x] Verify node labels, locale coverage, lint, tests, and production build.

## Public test seam

Tests exercise the questionnaire-to-Path boundary through `buildJobTiPathProfile`,
`buildPersonalizedPilotDraft`, and `buildConstellationElements`. They assert visible
nodes and edge relationships rather than internal layout helpers.
