# Rebalance JobTI scoring

- [x] Preserve the user's revised online-test and finance-certificate copy.
- [x] Let the finance-certificate answer contribute to personality scoring as well as Path generation.
- [x] Rebalance primary and secondary evidence across all scored questions.
- [x] Remove the structural advantage previously given to LinkedIn / radar.
- [x] Run focused tests, the full unit suite, and the production build.

## Acceptance criteria

- Each scored question represents all eight JobTI types exactly once.
- Across the full quiz, primary and secondary appearances differ by no more than one between types.
- Non-scored Path answers do not change the personality result.
- Finance-certificate choices remain distinct and still generate the expected Path branch.
