# Task Plan: Phase 5.3 G4 shadow admission

## Goal

Keep Phase 5.3 at the G4 admission boundary until a real eligible low-risk Release train exists, then allow a
separately authorized shadow comparison between the V3 advisory plan and the still-operative FULL workflow.

## Authorization and scope

- The maintainer directed work back to the frozen Phase 5.3 history after the `v0.5.0` FULL Release closed.
- This authorizes recovery of the G4 admission contract and this planning handoff only. It does not authorize G4
  shadow execution, a successor version/train, source changes, C0, Cloud, publication, reduced-lane enablement or
  any remote write.
- `v0.5.0` is not an eligible sample: its candidate delta was `PRODUCT_OR_SECURITY`, and its FULL train is closed.
- An empty, identity-only or sample-manufactured train is not eligible. A real independently needed semantic delta
  must classify `PACKAGE_DOC_ONLY` or `RELEASE_MECHANICS` with no unknowns before separate G4 authorization.
- Until G5 is independently completed, the current ROADMAP FULL workflow remains the only execution authority;
  G4 may only shadow it and may not skip any operative gate.

## Current phase

`WAITING_FOR_ELIGIBLE_TRAIN`. G1, G2 and G3 are complete. The accepted closeout base is
`d4dd150dea205951090b2b5c56fe140a80bebc91`; local `HEAD` and `origin/0.5.0` both resolve to that commit, so no
successor delta currently exists.

## Next Step

Wait for a genuine low-risk semantic change. Before any G4 work, the maintainer must identify the intended change
and successor train, provide separate G4 authorization, and approve an exact candidate head that the V3 classifier
admits as `PACKAGE_DOC_ONLY` or `RELEASE_MECHANICS` without unknowns.

## Gates

1. [x] Recover the frozen G4 contract, current programme state and completed G1--G3 evidence.
2. [x] Confirm the `v0.5.0` FULL train is closed and cannot be reused as the low-risk shadow sample.
3. [x] Confirm no successor delta or authorized successor Release train currently exists.
4. [ ] Admit one real eligible candidate only after exact base/head classification and separate maintainer authorization.
5. [ ] Run the advisory-required plan and the complete current FULL workflow in shadow on the same exact identities.
6. [ ] Reconcile omissions, false-fast count, elapsed/operator evidence and Host/profile/asset identity; close G4 only
   if every frozen exit condition passes.

## G4 admission conditions

- The change exists for a real maintenance/Product reason independent of obtaining a G4 sample.
- The accepted base and candidate head are explicit immutable commits; no moving branch or `Latest` inference.
- The V3 result has a complete explainable delta, no unsafe type/mode, no unknowns, and lane
  `PACKAGE_DOC_ONLY` or `RELEASE_MECHANICS`.
- Package/version/Release identity closure is complete whenever the candidate is publishable.
- Classifier, owner policy and projector self-change are absent; otherwise the candidate stays FULL and is not a
  qualifying low-risk sample.
- The successor version/train and G4 shadow are separately authorized in current planning before construction.

## G4 exit conditions

- The same exact low-risk source and assets complete both identity channels under the current FULL authority.
- The advisory shadow records all five evidence dimensions and omits no evidence that the FULL run shows relevant.
- Historical and live false-fast count remains zero.
- Host/profile, checkout, ZIP/bootstrap, URL/SHA and installed predecessor identities match the classification key.
- Any anomaly aborts the shadow conclusion and restarts under the stricter FULL requirements.
- The result does not enable a reduced lane; G5 remains a separate decision and authorization.

## Stop conditions

- Stop while no real eligible train exists; do not create a version-only, empty-semantic-delta or artificial doc
  edit to obtain a sample.
- Stop if the candidate classifies `PRODUCT_OR_SECURITY`, `SOURCE_ONLY_GOVERNANCE` or contains any unknown.
- Stop before implementation, versioning, C0, Cloud or Release without the two missing inputs: exact eligible
  candidate scope and explicit maintainer G4 authorization.
- Stop on dirty or overlapping user changes, identity drift, Host/profile mismatch or any request to skip the FULL
  workflow before G5.

## Errors

| Error | Resolution |
|---|---|
| None. | Current state is an intentional admission wait, not an execution failure. |
