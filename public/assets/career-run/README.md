# Career Run image assets

The Career Run is fully playable without images. Add reviewed assets here using the stable names below; do not import them into JavaScript bundles.

```text
public/assets/career-run/
├── cover/
│   └── hero.webp                     1600 × 900
├── events/
│   ├── profile/{event-id}.webp       1200 × 800
│   ├── application/{event-id}.webp   1200 × 800
│   ├── networking/{event-id}.webp    1200 × 800
│   ├── interview/{event-id}.webp     1200 × 800
│   └── offer/{event-id}.webp         1200 × 800
├── endings/{ending-id}.webp          1200 × 1200
└── personas/{type-key}.webp          800 × 800
```

Use the exact Event ids from `src/features/careerGame/config/eventPool.js`, such as `resume-first-draft.webp`, `dream-job-deadline.webp`, or `hr-screening.webp`. Ending ids and Persona type keys are defined in `gameConfig.js`.

Prefer WebP, keep each Event image below 250 KB, avoid embedded text, and leave visual breathing room around the subject for responsive cropping. Every image needs a short Chinese alt-text entry when it is enabled in Event configuration.
