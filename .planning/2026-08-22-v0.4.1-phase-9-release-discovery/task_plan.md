# Task Plan: v0.4.1 Phase 9 Release Discovery

## Goal

以已经通过本地与 Source/Candidate Cloud 验收的 `v0.4.1-dev` 安全补丁为候选，复用仓库成熟的 Phase 9
发布治理，冻结从 pre-seal 到 immutable publication、Published Release Cloud、Latest promotion 与角色轮换的
逐 gate 路线；本列车不夹带历史兼容精简。

## Next Step

等待维护者审阅 Discovery 结论并决定是否单独授权 P9-A。若授权，P9-A 只实施 stable identity/pre-seal
materialization 与本地 zero-hash candidate 验证；停止在 exact-hash seal、Cloud、tag、Release 和远端动作之前。

## Current Phase

Phase 1 complete / waiting for P9-A authorization

## Phases

### Phase 1: Release Discovery

- [x] 恢复 `v0.4.0` P9-A～P9-F 的实际职责、顺序、operator 与 evidence authority。
- [x] 审计 `v0.4.1-dev` 当前 HEAD、Release ZIP 输入、zero-hash bootstrap、版本字符串和文档状态。
- [x] 冻结 v0.4.1 最小 gate、退出条件、回滚边界、维护者/智能体职责与逐 gate 授权点。
- [x] 向维护者提交路线建议；未获确认前不进入 materialization。
- **Status:** complete

### Phase 2: P9-A pre-seal materialization

- [ ] 在独立授权后冻结 stable identity、ZIP 输入、版本文档和 candidate role。
- [ ] 完成相称本地验证与单一范围 commit。
- **Status:** pending / not authorized

### Phase 3: P9-B seal and exact final-source Source/Candidate

- [ ] 双构建最终 ZIP，冻结 ZIP SHA，写入 ZIP 外 bootstrap，再冻结 bootstrap SHA。
- [ ] 从 exact final source 重跑 Source/Candidate Cloud，不继承 pre-seal Cloud PASS。
- **Status:** pending / not authorized

### Phase 4: P9-C immutable Pre-release publication

- [ ] 由维护者创建 immutable tag/Pre-release 并上传双资产。
- [ ] 重新下载资产，核对 tag/source/filename/size/SHA 与 publication oracle。
- **Status:** pending / not authorized

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

- 当前已授权：创建并切换本 Release Discovery plan、只读分析、持久化发现与提出路线建议。
- 尚未授权：P9-A materialization、版本/seal/bootstrap 字节改写、正式 Cloud gate、tag、Release、Latest、远端 ref
  或资产变更。
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

## Current Status

`CONDITIONAL_GO_TO_V0_4_1_P9_A_PRE_SEAL_MATERIALIZATION / P9_A_NOT_AUTHORIZED / RELEASE_NOT_AUTHORIZED`
