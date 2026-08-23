# Findings: v0.4.2 Release closeout / candidate-readiness

## Starting boundary

- 普通 Release 直接进入版本无关 closeout workflow；不创建 standing Phase 9，不复制 P9-A～F。
- 两个 retirement checkpoint 是同一 Release workflow 的入口/出口对象治理，不增加 Cloud 通道。
- 本轮只推进到 C0 前的本地候选准备和 Source/Candidate 教程；远端与 Cloud 动作仍由维护者负责。

## Authority recovery

- README/ARCHITECTURE确认当前稳定 product、trusted graph、installer path-safety与Release字节顺序不需因文档治理改变。
- DESIGN把Release operator guide、双通道模板、package/contract/bootstrap边界及相应验证路由列为本任务的直接落点。
- ROADMAP明确第9节是版本无关Release章节：普通Release不建standing Phase 9；第一retirement checkpoint在Source/Candidate前闭合，第二检查点在Latest/postflight后闭合。
- 当前候选只应产生文档治理delta与Release身份/升级前驱事务，不应修改install、adapter或runtime行为。

## Candidate identity transaction

- 当前`package.json`与Release artifact仍是`0.4.1`，external asset仍是`init-cloud-sandbox-v0.4.1.bash`；v0.4.2候选需把三者同步到`0.4.2`。
- `installed-state-transition-v1`当前只接受exact v0.4.0 predecessor。v0.4.2必须改为exact v0.4.1 predecessor；installed manifest schema仍是3，12-file installed inventory与runtime hashes因v0.4.1只修改installer path safety而保持不变。
- release artifact与transition contract字节变化后，必须同步`upstream-manifest.json`中的两个SHA；runtime bundle/importer/source pin不变。
- v0.4.2 bootstrap是v0.4.1脚本的身份轮转副本：版本改为v0.4.2，Source/Candidate阶段SHA必须为64位zero hash；其余稳定安装逻辑不变。

## Candidate-readiness inventory

- 当前共有25个planning scopes：1个active、24个non-active。除`tests/repository-boundary.test.js`仍直接读取v0.4.1 Phase-9 planning外，non-active scope没有current外部入链。
- v0.4.1 Phase-9 planning的长期P9-F结论已经存在于v0.4.1 acceptance；测试依赖应先迁移到acceptance，再决定账本退役。
- v0.4.2 documentation-governance相关completed scopes仍解释本列车的施工与恢复位置，适合KEEP到C2 role-window closeout再复核；更早v0.4.0/v0.4.1与初始source-analysis scopes具备Git恢复且已由history/acceptance接管，是RETIRE候选。

## Local candidate evidence

- 完整Windows suite：180 tests / 154 pass / 0 fail / 26 skipped；26项均为既有Linux/POSIX-only case，不能替代Cloud零skip。
- exact v0.4.1 predecessor publication oracle全绿，包括forward migration、tampered-state写前拒绝、owned uninstall与accepted/fallback恢复。
- deterministic双构建：22 entries、85,912 bytes、SHA-256 `4a059fa512a2c144cef42478d217935825ee7aca0599dca5582c62dd12df415c`，两份字节身份一致。该hash只属于当前本地zero-hash candidate，不是sealed/public asset identity。
- importer check、Python compile、`node --check install.js`、两份bootstrap Bash syntax、manifest contract hash、bootstrap identity-only delta与`git diff --check`全部PASS。
- 相对v0.4.1，install.js、hooks、runtime、runtime bundle和tools仍为零delta；Release输入变化只限package identity、Release/transition contracts、manifest integrity references和新bootstrap。
