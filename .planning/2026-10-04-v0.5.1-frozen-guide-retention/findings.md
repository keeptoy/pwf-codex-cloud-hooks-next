# Findings: v0.5.1 frozen acceptance-guide retention

- The maintainer selected a concrete maintenance improvement rather than an identity-only Release: preserve frozen
  guides after role rotation and explain their navigation in docs/acceptance/README.md.
- Existing governance sections 11.1 and 12.1, the operator-guide lifecycle and repository boundary inventory require
  guide eviction with the role window; these are the directly affected owners.
- The existing risk policy already classifies the operator-guide template as RELEASE_MECHANICS; it must remain
  unchanged. Test/index/planning changes are source-only and cannot independently justify a Release.
- Current v0.5.0 is accepted. Its guide stays in the current entrypoint family until a real later role rotation.
  No retired guide restoration is needed to implement prospective retention.
- All guide paths remain excluded from runtime, installed inventory and Release ZIP. Historical retention needs
  an explicit bounded registry and byte evidence rather than allowing arbitrary extra version documents.

## Implementation design

- The acceptance index has separate current and frozen-history sections. A single marker-bounded Markdown table
  registers version-level historical guides by original local path, exact Git snapshot URL and raw SHA-256.
- The table starts empty: v0.5.0 is still accepted and no previously evicted guide is restored. Current navigation
  remains exactly the candidate/accepted guide set; extra files require valid historical registration.
- Repository tests compare historical bytes to the pinned Git blob, reject duplicate/current/missing/changed rows,
  and validate historical relative links inside that frozen snapshot. Current document links still use the worktree.
- Runtime/installer/classifier/policy/projector remain unchanged. The operator template updates retention only;
  neither Cloud channel nor retirement checkpoint moves.

## Local verification and candidate identity

- Complete Windows suite: 224 tests, 198 pass, 26 platform-specific skips, zero failures. Frozen guide bytes,
  current entrypoint uniqueness, historical registry/link negatives and accepted/fallback recovery passed.
- Deterministic local ZIP prechecks each contain 22 entries, size 84,518 bytes and SHA-256
  75c9eda81b6cc192df15346a5fb9bf60d2970e47ed53f3481887169778ac0a72. These are local development checks, not Cloud
  evidence or sealed/public assets.
- Canonical predecessor is accepted v0.5.0, not the v0.4.4 fallback. Both predecessor and Release contract raw SHA
  match the manifest; the zero-hash candidate bootstrap is stable on its second read-only check.
- The v0.5.0 guide and sealed bootstrap remain unchanged. Provenance now binds the already-existing sealed
  bootstrap to exact C2 so published oracles do not depend on current candidate package identity.
- Repeated Node/Bash sandbox restrictions were promoted to the environment profile as required by repository
  policy; this does not re-probe or claim new WSL/Cloud capabilities.
