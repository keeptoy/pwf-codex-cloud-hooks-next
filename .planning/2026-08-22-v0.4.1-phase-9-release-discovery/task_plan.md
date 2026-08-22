# Task Plan: v0.4.1 Phase 9 Release Discovery

## Goal

以已经通过本地与 Source/Candidate Cloud 验收的 `v0.4.1-dev` 安全补丁为候选，复用仓库成熟的 Phase 9
发布治理，冻结从 pre-seal 到 immutable publication、Published Release Cloud、Latest promotion 与角色轮换的
逐 gate 路线；本列车不夹带历史兼容精简。

## Next Step

等待维护者push当前P9-C operator commit，并按版本acceptance从exact tag source创建lightweight tag/Pre-release、上传双资产、
重新下载并完成publication audit；回传`P9_C_PUBLICATION_AUDIT=PASS`前不写P9-C PASS，不进入P9-D。

## Current Phase

Phase 4 in progress / P9-C operator ready; maintainer publication and audit pending

## Phases

### Phase 1: Release Discovery

- [x] 恢复 `v0.4.0` P9-A～P9-F 的实际职责、顺序、operator 与 evidence authority。
- [x] 审计 `v0.4.1-dev` 当前 HEAD、Release ZIP 输入、zero-hash bootstrap、版本字符串和文档状态。
- [x] 冻结 v0.4.1 最小 gate、退出条件、回滚边界、维护者/智能体职责与逐 gate 授权点。
- [x] 向维护者提交路线建议；未获确认前不进入 materialization。
- **Status:** complete

### Phase 2: P9-A pre-seal materialization

- [x] 原子传播 `0.4.1` stable identity，rename bootstrap/acceptance，保持历史 evidence 语义与 zero hash。
- [x] 同步 Release contract SHA edge、CHANGELOG、ROADMAP 和当前角色/Release 边界测试。
- [x] 运行完整本地矩阵、双构建与 Release-input 审计，冻结 pre-seal candidate facts。
- [x] 完成相称本地验证与单一范围 commit。
- **Status:** complete / stop before P9-B

### Phase 3: P9-B seal and exact final-source Source/Candidate

- [x] 双构建最终 ZIP，冻结 ZIP SHA，写入 ZIP 外 bootstrap，再冻结 bootstrap SHA。
- [x] 从 exact final source 重跑 Source/Candidate Cloud，不继承 pre-seal Cloud PASS。
- **Status:** complete / exact seal source、Linux零skip、lifecycle与deep-check PASS；stop before P9-C

### Phase 4: P9-C immutable Pre-release publication

- [ ] 由维护者创建 immutable tag/Pre-release 并上传双资产。
- [ ] 重新下载资产，核对 tag/source/filename/size/SHA 与 publication oracle。
- **Status:** in progress / operator ready; tag source frozen; maintainer publication/audit pending

### Phase 5: P9-D Published Release Cloud

- [ ] 从公开 bootstrap 默认下载链在全新 Cloud 完成 Fresh/Resume/doctor/deep-check。
- [ ] 写回 exact public-asset evidence；失败不得重传同名资产修补。
- **Status:** pending / not authorized

### Phase 6: P9-E Latest promotion and role rotation

- [ ] Published Release PASS 后，由维护者执行 pointer-only Latest promotion。
- [ ] 核对新 accepted、immediate fallback 和 immutable bytes 均未改写。
- **Status:** pending / not authorized

### Phase 7: P9-F retirement and next-train handoff

- [ ] 对退出 candidate/accepted 窗口的对象执行 `RETIRE / MIGRATE / KEEP`。
- [ ] 历史兼容精简只形成下一列车 Discovery handoff，不夹带进 `v0.4.1`。
- **Status:** pending / not authorized

## Frozen Invariants

- `v0.4.1` 保持 path-safety compatibility/security patch，不加入历史兼容删除或新 Product Phase。
- 现有 Source/Candidate PASS 证明 pre-seal candidate 可发布，不替代 seal 后 exact final-source Cloud。
- ZIP 输入变化会使 seal 重新开始；bootstrap 永远在 ZIP 外，正式 candidate 必须使用 exact ZIP SHA。
- Source/Candidate、Publication audit 与 Published Release 是三种不同证据，不得互相替代。
- 已发布 tag、资产、URL 与 SHA 不可改写；失败使用新身份，不重传同名字节。
- 智能体负责本地分析、文档、验证与 commit；维护者负责 push、Cloud UI、tag、Release、Latest 和其他远端写。

## Authorization

- 已完成授权：P9-A stable identity/pre-seal materialization、本地验证、planning/acceptance/ROADMAP 更新与本地 commit。
- 已完成授权：P9-B exact-hash local seal、sealed-source Cloud教程与验收、planning/acceptance/ROADMAP evidence写回和本地commit。
- 当前已授权：P9-C tag source/双资产身份冻结、Pre-release publication与download audit操作单、相称本地验证、planning/acceptance/ROADMAP更新和本地commit。
- 维护者仍负责push与P9-C远端执行；智能体不得创建tag/Release或上传资产。P9-D、Latest、角色轮换及其他后继gate均未授权。
- 每一关键 gate 必须在专项设计和维护者明确授权后进入。

## Stop Conditions

- Discovery 发现需要改变 production、Host ABI、trusted graph、upgrade/rollback 合同或 Release ZIP inventory。
- 需要把历史兼容精简、Product Phase 5 或其他新功能夹带进 `v0.4.1`。
- exact source、ZIP/bootstrap identity、Cloud environment 或维护者回传证据无法唯一对应。
- 下一步需要远端写、正式 Cloud、tag、Release 或 Latest，而维护者尚未明确授权该 gate。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell/.NET 不支持静态 `SHA256.HashData` 与 `Convert.ToHexString` | 1 | 改用 `Get-FileHash -Algorithm SHA256`，得到 contract SHA 与 manifest edge 完全一致；未重复原失败方法 |
| P9-B size evidence测试未允许Markdown反引号 | 1 | 保留可读的`` `85,910` bytes ``证据格式，修正测试对千分位和反引号的规范化匹配 |
| 首次反引号修正破坏JavaScript template literal语法 | 1 | `node --check`在测试运行前拦截；改为普通字符串拼接构造正则，未重复失败转义 |
| sandbox内Node test runner创建隔离子进程时报`spawn EPERM` | 1 | 改用`--test-isolation=none`确认新证据断言对旧pending文档产生预期红灯；最终完整复验改在正常执行面运行 |
| Web工具拒绝直接打开GitHub API tag/Release端点并报告unsafe URL | 1 | 不把工具错误当作remote absence；改用仓库既定`gh api --include`只读preflight并要求明确HTTP 404 |
| P9-C operator实现后聚焦测试仅因ROADMAP的`本地path-safety`缺少既定空格而1项失败 | 1 | 归类为fixture wording drift；恢复`本地 path-safety`规范表述，不改变任何Release或gate语义 |
| 首次wording修正后旧断言仍要求P9-B pending阶段的长句 | 1 | 更新断言绑定当前P9-C宏观边界`P9-B已PASS；P9-C operator已冻结tag source与双资产`，不把历史措辞当永久合同 |
| 第二次复验暴露同一测试中的冗余旧短语`sealed-source Cloud PASS` | 1 | 删除被更精确P9-B Source/Candidate PASS断言完全覆盖的重复断言，保留P9-C/P9-D状态断言 |

## Current Status

`P9_C_OPERATOR_READY / TAG_SOURCE_FROZEN / MAINTAINER_PUBLICATION_PENDING / STOP_BEFORE_P9_D`
