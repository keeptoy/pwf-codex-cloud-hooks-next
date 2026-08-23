# Findings: v0.4.2 Release governance synchronization

## Maintainer-approved model

- 一个正式Discovery Round对应一轮相称的Product验收；multi-Discovery版本按新增risk/behavior claim分别验收。
- 真正发布时仍固定需要Source/Candidate和Published Release两个身份/环境通道；这是同一Release生命周期内的两次独立执行，不是两个Discovery Round。
- Release四步保持：candidate validation → immutable Pre-release publication → public-asset validation → Latest promotion/postflight。
- 第1、3步是Cloud hard acceptance；第2、4步由维护者执行控制面状态变更和只读核验，不增加黑盒轮次。
- 一份Release operator guide可以编排两个通道。Source/Candidate完成后记录channel checkpoint并停在publication前；Published完成后才写最终Post-run并冻结。
- Product/Discovery证据只有在绑定final exact source且所有Release输入保持不变时，才能直接承担Source/Candidate；否则重跑最终候选通道。
- ROADMAP 4.3的两轮retirement review与验收无关：它们是两个对象治理时点。无独立Product Phase的小patch/governance列车，第一轮可落在candidate baseline closeout。

## Expected authority routing

| Authority | Expected change |
|---|---|
| ROADMAP | programme级说明三轴分离、Release四步的两次Cloud/两次控制面、patch train第一轮review触发点 |
| Cloud hard acceptance template | 稳定双通道协议、channel checkpoint证据与exact evidence reuse admission |
| Operator Guide template | 多通道guide的intermediate checkpoint与final Post-run/freeze生命周期 |
| Repository governance guide | 长期文档职责、checkpoint不冒充final status、review不产生guide |
| DESIGN | 仓库地图同步两模板的新分工 |
| Governance tests | 保护上述术语、路由、Release排除和历史不改写 |

## Preserved boundaries

- README继续管理稳定构建/验证入口，本轮不改变命令。
- MAINTAINER_HANDOFF继续只做接手与结果分流，不复制Release教程。
- 历史acceptance/runbook/operator guide不改名、不回写。
- 三份补回历史acceptance保持untracked reference fixtures。
- package保持`0.4.1`；当前仍是governance-only source train，不启动v0.4.2产品Release。

## README / ARCHITECTURE confirmation

- README已经把稳定封板顺序固定为“冻结ZIP输入→构建/hash→写bootstrap→bootstrap hash→发布→重新下载双资产”；本轮不需要改动该用户/开发命令authority。
- README明确本地双构建/hash不等于seal、publication、Cloud acceptance或rollback晋级；因此不能删除Published Release通道。
- ARCHITECTURE只冻结Release字节不可改写、bootstrap在ZIP外、候选源码不能单独建立Release等系统不变量；它没有承担programme步骤或guide状态语义，本轮无需修改。
- 当前改动应继续限定在governance docs/tests/planning；若发现需要修改README稳定命令或ARCHITECTURE信任边界，按Stop Conditions暂停。

## DESIGN / ROADMAP confirmation

- DESIGN当前把Cloud hard template定义为双通道执行协议，把Operator Guide template定义为单一Discovery Round的Pre-run→Post-run→freeze骨架；需要最小补充“多通道guide的中间channel checkpoint不等于final Post-run”。
- ROADMAP 4.3当前把第一轮review只绑定Product Phase closeout，对不进入新Product Phase的patch/governance train存在触发点歧义；应扩展为“Product Phase closeout或无独立Phase列车的candidate baseline closeout”。
- ROADMAP 8.1四步顺序正确，但仍使用泛化的“版本acceptance”措辞，且没有显式说明第1/3步是两次Cloud通道、第2/4步是维护者控制面动作。
- ROADMAP已经明确P9-D Cloud PASS后P9-E只改metadata、不继承或重跑Cloud，这可作为“四步不是四轮黑盒”的现成programme证据。
- ROADMAP 7.2已经规定普通文档同步不新增Discovery Round；本轮是获批治理同步，不改变Release boundary本身。

## Template / repository-governance gap

- Cloud hard template 0.1/0.2和第10节已经允许同一Release guide分别保存两个通道，但第0节仍把所有实际证据统称为最终Post-run，缺少“Source/Candidate完成后、publication尚未发生”的合法中间状态。
- Operator Guide最终生命周期必须区分`channel checkpoint`与`final Post-run status`：checkpoint只证明一个声明通道PASS并强制停止在下一gate前；不会freeze guide，也不能授权publication/promotion。
- 正常的`SOURCE_CANDIDATE_PASS / PUBLISHED_RELEASE_NOT_RUN`不是`POST_RUN_INCOMPLETE`；INCOMPLETE只用于本应取得最终状态却因环境/权限/session中断而无法分类。
- repository-governance 11.1当前写成“真实执行后追加Post-run随后冻结”，需同步多通道例外，并明确两轮retirement review不创建guide、不重跑黑盒。
- Cloud hard template第10节是最合适的channel checkpoint evidence authority；ROADMAP只应维护programme级四步和角色，不复制checkpoint字段清单。

## Exact implementation scope

- 修改：`ROADMAP.md`、`DESIGN.md`、`docs/cloud-hard-acceptance-template.md`、`docs/cloud-acceptance-operator-guide-template.md`、`docs/repository-governance-guide.md`。
- 测试：`tests/architecture-contracts.test.js`与`tests/repository-boundary.test.js`。
- 状态：`.planning/.active_plan`与本任务三份planning记录。
- 不修改：README、ARCHITECTURE、AGENTS、MAINTAINER_HANDOFF、历史acceptance/runbook/operator guide、production/contracts/runtime/manifest/package/bootstrap/Release inputs。

## Implementation outcome

- ROADMAP 4.3明确两轮retirement review只是candidate closeout与accepted role rotation的对象治理，不是Cloud acceptance；无独立Product Phase的小型patch/governance列车在candidate baseline closeout完成等价第一轮review。
- ROADMAP 8.1继续保留Release四步，但明确第1/3步是两次独立Cloud执行，第2/4步是维护者控制面动作；新增三轴对照避免Discovery、Release channels与retirement reviews互相冒充。
- Operator Guide template新增`Channel checkpoints（多通道 guide）`与`Final Post-run status`：Source/Candidate PASS后可记录中间证据并停止，guide保持开放；全部声明范围闭合后才finalize/freeze。
- Cloud hard template第10节成为checkpoint/final evidence写回authority，并冻结exact final-source证据复用条件；Published Release因公开identity尚不存在不能提前复用。
- Repository governance与DESIGN同步职责；两处契约测试保护新anchor、marker、三轴分工、第一轮review触发点、Release排除与历史不改写。
- 本轮不改变任何可执行Cloud脚本、stable build command、production、Host ABI、trusted graph、Release inventory或package identity，因此不需要新的Cloud黑盒。
