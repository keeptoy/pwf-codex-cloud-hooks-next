# Findings: Phase 4 Discovery

## Starting baseline

- accepted baseline 是 immutable v0.3.5；本地分支为 `0.4.0-dev`，尚无 successor package/machine identity。
- 当前 production 只有 `SessionStart` / `UserPromptSubmit` 两个 managed adapter event，顺序为 canary → owned plan →
  可选 owned catch-up → validated context；默认 behavior profile 为 `managed_legacy`。
- private snapshot 只投影 `task_plan.md` 与可选 `progress.md`，因此 `.mode`、attestation、nonce、workspace metadata 与
  ledger mutation 不进入当前 injector 数据面；这些上游分支当前不可达。
- C2 已形成 `CONDITIONAL_GO`：contract-v2 foundation 首选在 Phase 4 Discovery 后作为 `0.4.0-alpha.*` 中独立、
  未激活 gate；`origin` 为 `DEFERRED_WITH_REVIEW_TRIGGER`，最迟在 v2 implementation 前裁决。

## Current official OpenAI Host facts — 2026-08-11

Sources:

- [Official Hooks documentation](https://learn.chatgpt.com/docs/hooks)
- [Official Cloud environments documentation](https://learn.chatgpt.com/docs/environments/cloud-environment)

Observed facts relevant to this Discovery:

- Hooks are a current Codex extensibility framework. Officially listed events now include `PreToolUse`, `PermissionRequest`,
  `PostToolUse`, `PreCompact`, `PostCompact`, `UserPromptSubmit`, `SubagentStop`, `Stop`, `SessionStart`, `SubagentStart` and
  `SessionEnd`.
- Multiple matching command hooks for one event are launched concurrently. Managed hooks from system/MDM/cloud/
  `requirements.toml` are policy-trusted and cannot be disabled in the user hook browser.
- `SessionStart.source` currently documents `startup`, `resume`, `clear` and `compact`; `SessionStart` JSON can add developer
  context, and a compact-triggered hook can feed the immediate continuation.
- The official docs explicitly call `transcript_path` convenient but not a stable hook interface. This supports retaining the
  repository's validation/capture boundary rather than treating transcript JSONL as a stable ABI.
- Cloud checks out the selected branch/commit, runs setup, and may run maintenance when resuming cache. Configured environment
  variables span setup and agent phases, but shell-local `export` in setup does not; secrets are removed before the agent phase.
- Cloud container state can be cached for up to 12 hours. Cache creation uses the default branch plus setup; resume checks out the
  chat branch and may run maintenance. Cache behavior is therefore a Phase 4 acceptance input, not an ambient constant.

## Immediate scope consequence

- The old programme assumption “compaction/tool/Stop ABI is not publicly present” is no longer accurate. The events are publicly
  documented, but Product Phase boundaries still hold: ABI existence does not authorize Phase 5～8 behavior.
- Phase 4 should record these events only as adjacent Host facts and keep production registration at the current two events unless
  a later Product Phase independently authorizes expansion.
- The current official docs strengthen two existing invariants: managed hooks remain policy-owned, and mutable transcript data must
  stay behind an owned validation boundary.

## C2 inheritance

- Source origin should be decided after Phase 4 freezes `upstream_files` / `local_files` / source-only / installed partitions.
- `language` and `host_dependencies` remain candidates for real admission ownership; do not delete them before mapping new source.
- installed plan schemas and source-only catch-up schemas must be revisited with the actual Phase 4 producer/consumer graph.
- Any contract-v2 implementation remains separate from Phase 4 behavior activation even if both share one `0.4.0-alpha.*` train.

## Open evidence work

- Recover exact pinned v3.8.2 files and call graph for attest, nonce, modes and ledger.
- Map every file into upstream pristine, owned local runtime, source-only support, installed contract or denied surface.
- Compare upstream write/mutation assumptions with private snapshot permissions, identity checks, cleanup and Cloud users.
- Determine whether opt-in can be expressed without adding a new Host event or reading mutable global Skill state.
