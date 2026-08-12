# Task Plan: Phase 4 F0 Development Identity

## Goal

把当前开发列车从已发布的 `0.3.5` candidate 身份切换为未封板的 `0.4.0-dev`，建立 zero-hash development bootstrap，并同步 candidate/accepted baseline、CHANGELOG 与 ROADMAP；不改变 runtime、machine contract、Host ABI 或用户行为。

## Authority and scope

- Maintainer authorization: 继续 F0。
- In scope: package/Release candidate identity、development bootstrap、candidate acceptance、CHANGELOG、ROADMAP、直接相关测试与 planning 证据。
- Out of scope: F1A contracts、runtime/install inventory、plan protocol、smart/autonomous activation、Cloud acceptance、seal、tag、push、Release。
- Stop condition: F0 经相称验证并形成独立本地 commit 后停止，不自动进入 F1A。

## Authorization

- Authorized now: F0 development identity implementation and its direct tests/docs.
- Not authorized: F1A or later gates, Cloud execution, seal, publication, promotion, rollback mutation, or remote writes.

## Next Step

Complete P0 evidence, then add failing-first identity/governance expectations before rotating current bytes.

## Stop Conditions

- Stop after the independent F0 commit and report; do not enter F1A automatically.
- Stop and reopen Discovery if F0 requires runtime behavior, Host ABI, trusted graph, installed-state migration, or contract-v2 changes.
- Stop if published `v0.3.5` bytes or immutable acceptance/provenance would need rewriting.

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| P0 Evidence refresh and lifecycle baseline | complete | 冻结当前身份、文件清单、producer/consumer 与不可变历史边界 |
| P1 Failing-first identity tests | complete | 测试明确要求 `0.4.0-dev` candidate、`v0.3.5` accepted、zero hash 与双身份窗口 |
| P2 Minimal F0 implementation | complete | package/bootstrap/acceptance/CHANGELOG/ROADMAP 原子同步，无 F1A 行为变化 |
| P3 Focused and full validation | complete | focused、full suite、bootstrap syntax、Release build/check、diff checks 通过 |
| P4 Lifecycle reconciliation and local commit | complete | 正向 authority 与反向残留扫描闭合，独立 commit，工作树干净 |

## Migration lifecycle ledger

| Object/path/symbol | Current owner/consumer | Action | Gate/window | Proof | Post-gate state | Review/retirement |
|---|---|---|---|---|---|---|
| package candidate version | package.json, builder/tests | REPLACE | F0 | focused/full tests PASS | `0.4.0-dev` | seal gate removes dev identity |
| Release contract package version | release-artifact-v1, builder | REPLACE | F0 | contract/release tests PASS | `0.4.0-dev` | F1A contract-v2 migration |
| development bootstrap filename/version/hash | Release external asset/tests | ADD | F0 | bootstrap/release tests PASS | v0.4.0-dev + 64 zero hash | later seal creates separately authorized exact-hash asset |
| candidate acceptance | governance lifecycle/tests | ADD | F0 | repository-boundary test PASS | documents pending development identity only | future gate acceptance adds evidence; seal renames identity |
| accepted v0.3.5 provenance/acceptance | immutable history | KEEP | accepted baseline | published oracle/full suite PASS; zero diff | unchanged | never rewrite in place |
| ROADMAP candidate/accepted roles | ROADMAP | REPLACE/KEEP | F0 | governance tests PASS | candidate `v0.4.0-dev`, accepted `v0.3.5` | next train/release gate |
| CHANGELOG development identity delta | CHANGELOG | ADD | F0 | repository review/tests PASS | records F0 only | next release cut |
| runtime/contracts/Host behavior | production/tests | KEEP | F0 | full regression PASS; production path diff empty | unchanged | F1A requires new authorization |
| exact F0 identity test | repository lifecycle test | ADD | F0 | failing-first red then PASS | pins candidate/accepted/F0 status window | seal or next lifecycle role rotation |
| release-artifact integrity reference | upstream-manifest consumer | REPLACE | F0 | contracts/importer checks PASS | exact hash of identity-rotated v1 contract | F1A manifest/contract-v2 migration |

## Errors encountered

| Error | Attempt | Resolution |
|---|---|---|
| 全仓库宽泛 `rg` 在组合编排中以 exit 1/undefined 返回，未保留可用输出 | 1 | 改为按 root/tests/docs/planning 分组检索，并对无匹配单独解释；不重复相同组合调用 |
| Git Bash syntax check in Windows sandbox failed to create signal pipe (Win32 error 5) | 1 | Re-ran the same read-only syntax check outside sandbox; PASS |
| Focused contracts test found stale Release contract hash in upstream manifest | 1 | Updated the exact integrity reference after confirming this is required F0 hash propagation; no schema/inventory change |
| Sandbox blocked local Git index lock during stage/commit | 1 | Re-run only the scoped local `git add`/`git commit` outside sandbox; no remote action |

## Current status

`F0_COMPLETE / VALIDATION_PASS / LOCAL_COMMIT_READY / STOP_BEFORE_F1A`
