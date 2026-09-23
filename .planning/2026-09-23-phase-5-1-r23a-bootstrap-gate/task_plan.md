# Task Plan: Phase 5.1 R23a candidate-bootstrap selection gate

## Goal

Implement the separately approved R23a slice: verify that the active Source/Candidate 4.1 tutorial selects the unique candidate bootstrap from the manifest-named Release contract and invokes that selected script with local ZIP URL/SHA overrides. Replace only the directly covered Wiki selection-chain prose assertions; prove harmful changes fail and equivalent explanation changes pass.

## Authorization

- The maintainer said to continue after the R23a prioritization audit's specific next-gate proposal.
- This gate may edit the nearest repository governance test, the Wiki's stable link to template 4.1, the open Phase 5.1 draft evidence, and this planning scope.
- It does not authorize changes to the Cloud template executable protocol, machine contracts, bootstrap, materializer, production, Cloud state, Release, or remote refs.
- R23 remainder, R24, and the other 16 DEFER groups stay intact. Discovery remains `DRAFT / OPEN`.

## Current phase

Completed locally: bounded R23a guard, regression, Discovery-draft evidence, and diff review. No Cloud or remote action.

## Next Step

No further implementation within this gate. Keep Phase 5.1 Discovery `DRAFT / OPEN`; obtain a separate decision before another DEFER slice or formal Discovery freeze.

## Phases

1. [x] Recover owner, active code block, test guards and baseline; specify exact R23a slice.
2. [x] Add harmful/harmless probes, implement a scoped non-executing check, and replace only covered R23a prose assertions plus the Wiki owner link.
3. [x] Run focused and full local regression, update open Discovery evidence, inspect exact diff, and commit locally.

## Stop conditions

- Stop if wrong selected script, missing exactly-one admission, missing validation, wrong execution target, or missing URL/SHA override can pass via decoy text.
- Do not execute Markdown code as a test oracle; the checker is static and must state its parser limitations.
- Do not touch R23's other materialization, zero-hash, public-download, or published-identity assertions or infer Cloud PASS.
