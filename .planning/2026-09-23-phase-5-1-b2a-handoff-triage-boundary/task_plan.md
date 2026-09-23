# Task Plan: Phase 5.1 B2a handoff triage boundary

## Goal

Replace only A04's fixed handoff headings, whole-file signal/number/fence bans and runbook-shape checks with section-role and active-command boundaries. Prove a harmful executable/current-state handoff fails while an equivalent explanation or harmless example passes. Preserve A03 navigation and A05 Release exclusion.

## Authorization

- The maintainer said “好的，继续” after the bounded R21 handoff and B1 residual disclosure. Treat this as authorization for the first small B2 group, A04 only.
- Allowed: nearest A04 assertions in `tests/architecture-contracts.test.js`, scoped planning and minimal in-scope handoff repair if a real defect appears.
- Not allowed: A07/R13/R17, A20/R11 residuals, B3–B4/DEFER, production/contracts, Cloud/Release/remote writes, or frozen Discovery rewrite.

## Current phase

Completed locally: A04's wording-sensitive checks now use scoped handoff section, result-table, stop-route, command and current-role boundaries with harmful/harmless probes. The handoff itself is unchanged.

## Next Step

Hand off this bounded A04 result. Do not call B2 closed; A07/R13/R17 and all DEFER groups require their own scope and authorization.

## Phases

1. [x] Recover clean baseline, B2 inventory, A04 test seam, handoff owner and A03/A05 neighbors.
2. [x] Replace only provable A04 wording/style assertions with role/command checks and mutation probes.
3. [x] Run focused/full local regression, inspect exact diff and commit one local scope if clean.

## Stop conditions

- Handoff must not become a second installation, Release or rollback runbook or a current version/status authority.
- Keep README owner-map route, quickstart/triage links, diagnostic class and STOP semantics; no permission to execute Cloud/Release commands.
- Retain any safety claim that a structural guard cannot prove rather than making the test green by deletion.
