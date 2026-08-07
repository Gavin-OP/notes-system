# Notes System Frontend Language

This file defines frontend-local vocabulary. The complete product language is maintained in the backend repository root `CONTEXT.md`.

## Language

**Pilot Mode**:
The public JobTI and fall-recruiting experience that runs from static assets and browser-local state.
_Avoid_: Demo mode, frontend-only product

**Full-Product Mode**:
The broader API-backed Notes System experience retained behind product controls.
_Avoid_: Production mode

**Static Mirror**:
A frontend copy of approved backend-generated content used for static delivery.
_Avoid_: Source content, canonical content

**Product Mode Control**:
A configuration boundary that hides or exposes a coherent product surface without deleting its implementation.
_Avoid_: Dead-code flag
