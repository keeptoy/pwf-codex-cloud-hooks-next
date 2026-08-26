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
