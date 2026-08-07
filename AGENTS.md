# Frontend Agent Entry Point

Formal engineering work is tracked in GitHub Issues. Local `.scratch/` files may be used as temporary agent notes but are not authoritative and must not replace an Issue, PRD, Design Document, or ADR.

Before changing behavior, read the project documentation in the sibling/private `notes-system-backend` repository:

1. `docs/agents/CONTEXT.md`
2. the relevant PRD
3. the relevant Design Document
4. relevant active ADRs
5. the existing frontend implementation and tests

Project-level documentation is owned by the backend repository. This frontend may keep only repo-local setup, deployment, publishing, and implementation guidance. Follow documentation-first development and update the source of truth before modifying product behavior, contracts, data, architecture, security, privacy, or deployment.
