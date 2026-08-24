"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const readText = relative => fs.readFileSync(path.join(root, relative), "utf8");
const currentManifest = readJson("upstream-manifest.json");
const currentArtifactPath = currentManifest.managed_runtime.contracts.release_artifact.path;
const currentBundlePath = currentManifest.managed_runtime.contracts.runtime_bundle.path;

test("cross-document fragments use stable explicit anchors", () => {
  const authorityDocs = [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md",
    "DESIGN.md", "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md",
  ];
  const discovered = [];

  for (const source of authorityDocs) {
    const sourceText = readText(source);
    const linkPattern = /\]\(([^)#]+\.md)#([^)]+)\)/g;
    for (const match of sourceText.matchAll(linkPattern)) {
      const [, relativeTarget, fragment] = match;
      const immutableBlob = relativeTarget.match(
        /^https:\/\/github\.com\/keeptoy\/pwf-codex-cloud-hooks-next\/blob\/[a-f0-9]{40}\/(.+\.md)$/,
      );
      if (immutableBlob) {
        assert.match(fragment, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,
          `${source}: unstable fragment #${fragment}`);
        discovered.push(`${source}->${immutableBlob[1]}#${fragment}`);
        continue;
      }
      const targetPath = path.resolve(root, path.dirname(source), relativeTarget);
      assert.equal(fs.existsSync(targetPath), true, `${source}: missing target ${relativeTarget}`);
      assert.match(fragment, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, `${source}: unstable fragment #${fragment}`);
      const targetText = fs.readFileSync(targetPath, "utf8");
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const explicitAnchor = new RegExp(`<a\\s+(?:name|id)=["']${escaped}["']\\s*><\\/a>`, "i");
      assert.match(targetText, explicitAnchor, `${source}: target lacks explicit anchor #${fragment}`);
      discovered.push(`${source}->${path.basename(relativeTarget)}#${fragment}`);
    }
  }

  assert.ok(discovered.length > 0, "expected at least one cross-document authority fragment");
  assert.equal(new Set(discovered).size, discovered.length, `duplicate authority fragments: ${discovered.join(", ")}`);
});

test("MAINTAINER_HANDOFF is a triage desk, not another mutable runbook", () => {
  const handoff = readText("MAINTAINER_HANDOFF.md");
  const artifact = readJson(currentArtifactPath);

  for (const heading of [
    "# 维护者接手导诊",
    "## 1. 新人五分钟接手",
    "## 2. 高频情形导诊",
    "## 3. 常见安全误判",
    "## 4. 能力与健康检测结果分流",
    "## 5. 停止条件与接手完成标准",
  ]) assert.match(handoff, new RegExp(`^${heading.replaceAll(".", "\\.")}$`, "m"));

  for (const target of [
    "README.md#documentation-map", "README.md#local-development",
    "DESIGN.md#module-responsibilities", "ARCHITECTURE.md", "ROADMAP.md", "CHANGELOG.md",
    "BASELINE_PROVENANCE.md", ".planning/.active_plan", "docs/",
  ]) assert.match(handoff, new RegExp(target.replaceAll(".", "\\.")));

  for (const signal of [
    "healthy", "repairable", "blocker", "platform limitation",
    "product defect", "test defect", "fixture drift",
  ]) assert.match(handoff, new RegExp(signal, "i"));

  assert.doesNotMatch(handoff, /```/);
  assert.doesNotMatch(handoff, /\bv?\d+\.\d+\.\d+(?:[-.][A-Za-z0-9.]+)?\b/);
  assert.doesNotMatch(handoff, /\b[a-f0-9]{7,64}\b/i);
  assert.doesNotMatch(handoff, /GitHub `Latest`|当前事实|Product Phase \d+/);
  assert.doesNotMatch(handoff, /\b\d+\s+(?:entries|bytes|tests?|passed|failed|skipped|PASS|FAIL|SKIP)\b/i);
  assert.doesNotMatch(handoff, /build_release\.py build|sha256sum|mktemp|git reset/);
  assert.doesNotMatch(handoff, /^## .*?(?:Source\/runtime 更新|Candidate\/Release ZIP|正式 Release|M4 仓库切换|回滚)$/m);
  assert.equal(artifact.entries.some(entry => entry.path === "MAINTAINER_HANDOFF.md"), false);
});

test("acceptance documents are counted by Discovery Round and share one operator-guide lifecycle", () => {
  const cloudTemplate = readText("docs/cloud-hard-acceptance-template.md");
  const operatorTemplate = readText("docs/cloud-acceptance-operator-guide-template.md");
  const governance = readText("docs/repository-governance-guide.md");
  const design = readText("DESIGN.md");
  const roadmap = readText("ROADMAP.md");
  const artifact = readJson(currentArtifactPath);

  assert.match(operatorTemplate, /^<a name="cloud-acceptance-operator-guide-template"><\/a>$/m);
  assert.match(operatorTemplate, /^<a name="operator-guide-document-lifecycle"><\/a>$/m);
  for (const heading of [
    "## 1. 定位与 Discovery claim",
    "## 2. Exact inputs 与前置条件",
    "## 3. 执行教程",
    "## 4. 证据与停止条件",
    "## 5. Pre-run status",
    "## 6. Channel checkpoints（多通道 guide）",
    "## 7. Final Post-run status",
  ]) assert.match(operatorTemplate, new RegExp(`^${heading.replaceAll(".", "\\.")}$`, "m"));
  assert.match(operatorTemplate, /single-Discovery[\s\S]*vX\.Y\.Z-cloud-hard-acceptance\.md/);
  assert.match(operatorTemplate, /multi-Discovery[\s\S]*vX\.Y\.Z-<round>-operator-guide\.md/);
  assert.match(operatorTemplate, /Pre-run[\s\S]*Post-run[\s\S]*冻结/);
  assert.match(operatorTemplate, /一个 operator guide 可以编排多个 gate、Cloud task 或 stage/);
  assert.match(operatorTemplate, /纯 aggregate[^\n]*不新建/);
  assert.match(operatorTemplate,
    /SOURCE_CANDIDATE_PASS \/ PUBLISHED_RELEASE_NOT_RUN \/ STOP_BEFORE_PUBLICATION/);
  assert.match(operatorTemplate, /正常等待[^\n]*不是`POST_RUN_INCOMPLETE`/);
  assert.match(operatorTemplate, /channel checkpoint[\s\S]*不会?冻结[\s\S]*Final Post-run[\s\S]*冻结/);
  assert.match(operatorTemplate,
    /^<a name="operator-guide-candidate-admission-preflight"><\/a>$/m);
  assert.match(operatorTemplate,
    /^<a name="operator-guide-source-candidate-closeout-retirement-checkpoint"><\/a>$/m);
  assert.match(operatorTemplate,
    /^<a name="operator-guide-release-exit-retirement-checkpoint"><\/a>$/m);
  assert.match(operatorTemplate, /SOURCE_CANDIDATE_HEAD[\s\S]*正式tag[\s\S]*实际Cloud PASS/);
  assert.match(operatorTemplate, /第一阶段状态写回commit[^\n]*不替代[^\n]*tag/);
  assert.match(operatorTemplate, /两次状态写回[^\n]*不是[^\n]*Cloud/);
  assert.match(operatorTemplate, /SOURCE_CANDIDATE_CHECKPOINT_HEAD/);
  assert.match(operatorTemplate, /PUBLISHED_RELEASE_CLOSEOUT_HEAD/);
  for (const currentReleaseDoc of [operatorTemplate, cloudTemplate, governance]) {
    assert.match(currentReleaseDoc, /\.\.\/ROADMAP\.md#release-four-step-flow/);
    assert.match(currentReleaseDoc, /\.\.\/ROADMAP\.md#version-train-two-retirement-reviews/);
  }

  for (const value of [cloudTemplate, governance]) {
    assert.match(value, /多 Discovery 版本/);
    assert.match(value, /Discovery Round/);
    assert.doesNotMatch(value, /多\s*gate\s*(?:开发)?版本/i);
  }
  assert.match(cloudTemplate, /single-Discovery 版本专项 acceptance[^\n]*operator guide/);
  assert.match(cloudTemplate, /Source\/Candidate 与 Published Release[^\n]*两个独立通道/);
  assert.match(governance, /runbook[^\n]*operator-guide[^\n]*历史文件/);
  assert.match(design, /cloud-acceptance-operator-guide-template\.md/);
  assert.match(design, /Discovery Round[^\n]*Pre-run[^\n]*channel checkpoint[^\n]*final Post-run/);
  assert.match(roadmap, /Product验收[^\n]*Discovery Round/);
  assert.match(roadmap, /Release验收[^\n]*Source\/Candidate[^\n]*Published Release/);
  assert.match(roadmap, /retirement review[^\n]*不是Cloud acceptance/);
  assert.match(roadmap, /第1、3步[^\n]*Cloud[^\n]*第2、4步[^\n]*控制面/);
  assert.match(roadmap, /candidate baseline closeout/);
  assert.match(roadmap, /普通Release[^\n]*不需要[^\n]*standing Phase 9/);
  assert.match(roadmap, /candidate admission preflight/);
  assert.match(roadmap, /source-candidate closeout retirement checkpoint/);
  assert.match(roadmap, /role-window closeout retirement checkpoint/);
  assert.match(roadmap, /正式tag[^\n]*Source\/Candidate[^\n]*实际Cloud PASS[^\n]*commit/);
  assert.doesNotMatch(roadmap,
    /随后该版本列车进入自己的 standing Phase 9|每条未来列车都要重新进入的 standing gate/);
  assert.equal(artifact.entries.some(entry => entry.path === "docs/cloud-acceptance-operator-guide-template.md"), false);
});

test("canonical plan-context architecture is exact, plan-first, and adapter-thin", () => {
  const request = readJson("contracts/adapter-plan-context-request-v2.schema.json");
  const result = readJson("contracts/plan-context-result-v2.schema.json");
  const bundle = readJson(currentBundlePath);
  const artifact = readJson(currentArtifactPath);
  const upstream = readJson("upstream-manifest.json");
  const architecture = readText("ARCHITECTURE.md");
  const catchup = readText("runtime/owned-catchup.py");
  const ownedPlan = readText("runtime/owned-plan.py");
  const installer = readText("install.js");

  assert.equal(request.properties.schema_version.const, 2);
  assert.equal(request.properties.runtime.const, "codex");
  assert.deepEqual(request.properties.event.properties.name.enum, ["SessionStart", "UserPromptSubmit"]);
  assert.equal(request.properties.policy.properties.allowed_profiles.prefixItems[0].const, "legacy");
  assert.equal(request.properties.policy.properties.opt_in_protocol.const, "codex-managed-v1");
  assert.equal(request.properties.output_budget.properties.max_context_chars.const, 20000);
  assert.equal(request.properties.output_budget.properties.max_plan_lines.const, 50);
  assert.equal(request.properties.output_budget.properties.max_progress_lines.const, 20);
  assert.equal(Object.hasOwn(request.properties, "transcript"), false);
  assert.equal(JSON.stringify(request).includes('"prompt"'), false);

  assert.equal(result.properties.schema_version.const, 2);
  assert.ok(result.properties.outcome.enum.includes("context_emitted"));
  assert.ok(result.properties.outcome.enum.includes("plan_state_changed"));
  assert.ok(result.properties.outcome.enum.includes("output_budget_exceeded"));
  assert.equal(result.properties.context.maxLength, 20000);
  assert.deepEqual(result.properties.project.properties.session_attachment.enum, ["legacy", "attached", "detached"]);

  assert.match(architecture, /^<a name="cloud-lifecycle"><\/a>$/m);
  assert.match(catchup, /candidates\.sort\(key=lambda item: item\.mtime_ns, reverse=True\)/);
  assert.match(installer, /timeout = 30/);

  assert.equal((bundle.local_files || []).some(item => item.id === "owned_plan"), true);
  assert.equal(upstream.managed_runtime.schema_version, 3);
  assert.equal(Object.hasOwn(upstream.managed_runtime, "local_files"), false);
  assert.equal(Object.hasOwn(upstream.managed_runtime, "files"), false);
  assert.match(installer, /const RUNTIME_BUNDLE = loadVerifiedRuntimeBundle\(\)/);
  assert.equal(artifact.entries.some(item => item.path === "runtime/owned-plan.py"), true);
  assert.equal(artifact.entries.some(item => item.path === "contracts/adapter-plan-context-request-v2.schema.json"), true);
  assert.equal(artifact.entries.some(item => item.path === "contracts/plan-context-result-v2.schema.json"), true);
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), false);
  assert.match(ownedPlan, /def capture_owned_state\(/);
  assert.equal((ownedPlan.match(/capture_owned_state\(/g) || []).length, 2,
    "F2B production must call the one managed state admission seam");
  assert.match(ownedPlan, /ACTIVATION_FILE = "\.pwf-codex-managed"/);
  assert.match(ownedPlan, /revalidate_owned_state\(plan_fd, owned_state\)/);
  assert.match(ownedPlan, /NONCE_FILE = "\.nonce"/);
  assert.match(ownedPlan, /ATTESTATION_FILE = "\.attestation"/);
  assert.match(ownedPlan, /def capture_normalized_ledgers\(/);

  const adapter = readText("hooks/hook_adapter.py");
  assert.match(adapter, /"plan": "owned-plan\.py"/);
  assert.match(adapter, /def build_plan_context_request\(/);
  assert.match(adapter, /def _valid_plan_context_result\(/);
  assert.match(adapter, /def invoke_plan_runtime\(/);
  assert.match(adapter, /"allowed_profiles": \["legacy", "smart", "autonomous"\]/);
  assert.match(adapter, /ADAPTER_DEADLINE_SECONDS = 27\.0/);
  assert.match(adapter, /CATCHUP_SECONDS = 15\.0/);
  assert.match(adapter, /FINALIZATION_RESERVE_SECONDS = 1\.0/);
  assert.doesNotMatch(adapter, /subprocess\.run\(/);
  assert.match(adapter, /sibling_runtime_path\("plan"\)/);
  assert.match(adapter, /sibling_runtime_path\("catchup"\)/);
  const main = adapter.slice(adapter.indexOf("def main()"));
  assert.ok(main.indexOf('sibling_runtime_path("plan")') < main.indexOf('sibling_runtime_path("catchup")'));
  for (const retired of [
    "def _plan_candidate(", "def _active_slug(", "def resolve_plan(",
    "def session_attachment(", "def plan_file(", "def resolve_project_state(",
  ]) assert.doesNotMatch(adapter, new RegExp(retired.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(adapter, /task_file\.read_text|progress_file\.read_text/);
});

test("README owns the document map while DESIGN owns the repository implementation map", () => {
  const readme = readText("README.md");
  const design = readText("DESIGN.md");
  const roadmap = readText("ROADMAP.md");
  const agents = readText("AGENTS.md");
  const artifact = readJson(currentArtifactPath);
  const ownedPlan = readText("runtime/owned-plan.py");
  const adapter = readText("hooks/hook_adapter.py");

  assert.match(readme, /## 开发状态与文档地图/);
  for (const authority of [
    "ARCHITECTURE.md", "DESIGN.md", "CHANGELOG.md", "ROADMAP.md", "BASELINE_PROVENANCE.md",
    "MAINTAINER_HANDOFF.md", "docs/repository-governance-guide.md",
  ]) assert.match(readme, new RegExp(authority.replace(".", "\\.")));
  assert.doesNotMatch(readme, /当前源码\/package 身份|当前已接受的 rollback|previous fallback/);
  assert.doesNotMatch(readme, /## 仓库地图/);
  assert.doesNotMatch(readme, /构建当前 .*候选 ZIP|当前 ZIP 必须包含精确 \d+ entries/);

  assert.match(design, /^# 仓库实现设计/m);
  assert.match(design, /## 1\. 文档定位/);
  assert.match(design, /## 2\. 仓库地图/);
  for (const implementationPath of [
    "install.js", "hooks/hook_adapter.py", "runtime/owned-plan.py", "runtime/owned-catchup.py",
    "tools/import_upstream_runtime.py", "tools/build_release.py",
  ]) assert.match(design, new RegExp(implementationPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(design, /当前生产回滚|GitHub `Latest`|Product Phase 4.*未授权/);
  assert.equal(artifact.entries.some(entry => entry.path === "DESIGN.md"), false);

  assert.doesNotMatch(roadmap, /\| 当前允许做什么、唯一 Next Step 是什么 \|/);
  assert.match(roadmap, /README\.md.*开发状态与文档地图/);
  assert.match(agents, /README\.md.*开发状态与文档地图/);
  assert.match(agents, /DESIGN\.md/);
  assert.doesNotMatch(ownedPlan, /Inactive managed plan-context runtime|Phase 3 Round 4/);
  assert.doesNotMatch(adapter, /inactive exact-v1 owned-plan request/);
});

test("ARCHITECTURE preserves system reasoning while DESIGN routes implementation changes", () => {
  const architecture = readText("ARCHITECTURE.md");
  const design = readText("DESIGN.md");

  assert.match(architecture, /^<a name="cloud-lifecycle"><\/a>$/m);
  assert.match(architecture, /\[.*DESIGN.*\]\(DESIGN\.md\)/);

  assert.match(design, /^<a name="implementation-layout"><\/a>$/m);
  assert.match(design, /^<a name="module-responsibilities"><\/a>$/m);

  for (const target of [
    "contracts/runtime-bundle-v2.json", "contracts/release-artifact-v2.json",
    "tests/installer.test.js", "tests/hook-adapter.test.js", "tests/owned-plan-runtime.test.js",
    "tests/owned-runtime.test.js", "tests/import-runtime.test.js", "tests/release-package.test.js",
    "tests/published-release-oracles.test.js",
  ]) assert.match(design, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.doesNotMatch(design, /ADAPTER_DEADLINE_SECONDS|20,000|50 \/ 20|当前生产回滚|GitHub `Latest`/);
});

test("DESIGN maps every test module back to the capability and boundary it protects", () => {
  const design = readText("DESIGN.md");
  const start = design.indexOf("### 6.1 测试职责反向索引");
  const end = design.indexOf("## 7. 继续阅读", start);
  assert.notEqual(start, -1, "DESIGN lacks the reverse test responsibility index");
  assert.notEqual(end, -1, "DESIGN reverse test responsibility index has no section boundary");
  const reverseIndex = design.slice(start, end);

  for (const column of ["测试文件", "主要保护内容", "直接对象/边界", "平台属性"]) {
    assert.match(reverseIndex, new RegExp(column));
  }

  const testModules = fs.readdirSync(path.join(root, "tests"), { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".test.js"))
    .map(entry => entry.name)
    .sort();
  const documentedModules = [...reverseIndex.matchAll(/\]\(tests\/([^)]+\.test\.js)\)/g)]
    .map(match => match[1])
    .sort();
  assert.deepEqual(documentedModules, testModules);
  for (const module of testModules) {
    const link = `](tests/${module})`;
    assert.equal(reverseIndex.split(link).length - 1, 1, `${module}: expected one reverse-index row`);
  }

  assert.match(reverseIndex, /test title.*assertion/is);
  assert.doesNotMatch(reverseIndex, /\b\d+\s+(?:tests?|cases?|passed|failed|skipped)\b/i);
});

test("ROADMAP keeps stable Discovery, migration, and Release governance anchors", () => {
  const roadmap = readText("ROADMAP.md");
  const readme = readText("README.md");
  const repositoryGovernance = readText("docs/repository-governance-guide.md");
  const phase41 = readText("docs/history/phase-4.1-managed-v3-discovery.md");
  const phase44 = readText("docs/history/phase-4.4-f2a-smart-activation-discovery.md");
  const currentTrainStart = roadmap.indexOf("## 4. 当前开发列车");
  const productPhaseStart = roadmap.indexOf("## 5. Product Phase 路线");
  const versioningStart = roadmap.indexOf("## 6. 版本号与晋级语义");
  const discoveryStart = roadmap.indexOf("## 7. Discovery 与 gate 晋级模型");
  const migrationStart = roadmap.indexOf("## 8. Migration transaction 与对象生命周期治理");
  const releaseStart = roadmap.indexOf("## 9. Release 授权与封板顺序");
  const rollbackStart = roadmap.indexOf("## 10. rollback 原则");
  const longTermStart = roadmap.indexOf("## 11. 长期路线");
  const retirementStart = roadmap.indexOf('<a name="version-train-two-retirement-reviews"></a>');
  const compatibilityStart = roadmap.indexOf('<a name="pre-1-compatibility-admission"></a>');
  const releaseFlowStart = roadmap.indexOf('<a name="release-four-step-flow"></a>');
  assert.notEqual(currentTrainStart, -1);
  assert.notEqual(productPhaseStart, -1);
  assert.notEqual(versioningStart, -1);
  assert.notEqual(discoveryStart, -1);
  assert.notEqual(migrationStart, -1);
  assert.notEqual(releaseStart, -1);
  assert.notEqual(rollbackStart, -1);
  assert.notEqual(longTermStart, -1);
  const currentTrain = roadmap.slice(currentTrainStart, productPhaseStart);
  const productPhases = roadmap.slice(productPhaseStart, versioningStart);
  const migrationGovernance = roadmap.slice(migrationStart, releaseStart);
  const compatibilityGovernance = roadmap.slice(compatibilityStart, rollbackStart);
  const developmentTrain = roadmap.match(/^\| 当前开发列车 \| `(v[^`]+)`/m)?.[1];
  assert.ok(developmentTrain, "ROADMAP lacks a parseable current development train");
  const escapedDevelopmentTrain = developmentTrain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(roadmap, /^<a name="version-train-two-retirement-reviews"><\/a>$/m);
  assert.match(roadmap, /^<a name="product-phase-4"><\/a>$/m);
  assert.match(roadmap, /^<a name="discovery-gate-governance"><\/a>$/m);
  assert.match(roadmap, /^<a name="migration-transaction-lifecycle-governance"><\/a>$/m);
  assert.match(roadmap, /^<a name="release-four-step-flow"><\/a>$/m);
  assert.match(roadmap, /^<a name="pre-1-compatibility-admission"><\/a>$/m);
  assert.match(roadmap, /每条发布列车都必须经过两轮 retirement review/);
  assert.match(roadmap, /第一轮：source-candidate closeout/);
  assert.match(roadmap, /第二轮：role-window closeout/);
  assert.match(roadmap, /review.*不是为了清单好看而强制删除/);
  assert.match(repositoryGovernance, /^<a name="planning-lifecycle"><\/a>$/m);
  assert.match(roadmap, /docs\/repository-governance-guide\.md#planning-lifecycle/);
  assert.match(roadmap, /planning[\s\S]{0,180}维护者[\s\S]{0,120}明确决定[\s\S]{0,120}不(?:得|会)自动删除/);
  assert.match(roadmap, /candidate admission preflight[\s\S]{0,240}只读[\s\S]{0,240}不删除/);
  assert.match(roadmap, /Source\/Candidate[\s\S]{0,240}失败[\s\S]{0,240}planning[\s\S]{0,180}回滚/);
  assert.match(roadmap, /package、contract、runtime、bootstrap、ZIP allowlist[\s\S]{0,240}新C0[\s\S]{0,160}Source\/Candidate/);
  assert.match(roadmap, /多个低风险 Phase合并到同一版本列车[\s\S]*每个 Phase仍分别做第一轮审查[\s\S]*只在最终发布时做一次[\s\S]*第二轮审查/);
  assert.ok(discoveryStart < migrationStart && migrationStart < releaseStart
    && releaseStart < rollbackStart && rollbackStart < longTermStart,
    "Discovery, migration, Release, rollback, and long-term governance must remain ordered");
  assert.ok(releaseStart < retirementStart && retirementStart < compatibilityStart,
    "retirement reviews must live inside Release governance before compatibility policy");
  const releaseFlow = roadmap.slice(releaseFlowStart, retirementStart);
  assert.match(releaseFlow,
    /candidate admission preflight[\s\S]*C0：候选源码 commit[\s\S]*Source\/Candidate Cloud PASS[\s\S]*source-candidate closeout retirement checkpoint[\s\S]*C1：第一阶段状态commit[\s\S]*正式验收tag精确指向C0[\s\S]*immutable Pre-release[\s\S]*Published Release Cloud PASS[\s\S]*Latest promotion\/postflight[\s\S]*role-window closeout retirement checkpoint[\s\S]*C2：最终治理commit/);
  const retirementFlow = roadmap.slice(retirementStart, compatibilityStart);
  assert.match(retirementFlow,
    /candidate admission preflight[\s\S]*C0 \/ Source-Candidate[\s\S]*Source\/Candidate Cloud PASS[\s\S]*source-candidate closeout retirement checkpoint[\s\S]*C1 \/ 第一阶段状态写回[\s\S]*immutable publication[\s\S]*Published Release Cloud PASS[\s\S]*Latest\/postflight[\s\S]*role-window closeout retirement checkpoint[\s\S]*C2 \/ final evidence与programme closeout/);
  for (const role of [
    "SOURCE_CANDIDATE_HEAD", "SOURCE_CANDIDATE_CHECKPOINT_HEAD",
    "PUBLISHED_RELEASE_CLOSEOUT_HEAD",
  ]) assert.match(roadmap, new RegExp("`" + role + "`"));
  assert.match(roadmap, /C0[\s\S]*C1[\s\S]*C2/);
  assert.doesNotMatch(roadmap, /<a name="phase-9-v0-4-0-instance"><\/a>/);
  assert.match(currentTrain, new RegExp(`^### 4\\.1 当前 \`${escapedDevelopmentTrain}\``, "m"));
  assert.match(currentTrain, /documentation governance/);
  assert.match(currentTrain, /package identity[\s\S]*0\.4\.2/);
  assert.match(currentTrain, /Release candidate[\s\S]*Source\/Candidate[\s\S]*PENDING/);
  assert.match(currentTrain,
    /已经完成以下文档治理交付[\s\S]*RETROSPECTIVE_CAPSULE[\s\S]*FROZEN_DISCOVERY_RECORD/);
  assert.match(currentTrain,
    /第4节current train工作台[\s\S]*第5节`product-phase-N`长期authority[\s\S]*列车轮转/);
  assert.match(currentTrain,
    /patch继承其修补的Product baseline[\s\S]*governance按ROADMAP声明的version series落位[\s\S]*维护者确认/);
  assert.match(currentTrain, /candidate \+ accepted role window/);
  assert.match(currentTrain, /trusted\/Release zones 继续 exact[\s\S]*docs\/planning zones 按 lifecycle policy/);
  assert.match(currentTrain,
    /current development train工作台[\s\S]*活动planning[\s\S]*不会自动成为长期Product Phase authority/);
  assert.doesNotMatch(currentTrain, /F3B2 closeout|回退 smart-only|unreachable code/);
  assert.doesNotMatch(currentTrain,
    /Phase 4 已采纳 gate 路线|F2 activation\/disarm 前置协议|F2B Discovery 交接|P9-A pre-seal|P9-F second retirement|流水账文件/);
  assert.match(productPhases, /^#### 5\.1\.1 Phase 4 为什么存在：给计划行为授权，不给模型扩权$/m);
  assert.match(productPhases, /^#### 5\.1\.2 F2 activation\/disarm 前置协议$/m);
  assert.match(productPhases, /^#### 5\.1\.3 Phase 4 activation\/lifecycle 决策$/m);
  assert.match(productPhases,
    /Product Phase closeout时[\s\S]*Phase-level canonical anchor[\s\S]*current-authority链接从第4节迁到这里/);
  assert.match(productPhases,
    /当前维护默认一条版本列车只承载一个Product Phase[\s\S]*维护者[\s\S]*明确授权/);
  assert.match(productPhases, /patch\/governance列车没有新Product Phase时不得虚构条目/);
  assert.match(productPhases,
    /所修补Product baseline[\s\S]*ROADMAP声明的版本系列[\s\S]*不能唯一判断时先由维护者确认/);
  assert.match(productPhases,
    /repository-governance-guide\.md#product-phase-authority-rotation/);
  assert.match(productPhases, /\| 5 \|[\s\S]*PreCompact\/PostCompact/);
  assert.match(productPhases, /\| 6 \|[\s\S]*噪声[\s\S]*`NO_GO`/);
  assert.match(productPhases, /\| 7 \|[\s\S]*唯一[\s\S]*read-only/);
  assert.match(productPhases, /\| 8 \|[\s\S]*best-effort shell lock[\s\S]*managed authority/);
  assert.doesNotMatch(productPhases, /ROADMAP\.md#product-phase-4/);
  assert.match(phase41, /\]\(\.\.\/\.\.\/ROADMAP\.md#product-phase-4\)/);
  assert.match(phase44, /\]\(\.\.\/\.\.\/ROADMAP\.md#product-phase-4\)/);
  assert.doesNotMatch(roadmap, /### 5\.4 迁移 transaction 与对象生命周期治理/);
  assert.doesNotMatch(roadmap, /### 5\.5 Phase 5～8 已采纳边界/);
  assert.match(migrationGovernance, /关键迁移可以按照风险、ownership和故障域拆成独立审查、实施、测试和停止点/);
  assert.match(migrationGovernance, /具体拆分由当前Discovery与活动task plan[\s\S]*不继承历史Phase的gate名称或数量/);
  assert.match(migrationGovernance, /任何拆分都不能形成可发布的半成品[\s\S]*最终候选必须在同一transaction内[\s\S]*原子闭合/);
  assert.doesNotMatch(migrationGovernance, /F1A|F1B/);
  assert.match(migrationGovernance, /对象生命周期账[\s\S]*KEEP\/REPLACE\/RETIRE\/DEFER/);
  assert.match(migrationGovernance, /planning[^\n]*implementation drift/i);
  assert.match(migrationGovernance, /implementation[^\n]*live[^\n]*lifecycle drift/i);
  assert.match(compatibilityGovernance, /文档路径与anchor在`0\.x`阶段同样不会自动成为永久兼容合同/);
  assert.match(compatibilityGovernance, /没有current入链的旧alias可以直接退休[\s\S]*immutable commit\/tag保留/);
  assert.match(compatibilityGovernance, /进入`1\.0\.0`稳定线[\s\S]*public documentation surface[\s\S]*长期兼容面治理/);
  assert.doesNotMatch(roadmap, /### 4\.6 流水账/);
  assert.match(readme, /ROADMAP\.md#pre-1-compatibility-admission/);
});

test("Phase 4 separates platform execution permission from plan-local product consent", () => {
  const roadmap = readText("ROADMAP.md");
  const history = readText("docs/history/phase-4.1-managed-v3-discovery.md");

  for (const term of [
    "本地 sandbox / approval",
    "Cloud task / container policy",
    "system-managed Hook trust",
    "Phase 4 plan-local opt-in",
  ]) assert.match(roadmap, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(roadmap, /给计划行为授权，不给模型扩权/);
  assert.match(roadmap, /`autonomous`[\s\S]{0,180}不表示 Codex 获得更高 OS 权限/);
  assert.doesNotMatch(roadmap, /“授权”必须继续分成三层/);
  assert.match(history, /^<a name="phase-4-1-post-implementation-opt-in-clarification"><\/a>$/m);
  assert.match(history, /Phase 4 的 opt-in 不是 Codex 权限申请/);
  assert.match(history, /这才是 Phase 4 实现的产品 opt-in/);
});
