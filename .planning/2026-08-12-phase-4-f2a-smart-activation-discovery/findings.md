# Findings: Phase 4 F2A Smart Activation Discovery

## Entry boundary

- Entry commit is `4a24b66`; F1 foundation and exact Source/Candidate/no-live Cloud acceptance are complete.
- F2A is the first gate allowed to create a production call edge to the existing `.mode` seam and the first gate that may change plan selection behavior.
- F2A must remain strictly below F2B: no nonce, attestation, ledger or autonomous behavior; `gate` remains denied.
- Legacy remains the default. Old upstream tokens cannot become managed opt-in merely because the candidate was upgraded.

## Questions under review

- What exact `.mode` grammar makes `codex-managed-v1` the final activation commit point without ambiguity?
- Does smart reuse pristine `inject-plan.sh` rendering from a normalized private snapshot, or should owned code render an equivalent bounded smart section?
- How does the adapter advertise capability without deciding workspace state, and how does owned-plan select the effective profile?
- Which invalid/tampered/racy states produce bounded non-injecting advisory, and which absent/unarmed states remain ordinary legacy?
- What user workflow prepares, commits, confirms, disarms and re-arms smart mode without managed runtime writing workspace files?
- Which tests belong to F2A local/Linux acceptance and which Fresh/Resume/rollback claims must remain for F3?

## P0 evidence refresh

- Current plan-v2 schemas already admit ordered capabilities `[legacy]`, `[legacy, smart]`, `[legacy, smart, autonomous]` and bounded `effective_profile`; F2A should not rotate schema merely to activate an already reserved smart capability.
- Adapter currently produces only `[legacy]`; owned-plan independently fixes `SUPPORTED_PROFILES=(legacy,)` and rejects wider requests before state capture. F2A therefore has two deliberately separate capability locks to change atomically.
- The inactive seam safely reads only `.mode` (256-byte cap, regular/single-link/no-follow/race validation) and normalizes the versioned token plus `inject-smart|autonomous|gate`. It reads no nonce, attestation or ledger.
- Pristine `inject-plan.sh` already supports structure-aware smart rendering through either `PWF_INJECT=smart` or `inject-smart` in `.mode`. Smart alone does not enable autonomous/gated behavior and keeps the legacy raw progress tail.
- Current owned-plan copies only normalized task/progress bytes into a private snapshot and invokes pristine rendering there. It never copies `.mode`, so F2A can pass a runtime-owned smart decision to the pristine renderer without executing workspace code.
- The admitted bundle contains no `init-session.sh` or other writer. User-side state creation must remain outside the production trusted graph.
- Official OpenAI documentation search did not surface a public `SessionStart`/`UserPromptSubmit` Hooks ABI page. Current Host/event assumptions remain based on the repository public ABI snapshot, dated Cloud fixtures and the exact F1 no-live Cloud result; Discovery must not claim fresh official-web confirmation.

## P1 current and upstream inventory

- The pristine v3.8.2 smart path is already the canonical renderer. It accepts `PWF_INJECT=smart`, emits a structured selection when the plan uses `### Phase` sections, and deliberately falls back to legacy head-N for plans without those headings.
- Smart does not require nonce, attestation or ledger and does not imply autonomous/gated. The admitted `ledger-summary.sh` remains future F2B inventory but has no F2A call edge.
- Current managed execution strips ambient `PWF_INJECT`; this is an important legacy invariant. F2A may add `PWF_INJECT=smart` only to the private child environment after owned state admission.
- Upstream `init-session.sh` can write autonomous/gated `.mode`, nonce and attestation state, but it is not admitted into the managed bundle and has no smart-only initializer. F2A therefore must define a user-side activation action without importing that writer into production.
- The current inactive same-file normalizer is a useful F1 seam, not a final F2A protocol. To discover a managed token inside `.mode`, production would have to read every old `.mode`; an old symlink, hard link, oversized file or invalid UTF-8 would then turn an otherwise legacy upgrade into refusal. That violates the stronger requirement that pre-existing upstream markers remain inert until explicit managed opt-in.

## P2 activation and disarm protocol

Discovery selects a separate activation commit point:

- exact plan-local path: `.pwf-codex-managed`;
- exact content: `codex-managed-v1\n`;
- upstream `.mode` remains the profile selector and F2A admits only exact `inject-smart\n` after the activation file is valid;
- the managed token is explicit upgrade consent, not a secret or identity credential.

User-side order is:

1. resolve and verify the intended plan directory;
2. prepare canonical `.mode` as `inject-smart\n` using a same-directory temporary file and atomic rename;
3. verify the prepared profile;
4. write `.pwf-codex-managed` last, also through same-directory atomic rename;
5. confirm both exact files, then run a documented read-only probe through the installed owned-plan request/result path and require
   `outcome=context_emitted`, `effective_profile=smart`, `advisory=null`; the probe reuses production admission instead of a second parser;
