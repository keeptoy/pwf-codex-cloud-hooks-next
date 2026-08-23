# Findings: Phase 4.13 ROADMAP Release governance convergence

## Approved structure

- ROADMAP第4节应回答“现在在哪”：`v0.4.2-dev`只做文档治理，当前package identity仍是`0.4.1`，没有RC、seal或下一Product Phase授权。
- 已关闭`v0.4.1`path-safety细节由Phase 4.12、CHANGELOG、provenance与版本acceptance恢复；已关闭`v0.4.0`P9细节由版本化Phase 9 history与immutable acceptance恢复。
- ROADMAP第8节应独占programme级Release顺序：四步、三个治理维度、C0/C1/C2、两个retirement checkpoint与Pre-1.0 compatibility。
- `phase-9-v0-4-0-instance`无跨文件引用，可以随4.2删除；`version-train-two-retirement-reviews`被architecture test冻结，迁移时必须保留原anchor。
- `pre-1-compatibility-admission`被README深链，8.2顺延为8.3时必须保留原anchor。

## Test migration

- architecture contract应进一步断言retirement anchor位于`## 8`之后、Pre-1.0 anchor之前，并保护三个HEAD角色及C0→C1→C2顺序。
- repository boundary不应继续要求ROADMAP当前区复制v0.4.1 P9流水；应从Phase 4.12与版本化Phase 9 history检查历史，并要求current train明确为无RC的v0.4.2-dev documentation governance。

## Existing boundary discovered during implementation

- `historical documents have one macro entrance`明确禁止ROADMAP直接出现`docs/history/`链接；只有README可以暴露history索引。因此第4节只能文字说明已关闭事实由Phase 4.12/4.13历史摘要承接，并继续通过README文档地图分流，不能新增直接深链。
- 当前repository helper把ROADMAP“当前开发列车”误当package candidate并要求等于`package.json`。治理列车需要拆成两个身份：`developmentTrain=v0.4.2-dev`来自ROADMAP，`candidate=v0.4.1`继续由当前package identity派生；accepted仍为v0.4.1，immediate fallback仍为v0.4.0。
- 这样既不虚构v0.4.2 package/RC，也能让ROADMAP诚实描述当前文档治理工作流；Release package/oracle测试仍围绕真实`v0.4.1`字节运行。

## Semantic cleanup

- 第2节历史段和Product Phase 4表格仍各有一处把`v0.4.0`写成当前Latest/当前列车的残留；这与同页角色表中的`v0.4.1 accepted`冲突。
- 最小修正是保留v0.4.0当时已晋级Latest的历史事实，同时明确它现在已轮转为immediate fallback；Phase 4表格只记录当时Release closeout已闭合，并说明功能基线现由v0.4.1继承。
- C0图已经表达tag指向C0，但既有跨文档合同还要求一句可独立引用的身份约束：正式tag必须精确指向Source/Candidate实际Cloud PASS的commit；补句即可，不需要增加Cloud轮次。
