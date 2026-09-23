# Findings: Phase 5.1 B2a handoff triage boundary

## Starting evidence

- Clean `0.5.0-dev` branch after B1f local commit `53d542f`; no pre-existing user changes.
- Frozen B2 assigns A04 to handoff triage-vs-runbook presentation. A03 already parses the README map, quickstart and triage links; A05 separately excludes `MAINTAINER_HANDOFF.md` from the Release artifact. Both remain untouched.
- Current A04 assertions require exact H1/H2 titles, selected signal words anywhere, ban all backtick fences, any version/SHA, several prose phrases, numeric test results, command words and exact old runbook headings. These conflate explanatory examples with a second active authority.
- The handoff currently has five numbered roles: quickstart, triage, common safety mistakes, result classification, and stop/completion. No executable fence or current identity table exists. `assertHandoffNavigation` already binds the primary owner routes in sections 1–2.

## Open classification

- Decide which A04 protections require exact signal tokens in the result-classification role and which are merely prose style.
- Test an inserted executable install/Release/rollback block and an inserted current-status row as harmful; test a benign heading/prose or non-executable example as harmless.

## Selected boundary and local result

- The new guard requires one H1 and the ordered five section roles, not exact heading text. It parses the section 4 result table by signal role, ensures complete four-column rows and keeps technical diagnostic classes plus stop responses for unknown/failed states. Section 5 must retain stop routes for unknown worktree, trust and lifecycle gates.
- Executable-language fences and active install/Release/rollback command lines (including list items) are rejected. Current version-role tables, direct current-version claims and version/hash headings are rejected. Historical version/hash prose and a non-executable `text` example are allowed. A03 navigation and A05 Release exclusion remain unchanged.
- Harmful in-memory probes for an executable install fence, Git tag list step, current accepted-version row/prose claim, removed blocker stop and removed stop section fail; an equivalent safety heading plus historical/example prose passes.
- The guard does not claim to understand every possible Chinese/English current-state implication. Unstructured explanatory text that subtly creates a second authority without taking a recognizable role still needs maintainer review; that residual is not an excuse to loosen explicit stop and command checks.
- Final local evidence: focused architecture-contracts 16/16; full Windows suite 202 total, 176 pass, 26 Linux/POSIX-only skips, 0 fail. The first full run exposed a test-fixture defect: literal version strings in the new in-memory probes violated the independent source-neutrality test. The probes now derive their example version from `package.json`; no boundary was weakened. No handoff document repair was needed.
