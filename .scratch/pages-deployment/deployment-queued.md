# GitHub Pages deployment queue

- [x] Enumerate active Pages workflows across the repository.
- [x] Inspect `github-pages` environment protection rules and branch policies.
- [x] Confirm Pages configuration, permissions, environment, dependency order, and artifact path.
- [x] Inspect recent deployment statuses for stale or overlapping deployments.
- [x] Identify the effective `actions/deploy-pages` timeout.
- [x] Reduce the pilot artifact without deleting source assets.
- [x] Update Pages actions to their current Node 24 releases.
- [ ] Verify the next GitHub-hosted deployment.

## Acceptance criteria

- The experiment branch has one native Pages deployment workflow.
- Superseded runs are cancelled through the shared `pages` concurrency group.
- The deploy job cannot begin before a successful build and artifact upload.
- Only `dist` is uploaded.
- Hidden legacy course media is excluded from the pilot artifact so Pages processing has adequate margin below the action's fixed ten-minute timeout.
