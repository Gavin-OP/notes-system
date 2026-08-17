# Path branch integrity

## Reported behavior

- Career-direction helper nodes appear below Role and Market Research without an explicit Path branch decision.
- Selecting an application route removes the visible main connection from Applications to Online Assessments.
- The application strategy editor still exposes the legacy JobTI default option.
- Experience-building appears connected between Applications and Online Assessments.

## Acceptance criteria

- [x] Career direction can still influence defaults without creating the three deprecated market child nodes.
- [x] Applications always retains its direct main-line edge to Online Assessments.
- [x] Application routes remain optional side routes and converge back without replacing the main line.
- [x] The application strategy picker does not expose the legacy automatic option.
- [x] Experience-building remains a Profile side branch and never becomes part of the visual backbone.
- [x] Regression tests and production build pass.

## Root causes

- Career-direction defaults were also materialized as three redundant Path nodes.
- Application branches replaced the backbone edge instead of supplementing it.
- `experience-building` was accidentally listed in the visual backbone despite being a Profile child.
- The legacy automatic application strategy remained in the shared UI option list.

## Verification

- 45 Vitest tests passed, including four regression tests for the reported symptoms.
- ESLint completed with no errors and five pre-existing warnings.
- Production build and diff checks passed.
