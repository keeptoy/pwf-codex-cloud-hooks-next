# Progress: Current source logic and route analysis

## Session: 2026-08-22

### Phase 1: Authority and lifecycle recovery

- **Status:** complete
- 按仓库要求读取 README、ARCHITECTURE、DESIGN、ROADMAP。
- 读取`.planning/.active_plan`及其指向的Phase 9 task plan、findings、progress。
- 接受维护者更高优先级说明：Phase 9已经关闭，当前没有新task plan或实施授权。
- 运行session catch-up和`git status --short --branch`；识别并保护用户已有78个planning文件删除。

### Phase 2: Source and contract inventory

- **Status:** complete
- 盘点production/runtime/contracts/tests/docs与Release资产。
- 阅读package、manifest、runtime bundle、Release artifact、installed transition和四个ABI schema。
- 阅读adapter、owned plan、owned catch-up、installer、importer、builder、bootstrap和pinned upstream scripts。
- 建立source → package → installed runtime → Managed policy → Hook dispatch的逐层地图。

### Phase 3: Runtime and installation analysis

- **Status:** complete
- 追踪两个事件的adapter plan-first dispatch、typed result validation、deadline和单次Host输出。
- 追踪plan resolution、安全读取、activation-first profile admission、private snapshot和post-render revalidation。
- 追踪transcript roots、Host-path优先、immutable byte capture、fallback、normalization和report budget。
- 追踪bundle verification、current/predecessor admission、TOML ownership、install/doctor/repair/uninstall和bootstrap orchestration。

### Phase 4: Verification and risk review

- **Status:** complete
- 完整Windows suite在正常进程环境通过。
- importer、Python compile、Node syntax、Bash syntax和Git mode检查通过。
- 临时目录中重建并check deterministic ZIP，随后删除临时资产。
- 识别active-pointer closed-state语义和uninstall admission为后继Discovery候选；没有修改production。

### Phase 5: Persistence and handoff

- **Status:** complete
- 创建本scoped planning记录。
- 将完整研究结果写入`findings.md`，执行证据写入本`progress.md`。
- 显式把`.planning/.active_plan`从已关闭Phase 9切换到当前analysis plan。
- 准备只暂存/提交本任务的四个planning paths，保留用户已有删除不进入提交。

## Test Results

| Test | Expected | Actual | Status |
|---|---|---|---|
| `npm test` | 当前Windows可执行断言全绿，Linux-only诚实skip | 177 tests / 152 pass / 0 fail / 25 skip | PASS |
| `python tools/import_upstream_runtime.py check` | 4-file pristine inventory/hash healthy | healthy | PASS |
| Python compile | 三个production Python入口可编译 | `PYTHON_COMPILE=PASS` | PASS |
| `node --check install.js` | 无语法错误 | exit 0 | PASS |
| `bash -n init-cloud-sandbox-v0.4.0.bash` | 无语法错误 | exit 0 | PASS |
| deterministic ZIP build/check | 与sealed v0.4.0候选一致 | 22 entries / 85,519 bytes / `24a412c…3bb3` | PASS |
| Git upstream modes | 四个upstream文件均为100755 | exact 4×100755 | PASS |
| `git diff --check` | 无空白错误 | exit 0 | PASS |
| focused repository boundary | 新active pointer与完整scoped records被治理守卫接受 | 14 tests / 14 pass / 0 fail | PASS |

## Error Log

| Error | Attempt | Resolution |
|---|---:|---|
| 首次README读取中文乱码 | 1 | 显式使用UTF-8重新读取后续文档 |
| Windows literal glob导致`rg tests\\*.test.js`失败 | 1 | 改用`rg -g '*.test.js'` |
| 沙箱Node runner统一`spawn EPERM` | 1 | 正常进程权限重跑，取得真实0-fail结果 |
| 沙箱Git Bash signal pipe Win32 error 5 | 1 | 正常进程权限重跑语法检查并通过 |
| focused Node runner再次被沙箱以`spawn EPERM`阻止 | 1 | 在正常进程环境重跑，14/14通过 |

## Files Created/Modified

- `.planning/.active_plan` — 切换到本分析plan。
- `.planning/2026-08-22-current-source-logic-route-analysis/task_plan.md` — 新建。
- `.planning/2026-08-22-current-source-logic-route-analysis/findings.md` — 新建。
- `.planning/2026-08-22-current-source-logic-route-analysis/progress.md` — 新建。

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| Where am I? | 已完成当前源码逻辑与路线分析，并持久化证据 |
| Where am I going? | 等待维护者决定是否开启专项Discovery或后继Product Phase |
| What's the goal? | 提供可在`/clear`或context compaction后恢复的准确分析基线 |
| What have I learned? | 见`findings.md` |
| What have I done? | 见本文件各Phase与Test Results |

## Current Status

`FOLLOW_UP_DISCOVERY_COMPLETE / UNINSTALL_PATH_SAFETY_DEFECT_CONFIRMED / NO_PRODUCTION_CHANGE`

### Phase 6: Follow-up Discovery

- **Status:** complete
- 复读 planning-with-files v3.8.2 的 `SKILL.md`、`init-session.sh`、`set-active-plan.sh`、`resolve-plan-dir.sh`，确认 scoped 初始化会自动切换 `.active_plan`，resolver 本身只解析已有文件状态。
- 将 closed plan / active pointer 从“专项 Discovery 问题”降级为 last-active/recovery 模型说明；当前没有建立 `no active plan` 机器状态的需求。
- 阅读 `install.js` 的 `backup()`、`assertSafeRuntimeForInstall()`、`uninstall()`，以及 README Pre-1.0 cleanup 合同和现有 installer tests。
- 在系统临时目录运行 disposable Windows fixture；所有 fixture 均在校验其绝对路径属于系统临时目录后清理。

| Probe | Result | Interpretation |
|---|---|---|
| unknown regular runtime file，无有效 manifest | uninstall 成功；runtime 删除；backup 逐字保留 sentinel | 有意的 explicit cleanup 语义 |
| runtime root junction | backup 创建 junction 时 `EPERM`；target 保留 | 平台偶然失败，不是稳定拒绝合同 |
| `<codex-home>/hooks` parent junction | uninstall 成功；backup 保留 sentinel；外部 runtime 被递归删除 | 已确认 path-containment 缺口 |

- 删除 disposable discovery driver；工作区未保留临时测试代码或 fixture。
- 现有 `tests/installer.test.js`：37 tests，36 pass，0 fail，1 个 Linux-only honest skip。

### Phase 6 Errors

| Error | Attempt | Resolution |
|---|---:|---|
| 沙箱内 discovery driver 的 child `spawnSync` 无输出，后续 `.trim()` 触发 `TypeError` | 1 | 判断为既有 `spawn EPERM` 限制；获准后在正常进程环境重跑并取得完整证据 |
| 一次组合 `rg` 包含不存在的 `tests/upstream.test.js`，命令以 code 1 结束 | 1 | 有效输出已取得；后续只使用实际存在的测试路径 |
