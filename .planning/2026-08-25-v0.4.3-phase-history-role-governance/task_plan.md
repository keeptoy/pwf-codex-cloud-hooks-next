# Task Plan: v0.4.3 Phase history role governance

## Goal

在继续归属Product Phase 4的前提下开启`v0.4.3-dev`文档治理列车，明确`docs/history/`是精选历史过程账本，冻结回顾型`RETROSPECTIVE_CAPSULE`与探路/决策型`FROZEN_DISCOVERY_RECORD`两种身份，并保持ROADMAP第5节为长期Product Phase摘要与现行programme authority。

## Next Step

Phase 1本地提交后，先向维护者汇报history两角色边界与验证结果；后续再讨论Phase 2的history编排、重复摘要和入口盘点，不自动扩大当前批次。

## Current Phase

Phase 1 complete; Phase 2 pending maintainer discussion

## Phases

### Phase 1: Development identity and role-boundary discovery

- [x] 创建本地`0.4.3`分支并把development package identity原子更新为`0.4.3-dev`。
- [x] 盘点history索引、治理指南、模板、ROADMAP与测试对两种record role的现有表达。
- [x] 冻结大白话边界：history是精选过程账本，不是原始日志；ROADMAP第5节是长期Phase摘要。
- [x] 实施最小文档与测试修改，运行风险相称验证并独立提交。
- **Status:** completed

### Phase 2: Follow-up documentation-governance Discovery

- [ ] 在Phase 1通过后盘点剩余history编排、重复摘要与入口边界。
- [ ] 先向维护者报告建议，再按明确授权进入后续批次。
- **Status:** pending

## Decisions Made

| Decision | Rationale |
|---|---|
| v0.4.3继续归属Product Phase 4 | 这是v0.4.2之后的文档治理patch train，不自动激活TBD Product Phase 5。 |
| history只有两种record role | 回顾型capsule与当时形成的Discovery/decision record回答不同历史问题，不能混成第三种长期authority。 |
| ROADMAP第5节保存长期摘要 | history保存精选过程与时间语义；programme长期结论不能反向沉入历史流水账。 |

## Authorization

- 已授权：版本迭代为`v0.4.3-dev`，继续Phase 4文档治理。
- 已授权：明确history两种角色及“过程流水账”定位，并同步ROADMAP长期摘要边界和测试。
- 未授权：删除任何planning/history/acceptance，修改production/runtime/contract行为，push或远端branch/tag/Release/Cloud动作。

## Stop Conditions

- 若版本改号发现ZIP输入、bootstrap hash或Release身份需要seal，先保持development zero-hash并停止在本地候选前。
- 若发现第三种history身份确有独立生命周期需求，先报告，不强行归类。
- 历史正文保持时间语义；本轮不批量改写已冻结record。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 首次版本inventory把不存在的`package-lock.json`和未由PowerShell展开的`init-cloud-sandbox-v*.bash`直接传给`rg` | 1 | 已返回其余有效结果；改用`rg --files`枚举真实文件，再按明确路径搜索，不重复错误glob。 |
| 首份v0.4.3组合补丁因ROADMAP段落换行上下文不匹配而整体拒绝 | 1 | 没有部分修改；拆为machine identity、ROADMAP和history入口三个有界补丁。 |
| bootstrap动态apply_patch构造首次使用不可用的V8 `atob()` | 1 | 只读提取成功、未写文件；改用纯JavaScript Base64解码函数后再调用apply_patch。 |
| bootstrap动态apply_patch第二次发现V8也无`TextDecoder` | 2 | 仍未写文件；bootstrap为ASCII，改用分块`String.fromCharCode`解码，不依赖Web API。 |
| 首次测试引用扫描的PowerShell双引号正则被内部引号截断 | 1 | 搜索未执行；改用单引号literal pattern，不重复原转义。 |
| 修正后的测试扫描仍包含不存在的`tests/release-artifact.test.js`并以exit 1结束 | 1 | 有效匹配已完整返回；用`rg --files tests`确认真实文件为`release-package.test.js`，后续只使用真实路径。 |
| Node canonical-hash脚本在沙箱内派生`git show`子进程返回EPERM | 1 | 未写入；改由PowerShell只读Git字节并通过临时环境变量交给Node纯计算。 |
| Node test runner在Windows沙箱内创建worker时返回`spawn EPERM` | 1 | 三个测试文件未进入断言；在获准的沙箱外用原命令复验，33/33及后续45/45全部通过。 |
| Git Bash在Windows沙箱内因error 5无法创建signal pipe | 1 | ZIP build/check及Python/Node静态检查已先通过；在获准的沙箱外重跑全部bootstrap `bash -n`并通过。 |

## Current Status

`V0_4_3_DEV_IDENTITY_ACTIVE / HISTORY_TWO_ROLE_GOVERNANCE_COMPLETE / FOLLOW_UP_DISCOVERY_PENDING / PRODUCT_PHASE_4`
