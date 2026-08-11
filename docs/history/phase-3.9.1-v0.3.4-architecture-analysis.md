<a name="phase-3-9-1-historical-position"></a>

# Phase 3.9.1：v0.3.4 架构逻辑分析与维护者拆解

## Historical position

`Phase 3.9.1` 是在 v0.3.4 已完成兼容收口、双通道 Cloud 验收、不可变发布与稳定晋级之后补写的
**回顾性维护者里程碑**。它不是原 programme 的正式 Product Phase，不对应新的 runtime、contract、Release
或部署变更，也不授权 Phase 4。它的作用是把 v0.3.4 已经存在、已经验收但分散在源码和专项文档中的逻辑，
整理成一份新人可以从头读到尾的架构地图。

本文描述的是 v0.3.4 闭合时的稳定心智模型。长期行为、programme、版本身份和活动授权仍分别由根级
README、ARCHITECTURE、DESIGN、ROADMAP、machine contracts、版本 acceptance 与活动 planning 管理；本文不与
它们争夺当前 authority。

<a name="phase-3-9-1-problem-before"></a>

## Problem before

v0.3.4 的实现已经形成完整闭环，但新人如果只按文件名阅读，很容易得到几种错误印象：把 adapter 当成业务算法
中心；把 global PWF Skill 当成 production runtime；把 manifest、bundle、installed manifest 和 Release entries
看作四份重复清单；或者因为 pinned upstream 中存在 v3 mode、attestation、nonce 与 ledger 代码，就推断这些能力
已经进入当前 Host 路径。

真正的困难不在单个函数，而在跨层 authority：谁选择计划、谁读取可变 transcript、谁决定可安装文件、谁证明
现场 ownership、谁只负责 ZIP 边界，以及失败后是停止注入还是停止 Codex。缺少一张整体地图，局部正确的改动也
可能重新引入第二套算法、扩大 trusted graph，或把历史/发布快照误当成可编辑 source of truth。

<a name="phase-3-9-1-core-decisions"></a>

## Core decisions

1. **产品边界是固定集成，不是通用转换器。** 当前只支持固定的
   `OthmanAdi/planning-with-files v3.8.2`。global Skill 必须保持 pristine，但 production 不从用户可变 Skill
   目录执行脚本；可执行路径只来自 installer 管理并由 bundle/manifest 固定的 owned runtime。
2. **adapter 只做 Host 边界、监督和组合。** canonical plan 选择与渲染属于 `owned-plan.py`，transcript
   选择与 catch-up 报告属于 `owned-catchup.py`。adapter 不保留平行 plan 算法，也不自己扫描和解释会话历史。
3. **内容 fail closed，Hook 对 Codex loop fail open。** 未知输入、身份不符、文件竞态、child timeout、输出超限
   或协议漂移都不能产生 partial injection；但 advisory Hook 应尽量以合法的 canary-only Host JSON 和成功退出
   收束，避免阻断 Codex 主循环。
4. **复用 upstream 的受限语义，不移交安全边界。** owned plan 复用 pristine resolver/injector 的 canonical
   选择和 legacy 文案；owned catch-up 只复用固定 helper closure。路径 containment、no-follow 读取、身份复核、
   预算、进程监督与最终 JSON contract 都由 owned Python boundary 承担。
5. **同一逻辑事实只有一个 machine authority。** runtime bundle 独占 source/install inventory；manifest 只固定
   provenance、bundle path/SHA 和非重复 integrity references；installed manifest 是现场状态快照；Release artifact
   entries 是 ZIP allowlist。后两者即使字段相似，也服务不同生命周期，不能因“去重”而合并。
6. **默认行为保持 managed legacy。** owned-plan 把已验证的 plan 内容投影到私有 snapshot，只放入
   `task_plan.md` 和可选 `progress.md`。上游 v3 的 mode、attestation、nonce、ledger 以及 workspace metadata 不进入
   该 snapshot，所以这些分支在 v0.3.4 production 数据投影下不可达。

