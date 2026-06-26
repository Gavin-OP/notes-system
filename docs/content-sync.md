# Content Sync Boundary

This frontend repo supports a static GitHub Pages deployment, so it contains a
published mirror of generated backend content under `public/`.

## Source Of Truth

The backend repo is the canonical source for generated learning content:

| Canonical backend path | Frontend mirror path | Purpose |
| --- | --- | --- |
| `output/content/subjects/*/notes/current/` | `public/notes/` | Published markdown notes and note metadata |
| `output/graph/` | `public/graphs/` | Subject graph and network graph JSON |
| `output/image/` | `public/notes/image/` | Generated educational images referenced by notes |
| `output/content/subjects/*/narration/` | `public/audio/` | Published narration audio and manifests |
| `output/content/subjects/*/overview/syllabus.json` | `public/subjects/*/syllabus.json` | Subject overview data |

Do not manually author course content in the frontend mirror unless it is an
intentional temporary patch. Regenerate or maintain content in the backend first,
then sync it into this repo for static publishing.

## Current Frontend Scripts

- `npm run sync:backend-content -- --subject <subject>` copies backend outputs
  into the frontend mirror for one subject.
- `npm run generate:notes` rebuilds `public/notes-index.json` from the mirrored
  `public/notes/` tree.

The GitHub Pages workflow currently runs `npm run generate:notes` before build.

## Migration Direction

The long-term direction is:

1. Keep generation, maintenance, image creation, graph creation, narration, and
   publishing orchestration in the backend repo.
2. Treat frontend `public/` content as a deploy artifact or static mirror.
3. Eventually generate the mirror during CI or switch production fully to API
   mode, then stop tracking large generated mirrors in git.

Until that deployment path is ready, keep the mirrored `public/` content in place
so static hosting does not break.
