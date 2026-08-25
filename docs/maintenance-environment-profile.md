<a name="maintenance-environment-profile"></a>

# 维护执行环境限制与对策档案

## 1. 文档定位

本文件是本仓库对**本地维护机与远程/Cloud执行面的已确认物理/工具限制、影响和默认对策**的持久权威。它解决的是“当前
执行面真实能提供什么证据、缺少什么primitive、默认怎样绕行、何时需要重验”，不是Codex Host ABI、产品支持合同、验收
教程或永久不变的平台承诺，也不授权安装软件、调用Cloud、push、Release或其他外部写操作。

活动planning继续保存当次探测命令、原始输出、错误和gate证据；凡是已经确认、会反复影响后续任务或跨阶段执行路由的限制，
不得只记录在planning。关闭或清退计划前，必须把稳定结论、适用执行面、影响、默认绕行与重验触发器提升到本文件。通用提升规则见
[仓库治理指南的维护环境记忆](repository-governance-guide.md#maintenance-environment-memory)。

远程/Cloud不表示一台永久固定的“远程机器”。只有真实task或维护者证据证明、并且会跨任务改变执行路线的能力/限制才登记；
某次task的临时网络、进程、权限或工具错误仍留在planning。具体Cloud gate步骤、prompt与PASS证据继续由版本acceptance和稳定
template管理。

## 2. 当前已确认的本地执行面事实

本地事实最后核对日期：**2026-08-22**。事实来源是维护者参与的本机只读能力审计；本表不保存易泄露隐私的绝对个人路径、
账户信息、设备标识或完整命令输出。

| 环境面 | 状态 | 已确认事实 | 对验收的影响 | 默认解决方案 |
|---|---|---|---|---|
| 本地操作系统 | `CONFIRMED` | 当前维护机是Windows执行面 | 可运行跨平台源码、Node、Python、PowerShell与静态治理检查；不能仅凭本机结果声称Linux行为成立 | 本地完成可诚实执行的检查；平台专属证据按下表转Cloud |
| WSL | `CONFIRMED` | `wsl.exe`存在，但没有已安装发行版 | 没有可用的真实WSL Linux用户空间，不能把命令入口存在解释为Linux gate可执行 | 不重复搜索发行版；需要时按重验触发器取得维护者授权后再探测 |
| 本地容器 | `CONFIRMED` | Docker、Podman和nerdctl均不存在 | 当前没有受支持的本地Linux容器执行面 | 不反复搜索或自行安装；把Linux gate写入Cloud验收教程 |
| Git Bash / MSYS | `CONFIRMED_BOUNDARY` | 即使Git Bash可执行shell语法，它也不能替代真实Linux/POSIX证据 | 不得用它证明POSIX权限、FIFO/device、进程组或真实Linux filesystem语义 | 只用于相称的Bash语法检查；平台语义交给Linux Cloud |

## 3. 当前已确认的远程 / Cloud执行面事实

远程事实最近复核日期：**2026-08-25**。下表以真实
[`v0.4.2 Source/Candidate`](acceptance/v0.4.2-cloud-hard-acceptance.md#v0-4-2-source-candidate-channel-checkpoint)
和维护者回传为依据；它们是带适用范围的执行事实，不把一次Cloud task冻结成永久平台合同。

| 环境面 | 状态 | 已确认事实 | 对验收的影响 | 默认对策 |
|---|---|---|---|---|
| Source/Candidate Linux Cloud | `CONFIRMED_ROUTE` | disposable Linux Cloud已真实跑通portable Linux suite和本机缺失的Linux/POSIX证据 | 它证明Cloud是当前可用的Linux gate路线，不证明所有未来task具有相同镜像、工具或路径 | 版本guide显式冻结checkout、输入和所需primitive；每轮保存真实输出，不沿用旧task环境猜测 |
| Cloud Host路径/默认值 | `CONFIRMED_BOUNDARY` | `/opt/codex`是已观察到的带日期默认事实，不是永久常量 | 把该路径硬编码成跨版本Host合同会在环境变化时误路由 | 优先使用显式Host input/config或受控探测；发生冲突信号时按第7节重验 |
| Cloud task工具inventory | `CONFIRMED_VARIABILITY` | v0.4.2 C步骤task只有Shell型读取与apply_patch，没有独立只读文件工具 | 同一步若既要求存在性检查又绝对禁用唯一可用读取面，会安全停止而不是形成产品失败 | 优先独立只读工具；缺失时仅按稳定template允许的exact-path只读Shell preflight，写入仍只用apply_patch；无获批fallback则停止 |

三种remote状态含义不同：`CONFIRMED_ROUTE`是已经跑通的替代路线，`CONFIRMED_BOUNDARY`是不得硬编码的环境边界，
`CONFIRMED_VARIABILITY`要求每个相关task重新核对能力。三者都不能从一次PASS推导永久可用性。

## 4. 默认验收路由

| 证据需求 | 本地处理 | 默认缺口路由 |
|---|---|---|
| 跨平台单元测试、静态文档契约、builder/importer逻辑 | 在Windows维护机运行并保存真实结果 | 无平台缺口时留在本地职责范围 |
| Bash语法 | 可以使用现有Bash入口做语法级检查 | 不把语法PASS提升为Linux runtime PASS |
| Linux零skip、POSIX权限、FIFO/device、进程组、symlink或真实filesystem行为 | Windows诚实标记SKIP或platform limitation | 在版本Source/Candidate Cloud教程中编排真实Linux gate，由维护者启动Cloud任务并带回原始输出 |
| Cloud路径、工具或runtime默认值 | 不从本地或旧task猜测 | 由当前guide冻结输入并在Cloud task做有界核对；存在已批准fallback时按合同使用，否则停止并回补教程 |
| 新工具、WSL发行版或容器安装 | 默认不执行 | 只有维护者明确授权当前有界任务后才安装或重新探测；该授权不自动延续 |

大白话：本机能测的在本机测；本机物理上缺少的能力直接写进Cloud教程，不要每一轮重新搜索WSL、Docker或其他容器，也不要
拿Git Bash“假装Linux”。Cloud同样不是永远不变的万能机器：已跑通的路线可以复用，具体路径和工具能力仍按当前task核对；
有稳定fallback就按合同走，没有就停下来补教程。

## 5. 状态与证据边界

- `CONFIRMED`只表示指定执行面在标注日期的已确认事实；`CONFIRMED_*`后缀进一步说明它是route、boundary还是variability。
- 事实来源优先是维护者陈述、有界只读探测或immutable acceptance；来源必须能区分local与具体remote/Cloud范围。
- 职责分工、外部写权限、Host ABI和产品支持范围分别由AGENTS、contracts/architecture与README管理，不因登记环境事实而变化。
- 版本guide和acceptance可以消费本档案决定“gate放在哪里跑”，但本档案不复制步骤、prompt、SHA、测试计数或PASS状态。

## 6. 跨阶段登记规则

新发现只有同时满足下列条件，才从活动planning提升到本文件：

1. 已由维护者陈述或只读探测确认，不是模型猜测；
2. 会在多个任务、Discovery Round、Release gate或版本列车中重复影响默认执行路由；
3. 能写清适用的local或remote/Cloud执行面、核对日期、影响、可用替代方案和重验条件；
4. 不包含秘密、账户身份、个人绝对路径、设备唯一标识或无长期价值的完整日志。

单次网络抖动、某轮临时进程、一次性dirty state、具体测试输出和未分类错误继续留在planning/progress；不要把所有现场噪声都
堆进长期档案。若限制已消失，不删除旧事实来伪装从未发生；更新状态与日期，并用简短说明指出它被什么新事实取代。

## 7. 重验触发器与更新事务

只有出现以下重验触发器之一，才重新探测已登记执行面：

- 维护者明确说明主机、工具或环境已经改变；
- 任务明确授权安装/启用某个执行面；
- 既有命令出现与本档案冲突的成功或失败信号；
- 新gate确实要求当前档案尚未分类的local或remote primitive。

触发后先做最小只读探测，原始输出写活动progress，结论写findings；若确认跨阶段事实发生变化，在同一文档事务中更新本文件的
日期、状态、影响和默认方案，并同步AGENTS中的执行摘要；scope或新人入口改变时同步README文档地图。没有触发器时继续使用
最近适用的`CONFIRMED*`结论，不为“确认还是没有”重复消耗时间。
