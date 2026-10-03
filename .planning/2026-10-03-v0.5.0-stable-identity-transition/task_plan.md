# Task Plan: v0.5.0 stable identity transition

## Goal

Change the local development train identity from `0.5.0-dev` to stable candidate identity `0.5.0`, including the
canonical version/hash/bootstrap cascade and local Git branch rename, without misclassifying the accumulated
v0.5 product changes as a Phase 5.3 low-risk sample or entering C0/Cloud/Release.

## Authorization and scope

- The maintainer explicitly requested removal of the `dev` suffix and local branch rename from `0.5.0-dev` to
  `0.5.0`.
- Allowed: recover the current Release/version authorities; rename the local branch; update the exact stable
  version identity owners and their integrity references; rename/render the tracked zero-hash candidate bootstrap;
  update version-delta documentation required by existing authority; add/update tests; run local verification; make
  a scoped local commit.
- Not allowed: label this train low risk; start G4/G5; create or declare C0/C1/C2; seal non-zero asset bytes;
  publish, tag, push, create a Release, promote Latest, run Cloud, or make any remote write.

## Current phase

Complete: the stable identity cascade, retained FULL classification and full local verification are closed.

## Next Step

No further action is authorized in this scope. C0, G4/G5, Cloud, tag, publication and remote writes remain separate.

## Phases

1. [x] Recover current version/Release authorities, branch state and exact identity owner set.
2. [x] Freeze the stable identity cascade and add/adjust nearest boundary tests if needed.
3. [x] Rename the local branch and apply the canonical `0.5.0` source/hash/bootstrap transition.
4. [x] Prove identity closure, deterministic ZIP/candidate boundaries and FULL risk classification from v0.4.4.
5. [x] Run risk-proportionate/full regression, reconcile planning/docs and create a scoped local commit.

## Exit conditions

- Local branch is exactly `0.5.0`; no remote branch/ref is created, moved or deleted.
- Every supported version identity owner says `0.5.0`; obsolete tracked `0.5.0-dev` bootstrap identity is absent.
- Manifest integrity references and candidate bootstrap bytes are canonical; the candidate bootstrap retains the
  64-zero development checksum and is not a sealed publication asset.
- Release ZIP inputs remain contract-driven and deterministic; no ignored publication asset is treated as released.
- Classification from the accepted v0.4.4 closeout has a complete canonical identity closure plus residual product
  delta and remains `PRODUCT_OR_SECURITY` with FULL required gates. The unaccepted dev commit is not treated as an
  installed predecessor or Release baseline.
- Local validation passes and the change is saved in one scoped local commit; all remote/Cloud/Release state is
  unchanged.

## Stop conditions

- Stop if stable identity cannot be produced by existing canonical renderer/materializer rules.
- Stop if any requested edit would seal a ZIP hash, declare C0/PASS, change current ROADMAP workflow or require a
  remote write.
- Stop if the v0.4.4 accepted-closeout comparison is classified below `PRODUCT_OR_SECURITY`.
- Stop if any tool or document attempts to change the installed predecessor from accepted `0.4.4` to unaccepted
  `0.5.0-dev`.
- Stop if unrelated or overlapping user changes appear.

## Errors

| Error | Resolution |
|---|---|
| Node test runner returned `spawn EPERM` inside the Windows sandbox | Re-ran the same tests in the approved external execution profile; no assertion was bypassed. |
| First full suite: two Phase-route assertions rejected an exact stable version/wording | Classified as test drift and extended the guards to accept exact or wildcard series plus explicit development/stable candidate states. |
| Git Bash could not create its signal pipe inside the sandbox | Re-ran both bootstrap `bash -n` checks outside the sandbox; both passed. |
