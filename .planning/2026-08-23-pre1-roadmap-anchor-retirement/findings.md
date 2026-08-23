# Findings: pre-1.0 ROADMAP anchor retirement

## Inbound inventory

- current tracked tree对`#phase-4-migration-lifecycle-governance`的链接为0。
- 已扫描30个本地branch/tag refs与27个remote-tracking refs，入链均为0。
- anchor定义存在于4个远端分支和公开`v0.4.0`、`v0.4.1` tag；旧tag自身会永久保留旧章节定位，不需要current HEAD继续复制alias。
- current功能性对象只有ROADMAP中的alias定义和architecture contract中的保留断言；planning文字只是决策历史，不是current link。

## Maintainer policy decision

- 项目仍在`0.x`迭代期；`1.0.0`才开始有意识冻结稳定公共文档兼容面。
- pre-1.0仍要求current canonical links不破损，但不为零入链的旧文件名/anchor保留alias；immutable Git/tag承担历史阅读与恢复。
- 这项规则应落在ROADMAP的Pre-1.0 policy中，避免后续治理再次把实验期文档地址误当永久兼容合同。
- 为避免“删除alias却留下同名negative oracle”继续积累按名称管理的历史包袱，architecture contract只冻结通用政策与canonical anchor，不保留旧alias字符串的named tombstone。
