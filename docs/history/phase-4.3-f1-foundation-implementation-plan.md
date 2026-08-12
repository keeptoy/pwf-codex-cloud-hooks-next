<a name="phase-4-3-historical-position"></a>

# Phase 4.3：F1 foundation 实施规划探路

## Historical position

Phase 4.3 位于 Phase 4.1 安全架构选择和 Phase 4.2 programme gate 校准之后、任何 F1 production
implementation 之前。它把 `F1A → F1B` 从路线名称翻译为可实施施工图：文件和 authority、hash 传播、
failing-first tests、平台分流、installed-state 迁移、退出和停止条件。

本里程碑只闭合开工前勘测，不表示 contract v2、plan protocol v2、hybrid state reader 或 `0.4.0-*` package
identity 已经存在，也不产生实施授权。

<a name="phase-4-3-problem-before"></a>

## Problem before

此前已经知道要把 F1 拆成 contract/source foundation 与 inactive runtime foundation，但仍有四个落地问题：

- F1A/F1B 是否能各自保持 build/install/doctor 绿色，而不是制造半套 contract；
- adapter、四个 ABI、entry mode 与 retired metadata 应怎样收敛成单一 authority；
- plan-v2 bytes 如何反向影响 bundle、manifest、Release 与 deterministic ZIP；
- 新旧 installed file set 不同后，所谓“双向 takeover/rollback”到底怎样才是真的。

最后一项尤其关键：accepted v0.3.5 installer 只允许它认识的现场文件；F1A/F1B 新增或替换 ABI schema path
后，旧 installer 不可能直接接管新现场。若不显式建模，规划里的 rollback 承诺会与生产代码冲突。

<a name="phase-4-3-core-decisions"></a>

## Core decisions

### 1. F0、F1A、F1B 分别形成绿色停止点

- F0 先把已发布 `0.3.5` 源身份轮转为 zero-hash `0.4.0-dev` 开发身份；不提前称为 alpha。
- F1A 原子轮转 source manifest schema4、runtime bundle v2 与 Release artifact v2，但继续使用 plan-v1 legacy
  runtime，因此能隔离供应链故障。
- F1B 再原子切换 plan request/result v2 与 inactive state reader；production capability 固定为 `[legacy]`，
  marker/state helper 不可达。

每个 checkpoint 都必须完整 build/check/install/doctor，不能提交 stale hash 或 partial inventory；F1B 后必须重新
闭合全部 hashes，不能复用 F1A ZIP identity。每个 gate 完成后停止，等待下一次授权。

### 2. v2 用结构和真实 consumer 取代历史常量

bundle v2 使用 exact `upstream_files`、`local_files`、`installed_contracts` 与受限 roots。adapter 进入
`local_files`；plan/catch-up 四个内部 ABI 全部进入 `installed_contracts`；dependency graph 补入 adapter 到两个
owned siblings 的真实边。

结构、path containment、唯一 pristine hash、mode、dependency closure 和 exact inventories 已能表达来源与准入，
所以 candidate v2 删除 entry `origin`、重复 managed hash、空 overlay IDs、无人消费的 language/host dependency
以及只做说明的 condition/required。absence guards 继续直接证明这些旧字段和 deferred writers 无法进入 v2，
不是保留旧 schema fallback。

Release v2 的每个 entry 自带 mode，builder 删除第二份 executable set。current builder/tests 从 manifest 发现当前
contract path；历史 v0.3.5/v0.3.4 source 继续用自己的 immutable v1 contract。

### 3. source manifest 与 installed manifest 分开治理

F1A 的 “manifest schema4” 指 source `upstream-manifest.json`，不是现场 `installed-manifest.json`。后者仍是
schema3 ownership/snapshot 协议；`runtime_files` 继续记录安装现场，`adapter_sha256` 虽然在 adapter 入 bundle 后
显得重复，但 v0.3.5 doctor 仍有真实 consumer。

因此 F1 暂不轮转 installed manifest。`adapter_sha256` 的退出触发点是 accepted predecessor 不再读取它，并且新的
installed-state migration/rollback 已经通过 Linux/Cloud；不能因为 source schema 升级就顺手删除现场兼容字段。

### 4. 前向升级与回滚采用非对称合同

candidate 新增一个由 manifest 固定、installer 消费、但不安装进 runtime 的 exact predecessor transition contract。
它只准入已发布 v0.3.5 的 exact installed manifest、inventory、path/hash/mode、现场 bytes 与 requirements ownership；
任何 unknown/tampered 状态在 backup/write 前 fail closed。

支持路径是：

