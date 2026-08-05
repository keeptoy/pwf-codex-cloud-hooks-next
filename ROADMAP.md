# 路线图

> 当前回滚基线：published/accepted `v0.3.0-beta.2`。
>
> 当前开发身份：`0.3.0-beta.3-dev`，未发布。
>
> 仓库迁移不会自动授权产品 Phase 4。

## 1. 当前状态

旧仓库已完成 beta.2 和完整 Cloud A～F 验收。successor migration 使用四个独立 gate：

| Gate | 目标 | 状态 |
|---|---|---|
| M1 exact mirror | 证明新 remote/audit branch 与 beta.2 commit/tree/资产完全一致 | complete |
| M2 slim transformation | 精简历史树，建立新 authority/identity/provenance 和 root commit | complete；等待 checkpoint |
| M3 Cloud equivalence | development branch Fresh/Resume/doctor/ZIP/Linux suite | pending；未授权 |
| M4 cutover | 建立公开 `main`、交割、旧仓库导航和 rollback 演练 | pending；未授权 |

M2 内部分为：

- M2-A：59-path orphan skeleton、六项 rename、fresh planning；complete。
- M2-B：文档权威、LF、行为型 test/fixture、beta.3-dev、overlay/provenance；complete。
- M2-C：本地完整回归、确定性 ZIP、single root commit、fresh Windows clone；complete。

## 2. M2-B 已完成门槛

- 八个文档入口各自只有一个职责，无旧 Phase/Round 当前态依赖；
- 59-path allowlist 不变，prototype/旧 planning/旧文件名不回流；
- `.gitattributes` 对 repository-wide text 固定 LF，binary 显式 `-text`；
- fixture bytes 不变，测试引用使用行为名；
- architecture/repository tests 替代 Phase 文档和 prototype handoff 断言；
- overlay evidence 指向稳定 provenance/fixtures，manifest hash 一致；
- package 为 `0.3.0-beta.3-dev`；bootstrap 指向 successor 并以 zero hash fail closed；
- production/runtime/schema 行为字节不变；
- 本地验证通过后曾停在 M2-C checkpoint；该 checkpoint 和后续 M2-C 授权均已收到。

## 3. M2-C 本地关闭（complete）

已通过门槛：

1. importer check、runtime/contract exact hash；
2. Windows full suite，POSIX case 诚实 SKIP；
3. 两次 development ZIP 字节一致、22 entries、bootstrap external；
4. zero-hash bootstrap 不能安装；
5. 创建一个无 parent 的 root commit；
6. 验证 exact 59 paths、四个 `100755`、LF、clean；
7. fresh Windows clone 重跑 importer/static/suite。

M2-C 已按独立授权完成；development branch 仍未 push，M3 仍需另行授权。

## 4. M3 Cloud equivalence

M3 需要先授权 push development branch，不能推 M1 audit ref 之外的内容来绕过 checkpoint。Cloud gate
至少包括：

- Linux full suite 与实际 test count 解释；
- importer/installer/doctor；
- root/root 与 install-user/Hook-user；
- Fresh startup/UserPrompt canary；
- real planning update、长 wrapper 尾部 sentinel、Resume owned catch-up；
- post-resume doctor 和 zero snapshot/cache residue；
- development ZIP exact 22 entries 与 deterministic bytes；
- production behavior 与 beta.2 等价。

M3 不发布资产，也不创建 public `main`。

## 5. M4 cutover

只有 M3 PASS 后才能设计 M4。M4 至少处理：

- successor public `main` 的建立方式；
- branch protection、default branch、repository description；
- `MAINTAINER_HANDOFF.md` 的实际交割演练；
- 旧仓库 README 指向 successor，同时保留 beta.2 Release/历史证据；
- successor provenance 反向引用旧仓库 frozen commit/tag/assets；
- 回到 beta.2 不依赖 successor 修复的 rollback 演练；
- 新 pre-release identity 与最终双资产封板。

## 6. 产品 Phase 4～9

迁移完成后才允许重新打开产品路线，而且每个 Phase 第一轮都是 Discovery。

| Phase | 候选范围 | 前置门槛 |
|---|---|---|
| 4 | attestation 与 opt-in v3 modes | 重新审计上游 mode/nonce/ledger；legacy 默认不变 |
| 5 | compaction lifecycle | 先验证 Cloud `clear`/`compact` Host schema 与重复注入模型 |
| 6 | selective tool/permission hooks | 逐事件测量 latency、token 和噪声；先 advisory |
| 7 | advisory completion | bounded、non-recursive、无 plan 时安静 |
| 8 | optional hard gating | 明确 Host Stop decision contract、逃生路径和 rollback |
| 9 | Release/canary retirement | 完整矩阵、最终字节、fresh Cloud、可逆发布 |

这些只是路线候选，不表示 upstream 中存在同名脚本就已经受支持。

## 7. Discovery 触发条件

以下情况必须暂停实现：

- 新 Phase 或关键 activation/migration/Release/cutover；
- Cloud 与本地证据冲突；
- schema/Host ABI/trusted graph、安全或 rollback 变化；
- timeout、进程组、权限、identity 或数据安全模型变化；
- 两条路线代价显著不同，继续写代码可能“实现正确但方向错误”。

## 8. 回滚

在 M4 前，production 权威仍是旧仓库 published beta.2。M2/M3 失败只处理本地 slim worktree、
未发布 branch 或 development artifacts；不得 reset/move M1 audit ref，也不得改写 beta.2 assets。
