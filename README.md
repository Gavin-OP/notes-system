# Notes System Frontend

React frontend for Notes System and the public JobTI career-preparation pilot.

Project-level product, design, architecture, domain, governance, and technical documentation is maintained in the private [`notes-system-backend`](https://github.com/notes-system/notes-system-backend) repository. This README covers frontend setup, modes, static content, and deployment only.

## Runtime Modes

- **Pilot/static mode**: GitHub Pages reads published content under `public/`; JobTI and the fall-recruiting Path use browser-local storage and do not require the backend.
- **Full-product/API mode**: local or hosted builds use `VITE_API_BASE_URL` and product flags to call the FastAPI backend and expose broader product surfaces.

See `src/config/productMode.js` and `.env.example` for current flags. Do not expose paid AI/API features in the public pilot without an approved product/design change.

## Local Development

```bash
npm install
npm run dev
```

For API mode, run the backend separately and configure `VITE_API_BASE_URL` in `.env.local`.

## Verification

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

Use the checks appropriate to the change. GitHub Pages changes should include a production build and deep-link verification.

## Static Content Mirror

Generated Subject content is canonical in the backend. Frontend paths such as `public/notes/`, `public/graphs/`, `public/audio/`, and `public/subjects/` are publishing mirrors, not independent authoring sources.

```bash
npm run sync:backend-content -- --subject data-science
npm run generate:notes
npm run check:fall-locales
```

See [Content Sync Boundary](docs/content-sync.md). Hand-authored pilot content must have explicit ownership and must not be silently overwritten by backend sync.

## Deployment

The experiment branch is built by `.github/workflows/deploy-pages.yml` and published at [https://notes-system.github.io/notes-system/](https://notes-system.github.io/notes-system/). Vite uses the `/notes-system/` base path.

Before deploying, confirm that the workflow uploads `dist`, the SPA `404.html` fallback is present, locale checks pass, and static asset paths work under the repository base path.

## Repository Documentation

- `src/features/README.md`: frontend feature navigation.
- `docs/content-sync.md`: static mirror workflow.
- `CONTEXT.md`: frontend-local vocabulary only.
- `AGENTS.md`: coding-agent entry point.

Do not add a second project PRD, Design Document, ADR library, or roadmap here. Update the backend documentation source of truth first.
