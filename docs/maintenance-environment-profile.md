<a name="maintenance-environment-profile"></a>

# 维护机执行环境档案

## 1. 文档定位

本文件是本仓库对**当前维护机物理/工具执行面限制、影响与默认解决方案**的持久权威。它解决的是“这台维护机现在能提供
哪些本地证据、缺失能力默认送到哪里”，不是Codex Host ABI、产品支持合同或永久不变的机器事实，也不授权安装软件、调用
Cloud、push、Release或其他外部写操作。

活动planning继续保存当次探测命令、原始输出、错误和gate证据；凡是已经确认、会反复影响后续任务或跨阶段执行路由的限制，
不得只记录在planning。关闭或清退计划前，必须把稳定结论、影响、默认绕行与重验触发器提升到本文件。通用提升规则见
[仓库治理指南的维护环境记忆](repository-governance-guide.md#maintenance-environment-memory)。

## 2. 当前已确认事实

最后核对日期：**2026-08-22**。事实来源是维护者参与的本机只读能力审计；本表不保存易泄露隐私的绝对个人路径、账户信息、
设备标识或完整命令输出。

| 环境面 | 状态 | 已确认事实 | 对验收的影响 | 默认解决方案 |
|---|---|---|---|---|
| 本地操作系统 | `CONFIRMED` | 当前维护机是Windows执行面 | 可运行跨平台源码、Node、Python、PowerShell与静态治理检查；不能仅凭本机结果声称Linux行为成立 | 本地完成可诚实执行的检查；平台专属证据按下表转Cloud |
| WSL | `CONFIRMED` | `wsl.exe`存在，但没有已安装发行版 | 没有可用的真实WSL Linux用户空间，不能把命令入口存在解释为Linux gate可执行 | 不重复搜索发行版；需要时按重验触发器取得维护者授权后再探测 |
| 本地容器 | `CONFIRMED` | Docker、Podman和nerdctl均不存在 | 当前没有受支持的本地Linux容器执行面 | 不反复搜索或自行安装；把Linux gate写入Cloud验收教程 |
| Git Bash / MSYS | `CONFIRMED_BOUNDARY` | 即使Git Bash可执行shell语法，它也不能替代真实Linux/POSIX证据 | 不得用它证明POSIX权限、FIFO/device、进程组或真实Linux filesystem语义 | 只用于相称的Bash语法检查；平台语义交给Linux Cloud |

## 3. 默认验收路由

| 证据需求 | 本地处理 | 默认缺口路由 |
|---|---|---|
| 跨平台单元测试、静态文档契约、builder/importer逻辑 | 在Windows维护机运行并保存真实结果 | 无平台缺口时留在本地职责范围 |
| Bash语法 | 可以使用现有Bash入口做语法级检查 | 不把语法PASS提升为Linux runtime PASS |
| Linux零skip、POSIX权限、FIFO/device、进程组、symlink或真实filesystem行为 | Windows诚实标记SKIP或platform limitation | 在版本Source/Candidate Cloud教程中编排真实Linux gate，由维护者启动Cloud任务并带回原始输出 |
| 新工具、WSL发行版或容器安装 | 默认不执行 | 只有维护者明确授权当前有界任务后才安装或重新探测；该授权不自动延续 |

大白话：本机能测的在本机测；本机物理上缺少的能力直接写进Cloud教程，不要每一轮重新搜索WSL、Docker或其他容器，也不要
拿Git Bash“假装Linux”。

## 4. 跨阶段登记规则

新发现只有同时满足下列条件，才从活动planning提升到本文件：

1. 已由维护者陈述或只读探测确认，不是模型猜测；
2. 会在多个任务、Discovery Round、Release gate或版本列车中重复影响默认执行路由；
3. 能写清适用机器/执行面、核对日期、影响、可用替代方案和重验条件；
4. 不包含秘密、账户身份、个人绝对路径、设备唯一标识或无长期价值的完整日志。

单次网络抖动、某轮临时进程、一次性dirty state、具体测试输出和未分类错误继续留在planning/progress；不要把所有现场噪声都
堆进长期档案。若限制已消失，不删除旧事实来伪装从未发生；更新状态与日期，并用简短说明指出它被什么新事实取代。

## 5. 重验触发器与更新事务

只有出现以下重验触发器之一，才重新探测已登记执行面：

- 维护者明确说明主机、工具或环境已经改变；
- 任务明确授权安装/启用某个执行面；
- 既有命令出现与本档案冲突的成功或失败信号；
- 新gate确实要求当前档案尚未分类的本地primitive。

触发后先做最小只读探测，原始输出写活动progress，结论写findings；若确认跨阶段事实发生变化，在同一文档事务中更新本文件的
日期、状态、影响和默认方案，并同步AGENTS中的执行摘要。没有触发器时继续使用最近`CONFIRMED`结论，不为“确认还是没有”重复
消耗时间。
