# Findings: v0.4.4 Source/Candidate C0

## Admission findings

- 维护者已确认前序`v0.4.4-dev` checkout完成Source/Candidate Cloud，但随后要求改为正式`v0.4.4`并生成发布双资产。
- `package.json`、`contracts/release-artifact-v2.json`和`upstream-manifest.json`均属于22-entry ZIP输入；`dev → stable`还会改变contract唯一点名的根bootstrap文件名与内嵌版本。因此核心runtime不变不等于Release字节不变。
- `tools/materialize_release_assets.py release --version v0.4.4 ...`在当前dev checkout明确返回`release version mismatch`，并在创建输出目录前停止。该行为与README和Release contract一致。
- 正确恢复路线是：stable identity → zero-hash candidate bootstrap → 本地验证 → 新C0 → 新Source/Candidate PASS → 以新Cloud ZIP SHA物化ignored `dist/`双资产。
- 当前accepted仍为immutable v0.4.3，immediate fallback仍为v0.4.2；installed-state transition已经以exact v0.4.3为predecessor，无需因dev/stable改号改变runtime inventory。
- 旧`v0.4.4-dev`planning和Phase 4.16保留其真实时间语义，不批量改写为正式C0证据。

## Candidate scope

- Release输入改号面：package identity、Release artifact package/external asset、manifest中的Release contract SHA、stable zero-hash bootstrap。
- Release-excluded同步面：ROADMAP、CHANGELOG、Phase 4 overview、版本acceptance、tests和本planning。
- 明确不变：runtime 12-file inventory、四个pristine upstream文件、installer/adapter行为、Host ABI、managed events与v0.4.3 immutable publication。

## Source/Candidate result and C1 decisions

- 正式C0 `f7032fd0efad3df9e4b6052e8cd766d27cd2a844`已经由维护者确认Cloud PASS；Cloud ZIP SHA与本地确定性SHA完全一致，前序dev PASS不再承担正式证据角色。
- 第一轮retirement review没有适合立即清退的对象：planning继续承担恢复记忆，accepted窗口材料仍需rollback，C0输入已经sealed，当前guide与稳定templates还要服务publication和Published Release；全部判定KEEP。
- 正式双资产可以在C1本地物化，但不进入Git：它们是待维护者上传的ignored输出。C1治理commit不会改变tag目标；annotated tag必须继续指向C0而不是C1。
- Sealed bootstrap正文仍合法保留64位zero placeholder拒绝常量；判断正式seal应核对`HOOKS_SHA256`默认赋值是否为Cloud exact SHA，不能用全文“无64个零”作为条件。

## Published Release and canonical baseline interpretation

- 维护者明确报告tag/push/publication与第二通道PASS，公开资产identity与C1本地物化完全一致；这足以直接写回Published Release，不需要正常路径的额外联网postflight。
- Release测试仓库为空时，`.planning`和`.planning/.active_plan`都不存在不是异常拓扑，而是canonical fixture尚未首次创建。只要本轮PLAN_ID目录和三个目标文件不存在，apply_patch应直接创建父目录、文件与pointer。
- 冲突语义必须绑定具体危险状态：existing target、symlink/错误类型、不安全path component或无法安全读写的普通pointer。仅以“两个路径missing”报冲突属于过度防范，会制造无意义的人工授权往返。
- 模板应同时禁止为满足preflight而先用Shell预创建或删除`.planning`；只读Shell负责exact-path存在性/类型检查，正文唯一写入者仍是apply_patch。
- Published Release PASS不等于Latest或C2。accepted仍为v0.4.3、fallback仍为v0.4.2，直到维护者确认GitHub Release详情页显示v0.4.4为Latest且不再是Pre-release。

## C2 role-window decisions

- 维护者已明确确认`v0.4.4`早已完成Latest promotion；正常UI成功按ROADMAP即为confirmation，不重复下载资产、重算SHA或增设postflight。
- 角色轮转应为：development train=`NONE`，accepted=`v0.4.4`，immediate fallback=`v0.4.3`，deeper fallback=`v0.4.2`；Product Phase 5与下一版本列车仍未授权。
- `v0.4.4`当前guide与tracked bootstrap判定`KEEP/FREEZE`；tracked bootstrap只把默认ZIP SHA冻结为已验收公开SHA，不改变ZIP内22项Release输入。
- `v0.4.3`current guide/bootstrap判定`RETIRE`：其guide和sealed bootstrap都已有immutable C2 commit `d7b5345b165e94c18ceab9b591d9a6b6dd251110`恢复点，公开双资产继续由GitHub Release保留。
- publication oracle判定`MIGRATE`到accepted v0.4.4 + fallback v0.4.3；provenance新增v0.4.4行，并把v0.4.3 acceptance链接迁到immutable `d7b5345...`。
- 六个planning scope判定`KEEP`：维护者没有授权删除，且它们继续承担相邻Discovery恢复与治理参考。稳定contracts/tests/history/production代码同样`KEEP`。
