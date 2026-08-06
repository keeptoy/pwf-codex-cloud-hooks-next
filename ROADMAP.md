# 路线图

本文件是 migration、Cloud、Release 和后续 Product Phase 状态的唯一宏观权威；精确 Next Step、
授权与停止条件仍由活动 `task_plan.md` 决定。README 不复制本文件的逐 gate 状态。

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
| M2 slim transformation | 精简历史树，建立新 authority/identity/provenance 和 root commit | complete；checkpoint 已收到 |
| M3 Cloud equivalence | development branch Fresh/Resume/doctor/ZIP/Linux suite | complete；accepted evidence ref 保持不动 |
| M4 cutover | 建立公开 `main`、交割、旧仓库导航和 rollback 演练 | M4-A/B complete；M4-C authorized / Cloud acceptance preparing |

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

M2-C 已按独立授权完成并 checkpoint；development branch 仍未 push。

## 4. M3 Cloud equivalence

M3 Discovery 已冻结为三个后续独立子门：

1. M3-A：只 push 审核过的同名 development branch，在 Fresh Cloud 执行 no-live Linux seal、
   63/63 suite、隔离 install/doctor、mode/importer 和确定性 22-entry ZIP；
2. M3-B：在一次性 Cloud setup 中从精确 checkout 本地构建 ZIP，通过进程级 `file://` URL/SHA
   覆盖交给原 bootstrap，然后执行 Fresh startup/UserPrompt、real planning update、长尾 Resume
   owned catch-up、post-resume doctor 和 zero snapshot residue；
3. M3-C：保存原始证据并证明 closure descendant 只变化治理文件，随后停在 M4 Discovery 前。

完整协议与失败矩阵见 [`docs/beta3-dev-m3-cloud-equivalence.md`](docs/beta3-dev-m3-cloud-equivalence.md)。
checkout bootstrap 始终保持 zero hash；M3 不发布资产、不创建 public `main`，也不把 development
安装描述成 Release。

M3-A 首次 Cloud 运行已通过 identity、mode、importer/static 和 Linux 63/63，随后因 runbook 把
实际两层 Managed Policy TOML 误读为一层而停止。修复 descendant 从头完整重跑后全部 PASS：接受
HEAD 为 `39795283cd65f84547651d7bec816191fb5bfedf`，development ZIP 为 22 entries / 75,323 bytes /
SHA-256 `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`，隔离 doctor、adapter-only
policy、11 payload、zero hash 与 clean workspace 均通过。M3-B 的精确 accepted HEAD/ZIP SHA
disposable setup 也已 PASS；当前只允许结束 setup run，并在完全不同的新 task 中先执行 Fresh
lifecycle。Fresh 已观察到 startup SessionStart、UserPromptSubmit 和全部辅助 planning context；
受控 baseline 回复与六项 canonical UserPrompt 自动注入也已 PASS。长 wrapper 与 Resume 也已完成：
16 条 unsynced、message #36 planning update、截断保尾、正确顺序和 canonical 恢复全部 PASS；当前
post-resume doctor 也以 healthy、beta.3-dev、11-file manifest exact 和零残留 PASS。M3-B 已关闭；
M3-C 进一步证明 tested commit 到 closure 只变化七个既有治理文件，60-path/root/mode/audit/
remote/Release 边界不漂移，并通过 importer/static、4/4 focused contracts、13-doc 与确定性 ZIP
复验。M3 已关闭；实际 Cloud-tested development ref 保持在 `39795283...`，后续治理后代已通过
M4 的受控 normal fast-forward 进入 `main`，没有改写该证据 ref。

## 5. M4 cutover

M4-A 与 M4-B archive/provenance handoff 已通过。successor 是 public、
unarchived，default 的 M4-B 最终读回为 exact `main@5476a5c...`；Cloud-tested development
`39795283...` 与 audit `bbad3703...` 未移动。`main-integrity` 和 `evidence-integrity` 两个
active ruleset 分别保护 authority/evidence refs，规则只有 deletion 与 non-fast-forward；
classic protection 不叠加。successor 仍无 tag 或 Release。

冻结候选路线不是 rename/move 已验收 development ref，而是：

1. 从本地 M3 治理后代的新 checkpoint 以 non-force exact refspec 创建 `main`；
2. 验证 main SHA 与两个 evidence refs 后，再把 default 切到 `main` 并配置最小 integrity policy；
3. 更新旧仓库入口和 successor provenance，但保持旧仓库 public/unarchived、beta.2 assets 不变；
4. fresh default clone 执行 Linux/Cloud no-live seal，并独立下载验证 beta.2 rollback；
5. 完成交割后仍停在产品 Phase 4 Discovery 授权门前。

M4 分为 Discovery、M4-A successor authority、M4-B archive/provenance handoff、M4-C cutover/rollback
acceptance 四轮，互不自动授权。M4 不发布 beta.3：正式非 `-dev` identity、ZIP/bootstrap hash 和
发布后 Fresh/Resume 属于未来独立 Release gate。完整路线、mutation/failure matrix 和退出条件见
[`docs/beta3-dev-m4-cutover-plan.md`](docs/beta3-dev-m4-cutover-plan.md)。

M4-A 的无分支 fresh clone 已得到 exact `main`、61 paths、四个 `100755` upstream runtime 和
clean workspace。M4-B 已发布双向 provenance/navigation，保持 successor README/Release inputs、
旧 beta.2 assets 与两个仓库名称/公开状态不变。维护者现已单独授权 M4-C；只允许发布
governance-only runbook，并完成 Fresh default clone、Linux suite、确定性 development ZIP、独立
beta.2 rollback、handoff、remote recheck 与 clean-workspace 验收。M4 仍不发布 beta.3。

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
