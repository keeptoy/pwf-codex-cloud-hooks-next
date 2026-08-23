# Task Plan: v0.4.0 stage-guide retirement

## Goal

正式清退4份已关闭v0.4.0阶段验收手册：仓库记录删除，本机`临时文件/`只作参考且被Git忽略；同步移除current tests与history对这些root copies的依赖，并记录它们暴露出的文档生命周期治理背景。

## Next Step

任务已完成；等待维护者push当前两个本地commit，未来新任务另建活动plan。

## Current Phase

Complete

## Phases

### Phase 1: Audit references and replacement authorities

- [x] 读取直接解析4份guide的测试块与所有history链接。
- [x] 确认immutable恢复入口和仍需保留的current行为断言。
- **Status:** complete

### Phase 2: Implement retirement

- [x] ignore本机参考目录并提交4份tracked删除。
- [x] 把测试/历史引用迁移到current behavior authority、Phase capsule或immutable evidence。
- [x] 在Phase 4.14补充本轮治理的实际触发背景。
- **Status:** complete

### Phase 3: Validate and commit

- [x] 运行focused与完整回归、broken-link/Release-boundary/static audits。
- [x] 创建单一范围本地commit并停止，交由维护者push。
- **Status:** complete

## Authorization

- 已授权：提交4份guide删除；让`临时文件/`只留本机、不进入仓库；同步必要测试、历史引用、治理背景、planning并创建本地commit。
- 未授权：修改`临时文件/`中的参考字节、production/contracts/package/Release inputs或任何远端状态。

## Stop Conditions

- 若某guide仍是当前唯一行为/安全oracle，先建立等价current authority再删除，不能为清退弱化断言。
- 已冻结history只做链接修复或有证据的事实补充，不批量重写时间语义。
- 本机参考目录的7个文件名称、大小和SHA必须保持不变。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 动态整文件补丁尝试用V8全局`atob`解码base64，但编排隔离环境未提供该函数 | 1 | 补丁调用前已停止、目标测试未修改；改用PowerShell `ConvertTo-Json`输出并由JS原生`JSON.parse`恢复文本 |
| focused状态补丁中的JS字符串把正则`\n`解释成真实换行，apply_patch校验拒绝 | 1 | 目标文件未修改；双重转义反斜杠后重放补丁 |
| 默认沙箱直接运行F3 focused tests时，Git/Python child process返回`spawnSync ... EPERM` | 1 | 分类为已知runner执行面限制；语法检查与纯文档断言继续运行，完整suite改在沙箱外执行 |
| Phase 4.8历史测试仍要求已退役guide的旧相对链接 | 1 | 分类为fixture drift；改为断言current root copy已按retirement DoD清退且Cold evidence可恢复 |
| Phase状态更新补丁引用了progress的旧`...AUDIT`状态，apply_patch整体拒绝 | 1 | 文件无部分修改；重读当前plan/progress后从实际`...IMPLEMENTATION`状态更新 |
| Phase 4.14断言补丁再次把正则`\n`展开为真实换行，apply_patch校验拒绝 | 2 | 文件无部分修改；停止使用该转义，改成bounded`[\s\S]`断言 |

## Current Status

`COMPLETE / LOCAL_COMMIT_READY / LOCAL_REFERENCES_EXCLUDED`
