# Task Plan: ROADMAP migration-governance decoupling

## Goal

把 ROADMAP 第8节收敛为版本与Phase无关的 migration transaction / 对象生命周期治理规则，移除F1A/F1B施工实例对current programme authority的耦合，同时保留必要的历史恢复入口和稳定anchor。

## Next Step

维护者按需push本地治理commit；当前任务没有后续授权动作。

## Current Phase

Complete

## Phases

### Phase 1: Analyze authority and references

- [x] 识别第8节中通用规则、Phase 4实例和兼容引用。
- [x] 决定旧anchor及历史实例的最小保留方式。
- **Status:** completed

### Phase 2: Implement governance rewrite

- [x] 改写ROADMAP第8节开头，使transaction规则版本/Phase无关。
- [x] 更新相应architecture/repository governance contract。
- **Status:** completed

### Phase 3: Validate and commit

- [x] 运行focused/full regression与断链/静态审计。
- [x] 创建单一职责本地commit并停止，交由维护者push。
- **Status:** completed

## Authorization

- 已授权：继续ROADMAP文档治理，去除第8节对Phase 4 F1A/F1B施工分段的耦合；更新必要测试、planning并创建本地commit。
- 未授权：修改production/contracts/package/Release inputs、历史事实或任何远端状态。

## Stop Conditions

- 不删除仍承担外部稳定链接合同的anchor，除非证明无入链并得到维护者明确授权。
- 不把某个历史实例改写为未来所有迁移必须照抄的固定gate数量。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 首次组合读取引用时指定了不存在的Phase 4.14文件名，导致`rg`整体exit 1 | 1 | ROADMAP正文已成功读取；改用`rg --files`定位真实历史文件名后再做有界审计 |
| 首次阶段状态补丁预期Phase 2复选框已经勾选，实际仍为未勾选，apply_patch整体拒绝 | 1 | 目标文件无部分修改；按实际内容同时勾选并推进Phase 3 |

## Current Status

`COMPLETE`
