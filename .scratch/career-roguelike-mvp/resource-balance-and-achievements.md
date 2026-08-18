# Career Run resource balance and achievements

## Status

Implemented

## Problem

The first expanded run makes Time feel expensive while Energy and Confidence rarely create meaningful pressure. Reaching zero Time does not currently end the run, several decline or recovery choices charge implausible Time costs, the result page still presents a JobTI personality, and the proposed run achievements / Legacy loop is absent.

## Decisions

- Explicit user direction supersedes the source design's two-turn zero-Time grace period: Time or Energy reaching zero immediately resolves the run.
- JobTI behavioral dimensions remain hidden inputs to Personalized Path generation, but no personality label is shown as a game result.
- Add an earned-achievement summary and the twelve-item browser-local Legacy system. The player chooses one unlocked Legacy after a run; it affects the next run only.
- Use a two-step low-resource warning for Time and Energy only: yellow at 35 or below, red at 15 or below.
- Show the equipped Legacy during the next run, beneath a directly affected Attribute or in a separate status note for probability / route modifiers.
- Do not imply a fixed run length in the UI; remove the overall turn progress bar.
- Keep all changes inside `src/features/careerGame/**`.

## Acceptance criteria

- [x] The landing-page Graduate illustration is removed without leaving an empty layout column.
- [x] A Choice that reduces Time or Energy to zero completes the run immediately.
- [x] Declining or skipping a real-world activity has zero or minimal Time cost.
- [x] Energy and Confidence gains are restrained, rejection has a visible Confidence cost, and simulation does not collapse into one dominant ending.
- [x] The result page contains no JobTI personality result.
- [x] The result page shows run achievements, a generated story summary, and three eligible Legacy rewards.
- [x] Selecting a Legacy persists it locally and applies its documented modifier to the next new run.
- [x] Personalized Path output remains available and uses hidden behavior signals rather than a visible personality result.
- [x] Low Time and Energy meters change from yellow to red while Confidence, Profile, and Network retain their normal colors.
- [x] The equipped Legacy and its effect remain visible during the next run.
- [x] The play screen does not show a fixed overall run progress bar.
- [x] Domain tests and page tests pass.
- [x] Lint and production build pass.
