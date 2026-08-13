# Path signal expansion

## Intended behavior

- [x] Information style can recommend social discovery, independent research, or both without making either route exclusive.
- [x] Application strategy supports batch, precision, batch-then-precision, and precision-then-batch routes.
- [x] Career direction adds either a focused industry/skill route or an exploration route with broader opportunity discovery.
- [x] Background competitiveness prioritizes early interview preparation or resume positioning without making a judgement about employability.
- [x] Limited experience adds an experience-building directory with business competitions, Kaggle, and course-project polishing.
- [x] Every new visible node opens a localized starter Note.
- [x] Existing saved profiles migrate to neutral defaults and keep their current Path behavior.

## Public test seam

Tests use `buildPersonalizedPilotDraft` and inspect the resulting public Path nodes,
edges, and normalized personalization metadata. They do not test layout helpers or
component state.
