# Task Plan: Phase 5.1 B2b Operator Guide lifecycle

## Goal

Replace only A07's wording-sensitive Operator Guide chapter, guide-count and freeze-lifecycle assertions with section-role and lifecycle-relation checks. Demonstrate that a harmful change to a guide role or freeze boundary fails and an equivalent explanation passes. Preserve A06 stable anchors/status tokens and A08 Release/Product role checks.

## Authorization

- The maintainer said “继续” after the bounded A04 handoff. This authorizes the next small B2 group, A07 only.
- Allowed: A07's nearest assertions in `tests/architecture-contracts.test.js`, scoped planning, and minimal in-scope template repair if a real defect is found.
- Not allowed: R13/R17, A06/A08 weakening, other inventory groups, production/contracts, Cloud/Release/remote writes, or frozen Discovery rewrite.

## Current phase

Completed locally: A07 now checks anchored section roles, Product guide counting and the Pre-run → checkpoint → Final → freeze relation. The template itself is unchanged.

## Next Step

Hand off this bounded A07 result. Do not call B2 closed; R13/R17 and DEFER groups still require their own scope and authorization.

## Phases

1. [x] Recover clean baseline, read repository entry docs/planning and inspect A07 template/test seam.
2. [x] Replace only provable A07 wording checks with role/lifecycle checks and mutation probes.
3. [x] Run focused/full local regression, inspect exact diff and commit one local scope if clean.

## Stop conditions

- A missing or wrong Discovery/guide-count rule, premature freeze or erased final status must not pass.
- Preserve Pre-run/channel/Final role anchors and machine-readable tokens, Release two-channel distinction and C0/C1/C2 identity order.
- Retain any safety claim that a structural guard cannot prove. Do not expand to R13/R17 or Cloud/Release operations.
