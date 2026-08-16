# Task Plan: Phase 4 F3B3 autonomous live Discovery

## Goal

在 F3B2 smart Cloud lifecycle 已闭合的前提下，复核 F3B1/Phase 4.7 预埋的 autonomous、tamper、reprepare/re-arm
协议与 F3B2 实证之间的差距，冻结 F3B3 implementation/live gate 的最小安全方案、operator-guide 规格、证据关系、
对象生命周期和退出条件。

## Authorization

- 维护者已明确授权进入 **F3B3 小型 Discovery**。
- 已授权：只读恢复代码、contracts、tests、runbook、F3B2 evidence 与 upstream；创建本 Discovery planning；编写
  Phase 4.8 详细发现；在 Phase 4.7 添加最小后续尾注；同步 Discovery 级 programme/acceptance 状态；补 repository-only
  治理测试；相称本地验证与本地 commit。
- 未授权：F3B3 implementation/live；创建或移动 autonomous validation refs；在真实 scope 写 `.mode`、nonce、
  attestation、activation 或 ledger；执行 tamper；Cloud environment/task；F3B4、F3C、Release；production/runtime/
  contracts/bundle/installer/bootstrap/README 字节变化；任何 push、PR、tag 或远端写入。

## Next Step

完成全量治理/供应链回归与本地 commit；随后停止，由维护者复核 Phase 4.8，并决定是否另行授权
F3B3 autonomous materialization。未获新授权前不创建 `A_BASE`、validation refs、operator guide 或 Cloud task。

## Current Phase

F3B3 Discovery complete; stopped before materialization

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| F3B3-D0 Evidence recovery | completed | 当前权威、F3B2 实证、F3B1 autonomous/tamper 协议和代码 call edge 恢复完成 |
| F3B3-D1 Delta analysis | completed | 三层状态、DAG、tamper isolation、attestation/nonce、Resume 与 evidence gap 全部分类 |
| F3B3-D2 Discovery freeze | completed | Phase 4.8 冻结方案、operator-guide 规格、生命周期表、退出/停止条件与 GO/NO_GO |
| F3B3-D3 Historical/programme sync | completed | Phase 4.7 最小尾注、ROADMAP/acceptance/active planning 状态职责无重复闭合 |
| F3B3-D4 Verification/commit | completed | focused/full governance 回归、Release exclusion 与 candidate identity 闭合并本地提交 |

## Frozen boundaries

1. 本轮只做 Discovery，不把路线结论解释为 implementation 或 Cloud live 授权。
2. F3B2 exact evidence 保持不可改写；smart refs 不复用为 autonomous 输入。
3. autonomous validation chain 必须先建立自己的 markerless `A_BASE`，再从它形成 exact-path DAG；共享的是已验证的
   runtime/candidate 安全模型，不复用 smart plan 或 smart refs。exact refs 只能在后继获批 implementation 创建。
4. tamper 必须设计为 disposable dirty-worktree 负向任务，不得形成 commit/ref 或继续作为正向 evidence。
5. expected state/profile 不能自证；真实 Host/probe/Git/final-exit provenance 必须分别承担证据职责。
6. 所有新增文档、planning 和 tests 必须保持 Release-excluded；candidate SHA 不得因 Discovery 改变。

## Stop Conditions

- 发现必须修改 production、contract、Host ABI、trusted graph 或 Release input 才能继续。
- 现有 autonomous admission、tamper refusal 或 evidence helper 与 Phase 4.7 不变量发生实质冲突。
- 需要创建真实 machine state/ref、运行 Cloud 或执行远端写入才能完成 Discovery。
- 无法把 tamper dirty worktree 与正常 clean-stage evidence 严格隔离。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows workspace sandbox 中 `node --test` 报 `spawn EPERM` | 1 | 分类为 test-runner sandbox limitation；在获批的只读外层执行 focused suite，通过后继续 |
| Git Bash 在 Windows workspace sandbox 中无法创建 signal pipe | 1 | 分类为 sandbox limitation；在获批的只读外层重跑两个 bootstrap `bash -n`，均通过 |

## Current status

`F3B3_DISCOVERY_COMPLETE / CONDITIONAL_GO_TO_F3B3_AUTONOMOUS_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED`