<a name="phase-3-9-1-completed-delivery"></a>

## Completed delivery

### 当前逻辑主脉络

运行时只有一条生产调用链：

```text
Codex Host event
  -> installed absolute hook_adapter.py
  -> owned-plan.py
  -> owned-catchup.py（仅 SessionStart 且 plan 已确认可注入）
  -> one Host JSON result
```

`UserPromptSubmit` 与 `SessionStart` 都先进入 adapter。adapter 先准备 canary，验证 Host JSON、事件、workspace、
session identity 与 transcript path，再构造 exact-version request。plan child 永远先执行；只有 `SessionStart`、
plan exact result 合法且 `inject=true` 时，adapter 才把已验证的 project state 交给 catch-up child。最终内容顺序固定
为 canary、可选 catch-up、plan，并且整个 Hook 只输出一个 Host JSON 对象。

这条顺序同时定义失败隔离：plan 失败时不启动 catch-up；catch-up 失败时仍保留已经验证的 plan；任何无法安全解释
的异常都退化为 canary-only，而不是拼接一部分未经验证的内容。adapter 对 child 的 stdin/stdout/stderr、总时限、
单 child 时限和进程组清理都有上限，防止脚本挂起、管道死锁或子孙进程逃逸。

### 运行时关键点

**Plan 路径。** `owned-plan.py` 先对 adapter request 做第二次 exact validation，再调用 pristine
`resolve-plan-dir.sh`。canonical precedence 是显式 `PLAN_ID`、`.planning/.active_plan`、最新 scoped plan、最后才是
root legacy。resolver 只负责选择；owned runtime 仍要重新检查绝对路径、scoped shape、root containment、
`task_plan.md` 存在性和 session attachment 状态，避免把 shell portability 结果直接当成可信路径。

计划文件通过 directory-fd 相对打开和 no-follow 约束读取，拒绝 symlink、hard link、非普通文件、超限文件和
无效 UTF-8；读取前后及重新打开后会比较文件和目录身份。通过验证的内容被复制到当前用户独占的临时目录，
snapshot 与文件使用收紧权限，并在 injector 前后再次复核原目录身份。pristine `inject-plan.sh` 只在这个最小
snapshot 中运行；无论成功失败，owned runtime 都关闭描述符并清理 snapshot。

**Catch-up 路径。** `owned-catchup.py` 只接受 adapter 已验证的 plan project state。已验证的 Host
`transcript_path` 优先；仅在 request 明确允许兼容 fallback 时，才扫描受控 session roots，而且候选按全局时间
排序，不因 root 顺序改变新旧关系。transcript 必须匹配 session identity、project 和非 subagent 条件；显式 Host
文件若身份不符、损坏或不可读，会直接 fail closed，不能偷偷换成另一个扫描结果。

可变 JSONL 在 no-follow、大小和文件身份约束下先冻结成 verified bytes，后续解析不再重读路径。unknown 但结构
完整的 record 只允许降级为 warning/event 语义；结构损坏则整份失败，不生成 partial report。catch-up 的水位线是
最后一次 planning update，只提取其后的未同步尾部，并对消息数、工具摘要、单条长度和总报告施加预算。其目标不是
总结整个会话，而是补齐“最后一次 planning 落盘之后”仍未同步的上下文。

**Host 与平台边界。** `session_id` 和经过根目录约束验证的 Host transcript path 是首选输入；store 扫描只是
显式兼容路径。真实 openat/no-follow、进程组、owner/mode 与跨用户假设属于 POSIX/Linux/Cloud gate，Windows
只能覆盖协议和 controlled-double 路径，不能替代这些平台证据。`/opt/codex` 只是带日期的 Cloud 默认事实，
runtime 优先消费显式 Host input/config 或受控探测，不把它升级成永久 ABI。

### 供应链与安装逻辑

端到端信任链可以压缩为：