6. disarm by removing only `.pwf-codex-managed`; `.mode` may remain and becomes inert;
7. re-arm only after repairing/rechecking `.mode`, then atomically recreate the activation file last.

The Hook and owned runtime never perform those writes. F2A documentation must give the atomic user-side procedure and the read-only
confirmation probe, but no workspace writer enters managed dispatch. A bundled writer or second status parser is not required for the
first activation gate and would be a separate product/trust decision.

State semantics are exact:

| State | Decision |
|---|---|
| activation file absent | legacy; do not open `.mode`, so old valid or unsafe upstream markers stay inert |
| activation path present but unsafe/oversized/invalid/raced | `invalid_request` + bounded state advisory; no plan/catch-up content |
| activation file exact, `.mode` missing/empty | `state_incomplete`; no legacy downgrade |
| activation file exact, `.mode=inject-smart\n` | smart selected |
| activation file exact, `.mode` contains autonomous/gate | `profile_unsupported`; F2B/Phase 8 remain denied |
| activation file exact, `.mode` has unknown/duplicate/noncanonical bytes | `opt_in_invalid` or bounded safety advisory; no injection |
| token or mode changes after capture and before result | `state_changed`; discard rendered output and emit canary only |

Planning-disabled, detached-session and no-plan paths complete before any plan-local state capture. Ambient `PWF_INJECT=smart` never activates smart.

## P3 runtime and contract design

- Adapter and runtime capability locks change atomically from legacy-only to exactly `[legacy, smart]`; this sequence advertises installed capability, not workspace activation. Forged autonomous capability is still refused before plan-state reads.
- Request/result schema v2 already expresses this gate. F2A keeps the schemas and exact keys; it updates their consumers and tests rather than creating contract v3 without a semantic need.
- Owned state capture first validates the independent activation file. Only then may it validate `.mode`. Both captured identities must be revalidated after pristine rendering so token removal/replacement or profile mutation cannot leak a stale smart result.
- Owned-plan passes the decision into the private snapshot renderer only as owned `PWF_INJECT=smart`; it does not copy `.mode`, activation files or any raw marker into the snapshot.
- Result semantics remain bounded: invalid activation state returns `invalid_request`, `effective_profile=null` and one existing advisory; ordinary legacy results report legacy; once smart is safely selected, subsequent non-admission outcomes may report smart but never retry legacy rendering.
- Adapter result validation becomes relational: non-null `effective_profile` must be in the request's allowed sequence; advisory remains valid only for non-injecting invalid requests. Adapter still emits canary-only on child/refusal failure and invokes catch-up only after an injecting plan result.
- Smart changes only the selected plan section. Host event set, canary order, catch-up contract, trusted upstream inventory and workspace-write boundary remain unchanged.

## P4 verification and platform split

F2A implementation must begin with failing-first nearest tests and close the following matrix:

- portable: exact contract stays v2; adapter produces `[legacy, smart]`; relational result validation accepts only requested profiles; autonomous/gated remain refused;
- Linux: activation absent means `.mode` zero-read even when old `.mode` is unsafe; canonical token+mode yields structured smart output; non-structured plans exercise the documented head-N fallback;
- Linux: symlink/hard-link/UTF-8/size/duplicate/unknown/missing and first-read/post-render race cases refuse without plan or catch-up content;
- Linux: planning-disabled/detached/no-plan remain state-zero-read; ambient `PWF_INJECT` remains stripped; nonce/attestation/ledger paths remain zero-read;
- Linux: smart rendering occurs only from the normalized private snapshot, output budgets/timeouts still hold, state changes discard output, and snapshot residue remains zero;
- compatibility: markerless and old-marker workspaces remain byte-equivalent legacy; smart does not change canary or catch-up ordering; explicit disarm immediately restores legacy on the next fire;
- supply chain: runtime/adapter hash propagation, full suite, syntax/compile, deterministic ZIP and candidate install/doctor all close atomically.

Because F2A changes production behavior and bundle bytes, its implementation exit includes Source/Candidate/no-live Cloud with no managed marker to prove the installed default is still legacy. Real Cloud opt-in, Fresh/UserPrompt/real Resume, cache reuse, opt-out/re-arm and bidirectional rollback remain F3; the no-live gate must not be described as those lifecycle claims.

## Decision

`CONDITIONAL_GO_TO_F2A_IMPLEMENTATION`.

No architecture redesign, new Host event, new schema or new upstream file is required. The condition is that implementation adopt the independent activation commit point and two-pass state revalidation, replace—not merely delete—the F1 zero-read guards with the stronger profile matrix, and stop after local/Linux/no-live candidate acceptance. F2B and F3 remain separately authorized gates.
