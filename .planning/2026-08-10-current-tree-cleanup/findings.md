# Findings: Low-risk Current-tree Cleanup

## Frozen inventory

- 用户删除的四个路径中，`DESIGN.md` 是 README/AGENTS/ARCHITECTURE/tests 引用的当前实现权威，必须恢复。
- `ARCHITECTURE-old-0.3.2.md`、`docs/v0.3.2-cloud-hard-acceptance.md` 与
  `init-cloud-sandbox-v0.3.2.bash` 已有 immutable Git history/Release evidence，可从 current tree 退休。
- repository governance guide 定义 current versioned files 为 candidate + accepted 去重窗口；immediate
  fallback 默认从 immutable source/tag/Release/acceptance/oracle 恢复。
- v0.3.2 acceptance 的 current-tree 最终历史字节位于 commit
  `1b668b4af8691c5685b5cd94d10002ff757e2971`；provenance/changelog 应链接该 immutable blob。
- 当前 repository guard 以 `git ls-files` 计算 inventory，未暂存删除仍会留在 index 视图中；required current
  files 还需真实文件存在性断言。
- Guard 现在合并 cached + untracked、排除 ignored 后再过滤真实存在路径，因此可在提交前同时观察用户删除、
  新 planning scope 与当前 authority；trusted/Release required paths 另有显式存在性断言。

## Deferred cleanup

- `runtime/upstream/ledger-summary.sh`、runtime contract 的 programme metadata，以及 manifest/bundle 重复属于
  下一兼容版本的设计/Release gate，不在本轮修改。
- `legacy`/`managed_legacy`、pristine upstream module 与 published v0.3.2 oracle 是当前有效边界，不是可直接
  删除的历史垃圾。
