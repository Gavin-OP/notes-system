# Creator route and Legacy expansion

## Status

Implemented and verified

## Scope

Extend Career Run only. Do not change JobTI or the Learning Workspace.

## Product decisions

- Add a low-probability Content Creator hidden route that can emerge only after the player has accumulated real recruiting experience.
- The route contains four non-repeating Events: publishing a recruiting essay, gaining returning readers, receiving an editorial commission, and deciding whether creation becomes a serious path.
- A completed route can resolve to a separate `content_creator` Ending. Keeping writing as a side activity must not force that Ending.
- Rare Events retain their original recruiting category but are visually marked with a category-to-rare gradient and an explicit `稀有事件` label.
- Expand the Legacy catalog from twelve to twenty-one items. Exactly three eligible items are offered after a run and at most one is equipped.
- Direct Attribute bonuses remain approximately 5–10 points; probability bonuses remain 4–7%; route-weight Legacies use a final event-weight multiplier of 1.30 and never bypass Event Requirements.
- One-shot Legacies track whether they have fired in the current run. Trigger state is browser-save compatible.
- Explicit product direction continues to supersede the source design where they differ: a visible personality result remains removed and zero Time or Energy still ends a run immediately.

## Acceptance criteria

- [x] The creator route stores progress in configured route state, requires prior recruiting experience, and exposes a coherent four-Event story.
- [x] `content_creator` is resolved only after the player explicitly chooses to pursue creation and reaches the configured progress threshold.
- [x] Creator progress remains available to Personalized Path generation as project evidence without changing Learning Workspace code.
- [x] Rare Event cards show an accessible rare label and a category-aware gradient.
- [x] All twenty-one Legacy definitions have their documented names, effects, and unlock rules.
- [x] The five route Legacies apply event-weight multiplier `1.30` without bypassing route Requirements.
- [x] Final-rest, low-Energy battery, concentrated coffee, interview reflection, application bonus, authentic interview, and group-interview Legacies respect their one-shot or capped behavior.
- [x] Every Legacy is simulated for at least 1,000 seeded runs and compared with a no-Legacy baseline.
- [x] No Legacy increases accepted-Offer probability by more than roughly eight percentage points; route-ending rates remain within the agreed multiplier unless the baseline is too rare for a stable ratio.
- [x] Tests, lint, and production build pass.

## Verification notes

- The deterministic balance suite runs 1,000 games for the baseline and each of the twenty-one Legacies (22,000 games total).
- Route-ending caps use an absolute two-percent allowance when the baseline produces too few samples for a meaningful ratio.
- The concentrated-coffee check covers Energy variance and confirms it is not a stable accepted-Offer improvement over the battery or boundaries Legacies.
