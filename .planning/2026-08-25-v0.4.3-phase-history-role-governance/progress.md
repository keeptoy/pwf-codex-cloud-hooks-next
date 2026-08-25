# Progress: v0.4.3 Phase history role governance

## Latest verification update

- 最终入口核对发现根README文档地图仍沿用“Phase历史摘要”旧名；已同步为“Phase历史过程账本”，并在一级入口直接分流到ROADMAP长期摘要，防止新人误认authority。
- README是Release ZIP输入，因此旧临时候选随该修正失效；重建后的22-entry临时候选为87,415 bytes、SHA-256 `031dcaeebb6df012645a93c643597fe9bc45d88eed57160fb1870aa50dea6484`，build/check与最终15/15文档边界测试均通过。该值仍只是development验证，不是sealed资产身份。
- Phase 1收口：v0.4.3-dev身份、history两角色边界、ROADMAP长期摘要边界及稳定治理断言已完成；Phase 2保持PENDING，等待下一轮讨论，不顺手扩大治理范围。
- 最终静态/构建验证通过：22-entry候选ZIP build/check、Python compile、`install.js` syntax、全部bootstrap `bash -n`及`git diff --check`。
- 完整 `npm test`：182 tests，156 PASS，26 个 Windows/POSIX 边界 SKIP，0 FAIL。
- v0.4.3-dev 候选 ZIP 已成功 build/check：22 entries，87,388 bytes；本地临时候选 SHA-256 为 `573eb0f1bc4827857ba9918022ae2705cf9ed8f2a58dbbc9acd409cc1f394724`，不构成已封板资产身份。
- Python production sources compile 与 `install.js` syntax check 已通过；Git Bash 在沙箱内因 Win32 error 5 无法创建 signal pipe，需按维护机执行面边界在沙箱外复验 bootstrap syntax。
- 修正后的三模块定向测试在允许 test runner 创建子进程后为 33/33 PASS。
- 沙箱内首次重跑不是产品失败：Windows 返回 `spawn EPERM`，三个测试文件都未实际进入断言；按环境边界在沙箱外原命令复验通过。
- 第二轮定向测试为 30/33 PASS；剩余三项均属于治理断言迁移，不是 production defect。
- 已将 development train 的 acceptance 要求调整为：`-dev` 阶段继续引用 accepted version 的 immutable acceptance，不提前虚构 candidate acceptance。
- 已移除 ROADMAP 新增文字中的多余字面 `docs/history/` 宏观入口，并把稳定架构测试改为动态版本断言，避免冻结 `v0.4.3`。
- 修正后静态检查通过：三个测试文件 `node --check`、upstream importer check、`git diff --check` 均为 PASS；下一步重跑定向测试。

## 2026-08-25

- 维护者授权继续Phase 4文档治理并迭代到`v0.4.3-dev`。
- 新建独立planning scope并切换active pointer；此前两个scope全部保留，不自动清退。
- 首要边界已确认：history是精选历史过程账本，包含回顾型capsule与探路/决策型frozen record；ROADMAP第5节才是长期Phase摘要。
- 创建并切换到本地`0.4.3`分支；旧planning scope全部保留。
- 首次版本inventory确认package/Release contract仍为稳定0.4.2，但命令包含不存在的lockfile与未展开glob；有效结果保留，错误已记录并改用文件枚举路线。
- 正确枚举确认仓库只有`init-cloud-sandbox-v0.4.2.bash`；Git历史恢复了`0.4.1-dev → 0.4.1`两阶段身份和v0.4.2直接候选物化先例。本轮采用适合多轮治理的`0.4.3-dev`开发身份，稳定0.4.3留到C0前。
- machine identity主体已更新为`0.4.3-dev`：package、Release contract与exact v0.4.2 predecessor同步，CHANGELOG登记未发布治理列车。ROADMAP当前列车改为Phase 4上的v0.4.3-dev并建立exact anchor；history索引把“精选过程账本”和两种role放到新人入口首段。
- 新bootstrap已由apply_patch从v0.4.2字节派生，默认身份`v0.4.3-dev`、ZIP hash为64位zero；Release/transition contract真实SHA已写回upstream manifest。
- contracts、architecture与repository lifecycle tests已迁移到exact v0.4.3-dev train、v0.4.2 accepted predecessor/acceptance及history两角色大白话边界；开发candidate不再冒充已发布acceptance。
- 首次focused为37/45 PASS。失败分类：旧NONE/v0.4.2 programme措辞断言2项；CHANGELOG字面`docs/history/`造成第三宏观入口及authority失败2项；transition沿用v0.4.1 upstream canonical hash造成published predecessor mismatch 2项；另有documentation lifecycle与acceptance authority各1项待读取完整断言。稳定边界保留，按真实v0.4.2 oracle和当前职责修正。
- 已修正旧列车/programme断言和CHANGELOG第三入口；从immutable tag计算v0.4.2 canonical upstream hash并更新transition与manifest SHA。下一轮定向复验剩余路径/authority边界。

## Error Log

| Timestamp | Error | Attempt | Resolution |
|---|---|---:|---|
| 2026-08-25 | `rg`收到不存在的`package-lock.json`和PowerShell未展开的bootstrap glob | 1 | 其余搜索结果有效；后续用`rg --files`和显式路径。 |
| 2026-08-25 | 首份v0.4.3 identity+docs组合补丁因ROADMAP换行上下文不匹配被拒绝 | 1 | apply_patch未产生部分修改；拆分小补丁继续。 |
| 2026-08-25 | bootstrap动态补丁构造使用了当前V8不存在的`atob()` | 1 | 源文件只读成功但未写入；改用纯JS Base64 decoder，仍由apply_patch创建文件。 |
| 2026-08-25 | 纯JS Base64 decoder后仍调用了不可用的`TextDecoder` | 2 | 未写入；脚本为ASCII，第三次使用分块字符解码。 |
| 2026-08-25 | 测试引用扫描的PowerShell双引号正则解析失败 | 1 | 未执行搜索；改用单引号literal pattern。 |
| 2026-08-25 | 第二次扫描包含不存在的`tests/release-artifact.test.js` | 1 | 其余匹配有效；枚举确认真实模块为`release-package.test.js`，不再使用错误路径。 |
| 2026-08-25 | v0.4.3-dev首次focused 37/45 PASS，8项身份/治理断言失败 | 1 | 分类为旧列车快照、CHANGELOG第三入口、predecessor canonical hash drift及两项待定边界；逐类修正后重跑。 |
| 2026-08-25 | Node计算v0.4.2 canonical upstream hash时派生Git子进程EPERM | 1 | 无写入；PowerShell先读取immutable JSON，再交给Node纯计算。 |

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| Where am I? | Phase 1：v0.4.3 development identity与history角色边界Discovery。 |
| Where am I going? | 先完成版本改号与history定位，再盘点后续文档治理。 |
| What's the goal? | 让history过程账本与ROADMAP长期摘要职责一眼可分。 |
| What have I learned? | 两种history role按形成时机区分，不按篇幅或文件名区分。 |
| What have I done? | 建立v0.4.3独立planning scope，保留全部旧scope。 |
