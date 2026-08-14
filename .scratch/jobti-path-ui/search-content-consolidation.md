# Search and skill content consolidation

- [x] Move the finance-certificate comparison and decision guidance into the general skill-supplement note.
- [x] Remove the redundant finance overview node while preserving optional individual certificate notes and legacy URLs.
- [x] Rename the social-media Path node and give it an independent note covering platform roles, verification, and decision-making.
- [x] Merge Networking Event guidance into Coffee Chat / Networking and migrate the legacy option to the combined route.
- [x] Expand the Job Board note with common Mainland China and Hong Kong entry points, using official links and employer-site verification guidance.
- [x] Update Simplified Chinese, Traditional Chinese, and English content, Path tests, and the generated notes index.
- [x] Run focused tests, locale validation, lint, and production build.

## Source boundary

Platform descriptions should remain factual and lightweight. Social posts and employee reviews are secondary evidence; official company career pages, current job descriptions, and direct recruitment communications remain the authoritative sources for application facts.

## Verification

- Focused Vitest suite: 31 tests passed.
- ESLint: passed with five pre-existing warnings and no errors.
- Production build: passed.
- Locale checker: the new and edited notes pass; the command remains blocked by six pre-existing malformed locale files for business competition, course-project polish, and Kaggle competition.