```text
pinned upstream archive
  -> pristine repository projection
  -> runtime bundle authority
  -> deterministic Release ZIP
  -> checksummed external bootstrap
  -> verified installed snapshot
  -> adapter-only Managed policy
```

其中几类“清单”的职责必须分开理解：

| 层 | 唯一职责 | 明确不负责 |
|---|---|---|
| `upstream-manifest.json` | 固定 upstream/Skill provenance、archive 与 bundle integrity edge | 不再书写 runtime inventory |
| `runtime-bundle-v1.json` | 定义 source、package、installed path、mode、hash、dependency 与 helper allowlist | 不描述某台机器的安装结果 |
| `installed-manifest.json.runtime_files` | 记录 installer 已接管现场的精确快照与 ownership evidence | 不成为源码 inventory authority |
| `release-artifact-v1.json.entries` | 冻结 ZIP 可包含的文件集合 | 不决定 production dispatch 或现场 drift |

importer 必须先从 manifest 找到 bundle，并在解析前校验 bundle 原始字节 SHA；随后严格验证完整 bundle，再校验
upstream archive、成员路径、根目录、逐文件 hash、destination inventory 与 mode。导入使用受控 staging、fsync
和 atomic replace，目标是证明仓库里的四个 upstream runtime 确实来自 pinned archive 且保持 pristine。

installer 消费同一个已校验 bundle，把 adapter、两个 owned siblings、四个 pristine upstream 文件、两个已安装
plan contracts 与 notice 投影到 owned runtime。global PWF Skill 只是 pristine prerequisite，不进入 Managed handler。
`requirements.toml` 的 owned region、绝对 adapter handler、installed manifest 与 runtime 目录都带明确 ownership；
安装过程在锁内先捕获并复核 shared state，再备份、写入、生成现场 manifest，最后运行 doctor。

doctor 同时比较 package-derived expected state、installed snapshot、磁盘文件和 TOML policy。repair 只修复有充分
ownership 证据的已知 drift；未知文件、symlink、manifest 身份异常、unowned requirements 变化或并发修改都是
blocker。换言之，repair 不能通过改写 manifest 来“接受现场”，installer 也不能把未知状态静默声明为 owned。

Release builder 则只按独立 allowlist 确定 ZIP 边界，并固定顺序、时间戳、压缩参数、mode 与内容。外部 bootstrap
永远在 ZIP 外，通过 checksum 验证 pinned PWF archive、所需工具和 Hook ZIP，然后执行 dry-run、install、doctor
及协议检查。源码候选、公开资产、真实 Fresh/Resume 和稳定晋级是不同证据层，任何一层通过都不能替另一层背书。

### 架构演进路线

- **v0.1：验证失败边界。** legacy `hooks.json/config.toml` 路线无法满足 Cloud trust/registration；adapter 还直接
  执行可变 global Skill 并承担 plan 算法，功能和信任没有分层。
- **v0.2～v0.2.2：先证明 Managed policy 可行。** system-managed requirements 与绝对 adapter 路径打通 Cloud，
  随后补上 ownership、doctor、repair 和完整黑盒功能；它建立行为基线，但仍依赖现场 patch/global Skill 执行。
- **Phase 1：先建供应链再激活。** pinned provenance、runtime bundle、可复现 importer/installer/package 与 inactive
  inventory 先落地，避免在来源和回滚未闭合前直接切 production。
- **Phase 2：迁移 catch-up authority。** SessionStart 的 transcript 处理切到 repository-owned sibling，global Skill
  退出 production trusted graph。
- **Phase 3：迁移 plan authority。** canonical plan 选择和注入切到 owned-plan，adapter 中的平行算法被删除，
  private snapshot 把上游兼容渲染与 workspace trust boundary 分开。
- **successor 与 Phase 3.6～3.8：做减法。** 完成仓库 authority cutover，退休不可达 catch-up overlay，删除无 consumer
  的 programme metadata，再把 manifest/bundle 双写收敛为 bundle 单一 inventory authority。
