<a name="phase-4-15-historical-position"></a>

# Phase 4.15：v0.4.3 Release asset materialization 与验收入口治理

> Record role: `RETROSPECTIVE_CAPSULE`

## Historical position

Phase 4.15是`v0.4.3-dev`文档治理列车中形成的**回顾性Release维护里程碑**。它承接最初附在Phase 4.14末尾的
Release asset materialization状态，并把后续新人文档、Source/Candidate bootstrap选择、Release双通道与Shell override
语义整理成一个自包含过程账本。Phase 4.14继续只解释Release closeout、C0/C1/C2和retirement治理；本文解释维护者如何从
同一可信模板安全地产生candidate bootstrap与待上传双资产，以及验收教程如何准确选择和调用它们。

它不是新的Product Phase、Discovery Round、Cloud acceptance或Release授权，也不表示`v0.4.3`已经形成C0、通过Cloud或公开。
当前命令读根[`README`](../../README.md)，双通道执行合同读
[`Cloud hard acceptance template`](../cloud-hard-acceptance-template.md#cloud-hard-acceptance-template)，programme顺序读
[`ROADMAP` Release流程](../../ROADMAP.md#release-four-step-flow)。

<a name="phase-4-15-problem-before"></a>

## Problem before

根README虽然已经说明手工build/check/hash与bootstrap改号，但仍要求维护者复制命令、手工替换version/SHA，并自行保证
整份脚本没有漂移。盘点又发现当时的`v0.4.3-dev` bootstrap虽然version、hash和固定安全字段仍能通过既有检查，其中的中文
lifecycle黑盒提示却已发生mojibake；原测试没有证明完整派生脚本等于同一可信来源。

随后补充新人说明时又暴露三组容易混淆的对象和概念：本地预检`candidate.zip`不是正式上传资产；旧accepted bootstrap与新
candidate bootstrap可以同时留在根目录；Shell能够override zero或non-zero默认URL/SHA，但这种技术能力不能代替当前
candidate的version、contract和zero-hash身份准入。若这些规则只散落在planning或对话里，下一条列车仍可能复制旧ZIP、选错
bootstrap、把本地override误当公开下载链，或在Source/Candidate PASS后修改Release输入却沿用旧证据。

<a name="phase-4-15-core-decisions"></a>

## Core decisions

1. **单一bootstrap source。** 已验证正文只在`tools/templates/init-cloud-sandbox.bash.in`维护；versioned根bootstrap是
   C0前确定性派生的tracked candidate，不反向充当模板。
2. **薄materializer、不扩张ZIP builder。** `tools/build_release.py`继续只负责contract-driven ZIP；
   `tools/materialize_release_assets.py`编排candidate render/check及Source/Candidate PASS后的ZIP/bootstrap双资产物化。
3. **三个本地对象分角色。** 早期`candidate.zip`只用于可选preflight；根zero-hash bootstrap进入C0；ignored `dist/`中的
   versioned ZIP与exact-hash bootstrap才是维护者上传的正式双资产。正式生成器不读取或重命名旧`candidate.zip`。
4. **Cloud SHA是正式物化准入。** materializer重新build/check ZIP并要求实际SHA等于Source/Candidate原始证据；不一致、
   candidate/template drift、非法version/SHA或同名异字节目标全部fail closed，同名相同字节才允许幂等重跑。
5. **bootstrap由当前checkout contract点名。** Cloud模板按manifest→Release contract→唯一external asset精确选择脚本，
   并要求`external_release_assets`恰好一项；不扫描根目录、不比较SemVer，也不根据GitHub Latest猜新旧脚本。
6. **override能力与candidate资格分层。** `${VAR:-default}`允许4.1用本地`HOOKS_URL`/`HOOKS_SHA256`覆盖zero或non-zero默认值；
   `readonly`只冻结展开后的结果。4.1故意不override `HOOKS_VERSION`，前置suite另行绑定package、contract asset、内嵌version和
   canonical zero-hash字节，防止旧版或已seal正式bootstrap冒充candidate。
7. **双通道证明不同对象。** Source/Candidate证明当前C0、contract指定bootstrap与当前源码构建ZIP能共同工作；Published
   Release不带本地override，验证正式bootstrap的默认GitHub URL、内嵌exact SHA与公开ZIP。

<a name="phase-4-15-completed-delivery"></a>

## Completed delivery

- 建立canonical `.bash.in`模板与release asset materializer，并从模板重新派生无mojibake的tracked `v0.4.3-dev`
  zero-hash bootstrap；模板token、UTF-8 sentinel和完整render equivalence进入回归。
- `candidate-bootstrap --write`负责C0前显式生成，省略`--write`时只做exact-byte检查；`release`模式要求正式version与Cloud ZIP
  SHA，在ignored `dist/`一次生成versioned ZIP、exact-hash bootstrap和machine-readable摘要。
- README先解释C0、Source/Candidate与Release-excluded，再区分三个本地对象、两条candidate命令和正式生成流程；同时补充
  双版本bootstrap选择链、zero/non-zero默认值的override语义及candidate身份准入。
- Cloud hard acceptance template的双通道合同明确：Source/Candidate使用当前contract点名的bootstrap和本地候选ZIP，
  Published Release才使用正式bootstrap默认公开下载链；后继operator guide无需复制第二份定义。
- release-assets、contracts、release-package、repository boundary与完整回归共同保护template/materializer exclusion、确定性
  ZIP、身份/hash准入、existing-output冲突、选择链和新人说明；没有修改installed runtime、Host ABI或trusted graph。

<a name="phase-4-15-acceptance-conclusion"></a>

## Acceptance conclusion

本轮本地实现、静态检查、Release边界和完整回归均已闭合，证明维护者可以从同一checkout、同一contract和同一canonical
bootstrap source确定性地产生候选脚本与正式双资产，并且文档能区分本地candidate证据和公开资产证据。

这仍只是`v0.4.3-dev` C0前的本地治理结论。README属于Release ZIP输入，所以本轮README与工具变化必须进入新的C0并重新运行
Source/Candidate；任何本地候选SHA都不是Cloud PASS、sealed asset或Published Release证据。

<a name="phase-4-15-explicit-non-goals"></a>

## Explicit non-goals

- 不把canonical template或materializer加入Release ZIP、installed inventory或runtime dispatch。
- 不让早期`candidate.zip`、本地SHA、moving branch或GitHub Latest替代Source/Candidate exact evidence。
- 不因为Shell能够override non-zero默认值，就允许正式或旧bootstrap冒充当前candidate。
- 不合并Source/Candidate与Published Release，也不在公开通道沿用本地`file://`或SHA override。
- 不自动授权Cloud、push、tag、Pre-release、asset upload、Latest promotion或planning清退。

<a name="phase-4-15-successor-inheritance"></a>

## Successor inheritance

后继版本列车在version identity、canonical template或bootstrap正文变化后，必须在C0前重新物化并只读核对tracked zero-hash
candidate。Source/Candidate按当前checkout的manifest→Release contract→唯一external asset选择脚本，并只用本轮确定性ZIP的
URL/SHA做有界override；PASS后若任何Release输入变化，形成新C0并重跑，不能用`dist/`或旧Cloud SHA掩盖漂移。

正式资产只由materializer在Cloud SHA准入通过后写入ignored `dist/`。维护者上传同一versioned ZIP/bootstrap后，Published
Release必须在独立Fresh环境验证默认公开下载链。当前命令、合同与programme时序始终回到README、Cloud hard acceptance
template和ROADMAP；本文只保留这轮设计为什么形成，不成为第二份执行authority。

<a name="phase-4-15-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/add5f8c98b81c3019f4f095f566a80913d02df95)

该链接固定Phase 4.15所回顾交付完成时的exact仓库状态；它不证明后继Cloud、publication或current行为，当前事实仍以当前仓库
authority为准。
