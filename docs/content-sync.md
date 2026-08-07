# Frontend Content Sync

This repository contains a static delivery mirror for GitHub Pages. Canonical generated content and the formal publishing policy live in the private backend repository:

- `docs/architecture/content-publishing.md`
- `docs/frontend-publish-boundary.md`
- ADR-0003: canonical backend content and static frontend mirror

## Mirror Mapping

| Backend output | Frontend mirror |
| --- | --- |
| `output/content/subjects/*/notes/current/` | `public/notes/` |
| `output/graph/` | `public/graphs/` |
| generated images | `public/notes/image/` |
| narration output | `public/audio/` |
| subject overview/syllabus | `public/subjects/*/syllabus.json` |

## Publish One Subject

From the backend repository:

```bash
python3 scripts/publish/sync_frontend_content.py \
  --frontend-root /Users/lyukexin/Desktop/genai-workflow-mvp/notes-system \
  --subject data-science
```

Then from this repository:

```bash
npm run generate:notes
npm run check:fall-locales
npm run build
```

## Rules

- Review and validate canonical artifacts before syncing.
- Do not manually fork generated content in the mirror.
- Keep deliberately hand-authored pilot Notes explicitly owned and protected from accidental overwrite.
- Treat missing/deferred media honestly; never publish placeholder success.
- Commit backend canonical changes and frontend mirror changes separately for traceability.
