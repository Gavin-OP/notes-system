# Feature Organization

Feature folders own product-specific pages, components, hooks, API adapters, and local libraries. Shared code belongs in `src/shared` only when it is generic and used by more than one feature.

- `notes`: note reading, markdown rendering, narration, annotations, completion state.
- `navigation`: learning tree, note index utilities, route selection helpers.
- `mindmap`: radial/network/3D concept graph views and concept review helpers.
- `assistant`: global assistant UI, assistant API calls, learning-path actions.
- `profile`: learner account/profile, achievements, onboarding/tours.
- `careers`: career taxonomy, recommendations, job detail, career onboarding widgets.
- `admin`: admin authentication, layouts, pages, and API client.
- `subjects`: subject overview/database pages and subject-level data helpers.
- `search`: search page, modal, and search API adapter.

Legacy paths under `src/pages`, `src/common`, `src/admin`, `src/redux`, and `src/utils` are compatibility shims during the migration. Prefer importing from `src/features`, `src/shared`, and `src/app` in new code.
