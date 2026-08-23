# Findings: Product Phase rotation operational flow

## Initial clarification

- 现有guide已有四条正式规则，但缺少维护者能顺序阅读的“进行中→Round关闭→Product Phase关闭→Release后列车轮转”大白话状态流。
- 当前维护模式是一条列车、一个Product Phase；多Product Phase同列车只应作为显式批准的非默认例外。
- semver可以帮助识别开发/patch/governance列车属于哪个版本系列，但不能单独证明是否产生新的Product Phase：`v0.4.1`安全patch与`v0.4.2`文档治理都是独立版本列车，却不自动成为新Product Phase。
- 推荐判断顺序：先看活动task plan/ROADMAP是否明确声明Product Phase及继承对象，再看版本系列辅助路由；仍不确定则停止并向维护者确认。

## Authority reread

- README/ARCHITECTURE/DESIGN确认本轮属于纯文档路由治理：programme与版本列车只由ROADMAP维护，治理方法由repository-governance-guide维护；不需要触碰运行时或Release输入。
- ROADMAP现行默认已经是一Product Phase形成候选基线后进入Release closeout；9.2同时保留了“维护者明确批准多个低风险Phase合并列车”的非默认例外。
- 当前`v0.4.2-dev`明确是documentation-governance列车，不产生新的Product Phase；它说明“版本系列/列车身份”和“Product Phase身份”必须分开判断。

## Frozen exception model

- 当前默认一条版本列车只承载一个Product Phase；multi-Phase不是日常分支，只在维护者同时写入ROADMAP与活动task plan后生效。
- patch先归属它修补的accepted/candidate Product baseline：版本号定位patch train，既有Product Phase承接产品语义；CHANGELOG/acceptance/provenance/history再按各自authority准入条件写入。
- documentation/process governance先由ROADMAP的version series声明定位当前或新development train；即使使用新版本号，也不自动产生Product Phase。
- 冲突或信息不足时必须列出候选归属和影响，向维护者确认；不能为了完成第4节轮转自行发明第5节Phase。
- 详细判断只放repository-governance-guide；ROADMAP仅保留默认模式与停止条件，phase-history-template/index不复制programme决策树。