```text
v0.3.5 exact managed state
  -> candidate validates predecessor contract
  -> backup + atomic candidate replacement

candidate managed state
  -> candidate uninstall + backup
  -> immutable v0.3.5 clean install
```

v0.3.4 的 publication fallback 身份不自动等于 installed-state migration support。transition profile 只保留一个
accepted predecessor window，并在 baseline promotion 时替换/复核，避免永久累积历史 inventories。若精确迁移无法
实现，则公开支持面降为 old uninstall → candidate clean install，不能放宽 unknown-file blocker或保留 active v1/v2
dual loader。

### 5. F1B 的 inactive 必须是物理不可达

request v2 policy 带 `planning_enabled`、ordered `allowed_profiles` 与 exact `opt_in_protocol`；adapter 在 F1B 只发送
`[legacy]`，owned-plan binary 也只支持 legacy。即使伪造 future request，也必须 non-injecting 且在 state capture 前
拒绝。

state reader/normalizer 先作为 `owned-plan.py` 内部受控 seam，复用已有 descriptor/no-follow/single-link/race
边界。unit tests 可以直接验证它，但 production 对 `.mode`、nonce、attestation、ledger 的 open/read 次数必须为零。
result v2 只增加 exact effective profile 与 bounded advisory reason code；不传 raw text、hash、nonce 或 ledger diagnostics。

<a name="phase-4-3-completed-delivery"></a>

## Completed delivery

本轮完成的是实施施工图，而不是 production delivery：

- 冻结 F0/F1A/F1B exact file map、authority map 与 hash/inventory propagation；
- 冻结 bundle/manifest/Release v2 的最小 machine shape 与字段生命周期；
- 冻结 plan-v2 producer/consumer seam、legacy supported-set 与 marker-zero-read 证明；
- 冻结 failing-first 次序、Windows/Linux/no-live Cloud 职责分流；
- 补上 v0.3.5 exact forward migration 与 candidate-controlled rollback 的非对称合同；
- 冻结每个 gate 的 entry、exit、stop 和重新 Discovery 条件。

Cloud 使用也按风险收敛：F0 和 F1A 先做 local/Linux；完整 F1B 闭合后只跑一次 no-live Cloud foundation；
已激活 smart/autonomous 的 Fresh/Resume/opt-out/tamper 验收仍留给 F3，避免为只改身份或合同的 checkpoint
重复消耗 Cloud 时间。

<a name="phase-4-3-acceptance-conclusion"></a>

## Acceptance conclusion

结论是 `GO_TO_SEPARATE_F0_THEN_F1A_WHEN_AUTHORIZED`。F1A/F1B 可以各自形成完整绿色树，也能在最终
candidate 中保持 contract/hash 原子闭合；无需合并为一次难审的大改，也无需制造不可构建的中间树。

当前基线 importer、deterministic Release build/check 与完整 Windows suite 均保持绿色；POSIX-only tests 在 Windows
诚实跳过，未来实施仍必须经过 Linux。该证据只证明施工图建立在健康 v0.3.5 baseline 上，不证明 F0、F1A、F1B、
Linux/no-live Cloud、alpha 或 Release 已完成。

<a name="phase-4-3-explicit-non-goals"></a>

## Explicit non-goals

- 不修改 production、machine contracts、tests、package identity、bootstrap 或 Release inputs；
- 不激活 smart/autonomous/gated，不读取或写入真实 workspace state；
- 不新增 Host event、persistent cache、upstream writer 或第二套 runtime；
- 不承诺 immutable v0.3.5 installer 直接接管 future candidate layout；
- 不把 F1B PASS 自动升级为 F2A、Cloud F3、alpha seal、publication 或 Latest promotion。

<a name="phase-4-3-successor-inheritance"></a>

## Successor inheritance

后继实施必须严格按 F0 → F1A → F1B 逐 gate 授权、测试、commit 和停止。F1A 先以 plan-v1 证明纯供应链迁移；
F1B 再以 plan-v2 证明 state foundation 存在但不可达。任何一步若需要 dual schema fallback、放宽 unknown-file、
改变 legacy output、扩大 trusted graph 或写 workspace，都必须停止并重开设计/Discovery。

F1B 完成后，下一步只能是请求 F2A Discovery/implementation 授权。activation/disarm commit point、smart activation、
autonomous attestation/nonce/ledger 与 F3 Cloud/rollback 仍分别属于后续 gate。

<a name="phase-4-3-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/71f8f71df87c3c57ea52181159dd8a67817302ae)

该链接只证明本轮实施规划开始时的仓库基线，不解释未来实现；当前 contract、programme 与授权以当前仓库 authority 为准。
