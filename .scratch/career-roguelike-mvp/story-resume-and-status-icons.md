# Career Run story, resume, and status icons

## Status

Completed

## Problem

- Some event prompts rely on an abstract “map/game” metaphor instead of describing a believable recruiting situation.
- Resuming a browser-saved run can leave the player on an event whose choices do not respond.
- Choices without a configured probabilistic outcome fall back to the same generic sentence, so the run does not read as a continuous story.
- The five status attributes are visually hard to scan because they do not have distinct icons.

## Scope

- Safely restore an in-progress run against the current event configuration.
- Give every playable choice a concrete consequence that follows from its event and selected action.
- Rewrite unclear event titles, descriptions, and choices in natural Chinese grounded in a realistic graduate job search.
- Add one accessible SVG icon for each of Time, Energy, Confidence, Profile, and Network.

## Acceptance criteria

- [x] A player can resume a serialized run and immediately resolve an available choice.
- [x] A stale or malformed saved event is repaired or discarded rather than rendering a broken game.
- [x] No event choice resolves to the generic “求职地图继续展开” fallback.
- [x] The opening and resume-writing events explain their real-world context without “地图加载” or “光标正在闪”.
- [x] Every event, choice, and outcome reads as one coherent recruiting scenario.
- [x] Each of the five status attributes has a distinct icon while retaining a visible text label.
- [x] Domain and page regression tests, lint, and production build pass.