- **v0.3.4：稳定闭合。** 在不启用 Phase 4 能力的前提下完成兼容治理、双通道 Cloud、不可变 publication 与
  pointer-only promotion，形成当前可回滚的 Product Phase 4 前基线。

这条路线的核心不是“不断添加 Hook”，而是先证明来源、安装与回滚，再逐条迁移 production authority，最后删除
过渡结构。每次演进都尽量保持 Host ABI 和用户可见 legacy 行为不变，只旋转一层信任边界。

<a name="phase-3-9-1-acceptance-conclusion"></a>

## Acceptance conclusion

v0.3.4 的源码、contracts、installer/importer、Release 规则与专项 Cloud 证据共同证明：production 只有 absolute
adapter 这一 Managed 入口；plan/catch-up 各自由 owned sibling 承担；global Skill 保持 pristine 且不被生产执行；
bundle 是 source/install inventory authority；失败语义能够在拒绝不可信内容的同时保住 Codex 主循环。

这些证据不表示 pinned upstream 中所有功能都已激活，也不表示 Windows 回归替代了 Linux/Cloud 边界，更不表示
本文提出的后续路线已经获得实施或发布授权。

<a name="phase-3-9-1-explicit-non-goals"></a>

## Explicit non-goals

- 不修改 production、Host ABI、runtime bundle、installer、Release entries、bootstrap 或已发布 v0.3.4 字节。
- 不把本摘要提升为 programme、版本角色、contract、acceptance 或活动 Next Step authority。
- 不启用 attestation、nonce、autonomous/gated mode、ledger 或新的 Hook event。
- 不删除 pristine injector 的条件依赖；“当前不可达”不等于“可以脱离 dependency graph 单独删除”。
- 不合并 installed snapshot 与 Release allowlist，也不把 global PWF Skill 重新引入 production execution。

<a name="phase-3-9-1-successor-inheritance"></a>

## Successor inheritance

后继维护者应继承四条不变量：adapter-only Managed policy；owned plan/catch-up trust boundary；bundle 单一
source/install inventory authority；内容 fail closed、advisory loop fail open。任何新能力都应说明它进入哪一层、
由谁拥有、怎样回滚，以及是否改变 Host ABI、trusted graph、hash、inventory 或 Release identity。

建议把后续工作分成彼此独立的路线，而不是混进一次大改：

1. **低风险兼容清理。** 处理已经有证据支持的 stale notice、历史尾项、过拟合 test title 或 prose lock；保持
   runtime 算法与 machine contracts 不变。只要触及 Release 输入，仍需正常的新版本 seal 和 Cloud gate。
2. **独立 contract/Release v2 gate。** 评估退休 overlay-era tombstone、manifest 未消费字段和不完整 top-level exact
   schema；把 ZIP executable mode 收敛进唯一 machine authority；对 machine metadata 采取“严格消费或迁出”之一。
   这类工作会旋转 contract/hash/Release identity，不能冒充文档清理。
3. **Phase 4 Discovery。** 重新扫描 Host/Cloud 事实，冻结 attestation、nonce 与 opt-in v3 mode 的 ABI、默认关闭、
   rollback 和 tamper 模型；同时统一决定 catch-up schemas 是否进入 installed runtime。Discovery 通过前不得让
   snapshot 暴露 mode/attestation/ledger，也不得新增 production dispatch。
4. **更长期 programme。** 在 Phase 4 闭合后，再依次评估 compaction lifecycle、selective tool/permission hooks、
   advisory completion 与 optional hard gating。每个 Product Phase 都重新做 Discovery、最近边界测试、真实
   Linux/Cloud gate 和独立 Release closure，不从本文继承实施授权。

<a name="phase-3-9-1-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/59a999f705701ec67463649e9424f3d059863c81)

该链接只证明 v0.3.4 闭合时的历史源码字节，不解释当前实现；当前 contract、行为、版本角色与授权以当前仓库
authority 为准。
