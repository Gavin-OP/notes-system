# notes-system

React frontend for Notes System. The app can run in two modes:

- **Static mode** for GitHub Pages, reading published mirrors under `public/`.
- **API mode** for local development, using `VITE_API_BASE_URL` to call the FastAPI backend.

Generated subject content is owned by the backend repo. Files under `public/notes/`,
`public/graphs/`, `public/audio/`, and `public/subjects/` are frontend publish mirrors,
not canonical authoring sources.

## Usage

1. Open command prompt (terminal) inside the cloned repository folder. 

2. Install all required dependencies using the command:

    ```
    npm install
    ```

3. Open the website locally using the command:

    ```
    npm run dev
    ```

    or

    ```
    npx vite
    ```

    To use API mode, run the backend separately and set `VITE_API_BASE_URL` in
    `.env.local`.

## Static content mirror

The backend is the canonical source for generated notes, graphs, images, audio,
and subject overview data. This frontend keeps a static mirror for GitHub Pages.

Sync current backend outputs into the frontend mirror with:

```bash
npm run sync:backend-content -- --subject data-science
npm run generate:notes
```

See `docs/content-sync.md` for the source-of-truth rules and migration plan.

4. Publish and Deploy  

    As long as push in `main` branch or pull request to `main` branch is detected, the website will be automatically built, deployed to `gh-pages` branch and published to [https://gavin-op.github.io/notes-system/](https://gavin-op.github.io/notes-system/).
