# Progress: v0.3.4 Published Release

## 2026-08-11

- 维护者授权进入 Published Release gate。
- 建立独立 Release planning scope，并把 `.planning/.active_plan` 切换到本计划。
- 开始 R0：固化 template / active planning / version acceptance 三层职责，清除版本 acceptance 中的动态进度账本。
- template 现为唯一稳定执行协议；活动 plan 保存施工状态；版本 acceptance 只保存已完成的不可变证据；
  ROADMAP 只保留宏观授权、lifecycle 与模板职责链接。
- exact Release input 审计确认当前 docs/planning/tests 改动不进入 ZIP；重建 candidate 仍为 21 entries、
  77,782 bytes、SHA-256 `87bff3eddb8c8f6431ddfd55f707e6ba02c31cf8c2d9fc822709b3967d10de09`。
- 冻结 R1 identity 链：package version、release artifact/其 manifest integrity SHA、bootstrap rename/default、
  acceptance rename、lifecycle docs 与 identity-specific tests；最终 ZIP SHA 留给 R2。
- focused governance 17/17 PASS；完整 Windows suite 114 PASS、12 POSIX/Linux SKIP、0 FAIL；importer 与
  Release build/check PASS。
- R0 完成，Next Step 为 R1；尚未创建 tag、修改 stable machine identity、写入最终 bootstrap SHA、发布资产或
  执行 Published Release Cloud。
- 按维护者复核补充 R0 文档细节：4.1 明确 `PWF_ACCEPTANCE_NODE_MAJOR` 必须从系统 Environment variables
  设置注入；模板新增可选“本版本验收增量”写法，v0.3.4-dev 用 4.1/9.1 anchor 和完成输出说明本次增量，
  明确 B～E 提示词未改变。该微调不改变 R1 Next Step 或 Release 字节。
- 维护者要求继续，R1 开始；先复核 machine identity、manifest integrity、bootstrap/acceptance rename、
  lifecycle role test 与 published roundtrip test 的全部耦合点。
- 已把 package/release artifact/bootstrap/acceptance/ROADMAP/CHANGELOG/tests 原子切换到 `0.3.4` stable
  candidate，并把新 release-artifact SHA `26d696…c4ae4` 写回 manifest integrity；bootstrap 仍保留 zero hash。
- importer check、Node syntax 与 `git diff --check` 通过；受限 Windows sandbox 中 `bash -n` 因 signal pipe
  权限失败，尚未形成 Bash 语法结论，改在沙箱外重跑。
- 沙箱外 `bash -n init-cloud-sandbox-v0.3.4.bash` PASS；最近 identity/artifact/roundtrip/lifecycle suite 19/19 PASS。
- 完整 Windows suite 114 PASS、12 POSIX/Linux SKIP、0 FAIL；两次 ZIP build/check 均为 21 entries、
  77,777 bytes、SHA `497e92a861bd7882129f05b28df1e23a55330db98bebe76891db5b9761bdec3b`，逐字一致。
- 本机 WSL 没有已安装 distribution，Docker/Podman 不可用。R1 local 完成但 Linux 0-skip 仍待 exact committed
  candidate；R2 seal 保持 blocked，bootstrap 仍是 zero hash，未创建 tag 或公开资产。
- 维护者复核后采用最小路线：R1 production/runtime bytes 零变化，复用既有 Source/Candidate Linux 120/120
  与完整行为黑盒；不重复同一 Cloud 通道。R1 标记 complete，R2 seal 开始；最终 Published Release Cloud
  仍保留，不能由本决定取消。
- R2 identity preflight 确认本地 tag、远端 tag 与 GitHub Release 均不存在 `v0.3.4`；双构建/check 得到
  21 entries、77,777 bytes、ZIP SHA `497e92…ec3b`，并写入外部 bootstrap；bootstrap 为 21,565 bytes、
  SHA `9a3df0…cd40`。
- 封板后首次完整 suite 只有 release-package 的 ROADMAP 角色文字仍期待 `stable candidate` 而失败；产品、
  hash 和构建断言均未失败。已只把该断言同步为 `sealed candidate`，等待完整重跑。
- sealed suite 重跑 114 PASS、12 POSIX/Linux SKIP、0 FAIL；Bash syntax/default checksum、Node syntax、
  importer check 与 diff check 全部通过。R2 complete，ZIP/bootstrap exact identity 已冻结并保留在 seal 目录。
- Next Step 切换为 R3：先提交 sealed source，在干净 HEAD 重建同一 ZIP/bootstrap，再执行 publication audit；
  尚未创建 tag、推送 sealed commit 或上传任何资产。
