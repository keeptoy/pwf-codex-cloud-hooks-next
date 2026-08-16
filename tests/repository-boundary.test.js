"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { validatePlanningScopes } = require("./f3-lifecycle-helpers");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const trustedPrefixes = ["contracts/", "hooks/", "patches/", "runtime/", "tools/"];
const trustedRootPaths = new Set(["install.js", "package.json", "upstream-manifest.json"]);
const versionPattern = "v\\d+\\.\\d+\\.\\d+(?:-[A-Za-z0-9.]+)?";
const currentManifest = JSON.parse(read("upstream-manifest.json"));
const currentArtifactPath = currentManifest.managed_runtime.contracts.release_artifact.path;
const currentBundlePath = currentManifest.managed_runtime.contracts.runtime_bundle.path;

function repositoryPaths() {
  const result = spawnSync("git", ["-c", "core.quotepath=false", "ls-files", "--cached", "--others", "--exclude-standard"], {
    cwd: root, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean)
    .map(value => value.replaceAll("\\", "/"))
    .filter(relative => fs.existsSync(path.join(root, relative))).sort();
}

function isTrustedSource(relative) {
  return trustedRootPaths.has(relative) || trustedPrefixes.some(prefix => relative.startsWith(prefix));
}

function currentRoleWindow() {
  const roadmap = read("ROADMAP.md");
  const candidateMatch = roadmap.match(new RegExp("^\\| 当前开发列车 \\| `(" + versionPattern + ")`", "m"));
  const acceptedMatch = roadmap.match(new RegExp("^\\| 当前已接受版本 \\| `(" + versionPattern + ")`", "m"));
  const fallbackMatch = roadmap.match(new RegExp("^\\| 当前直接回退版本 \\| immutable `(" + versionPattern + ")` immediate fallback", "m"));
  assert.ok(candidateMatch, "ROADMAP lacks a parseable current candidate role");
  assert.ok(acceptedMatch, "ROADMAP lacks a parseable accepted baseline role");
  assert.ok(fallbackMatch, "ROADMAP lacks a parseable immediate fallback role");
  const candidate = candidateMatch[1];
  const accepted = acceptedMatch[1];
  const immediateFallback = fallbackMatch[1];
  const packageVersion = JSON.parse(read("package.json")).version;
  assert.equal(candidate, `v${packageVersion}`, "package identity must match the current candidate role");
  assert.notEqual(accepted, immediateFallback, "accepted and immediate fallback roles must remain distinct");
  return { accepted, candidate, immediateFallback, roadmap };
}

test("Phase 4 foundation keeps the candidate and accepted identity window distinct", () => {
  const { accepted, candidate, roadmap } = currentRoleWindow();
  assert.equal(candidate, "v0.4.0-dev");
  assert.equal(accepted, "v0.3.5");
  assert.notEqual(candidate, accepted);
  assert.match(roadmap, /F0[^\n]*complete/);
  assert.match(roadmap, /F1A[^\n]*complete/);
  assert.match(roadmap, /F1 foundation[^\n]*complete/);
  assert.match(roadmap, /F2A[^\n]*Cloud PASS/);
  assert.match(roadmap, /F2B[^\n]*Source\/Candidate Cloud PASS/);
  assert.match(roadmap, /F2A\/F2B\/F3A Source\/Candidate Cloud PASS/);
  assert.match(roadmap, /F3B0 Discovery 与 F3B1 no-live protocol materialization complete/);
  assert.match(roadmap, /F3B2 smart Cloud live PASS/);
  assert.match(roadmap, /F3B3 autonomous zero-ledger\/tamper\/disarm\/re-attest\/re-arm Cloud live PASS/);
  assert.match(roadmap, /F3B4 evidence closure PASS；F3C 未授权/);
});

test("trusted source zones are exact while repository governance paths remain lifecycle-managed", () => {
  const actual = repositoryPaths();
  const artifact = JSON.parse(read(currentArtifactPath));
  const releasePaths = artifact.entries.map(item => item.path);
  const expectedTrusted = releasePaths.filter(isTrustedSource).sort();
  const actualTrusted = actual.filter(isTrustedSource).sort();

  assert.deepEqual(actualTrusted, expectedTrusted);
  for (const relative of [...releasePaths, ...artifact.external_release_assets]) {
    assert.equal(actual.includes(relative), true, relative);
    assert.equal(fs.existsSync(path.join(root, relative)), true, `${relative} must exist in the working tree`);
  }
  for (const required of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "docs/cloud-hard-acceptance-template.md",
    "docs/v0.4.0-dev-f3-cloud-lifecycle-runbook.md",
    "docs/repository-governance-guide.md",
  ]) {
    assert.equal(actual.includes(required), true, required);
    assert.equal(fs.existsSync(path.join(root, required)), true, `${required} must exist in the working tree`);
  }
  for (const prefix of [".planning/", "docs/", "tests/"]) {
    assert.equal(artifact.excluded_prefixes.includes(prefix), true, prefix);
    assert.equal(releasePaths.some(item => item.startsWith(prefix)), false, prefix);
  }
  for (const forbidden of [
    "PROJECT_UNDERSTANDING.md", "work_plan.md", "黑盒验证.md", "snapshot-prototype/",
    "tests/phase3-contracts.test.js", "tests/snapshot-prototype-handoff.test.js",
  ]) assert.equal(actual.some(item => item === forbidden || item.startsWith(forbidden)), false, forbidden);
  for (const relative of actual.filter(item => item.startsWith("tests/fixtures/"))) {
    assert.doesNotMatch(relative, new RegExp(versionPattern, "i"),
      `test fixture path must use a semantic identity: ${relative}`);
  }
});

test("planning lifecycle has one valid active pointer and complete scoped records", () => {
  const actual = repositoryPaths();
  const activePlan = read(".planning/.active_plan").trim();

  assert.match(activePlan, /^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9.-]*$/);
  assert.equal(validatePlanningScopes(root, activePlan, actual), "legacy",
    "the development candidate's real active planning scope must remain markerless before F3B live");

  const activeTask = read(`.planning/${activePlan}/task_plan.md`);
  for (const heading of ["Authorization", "Next Step", "Stop Conditions"]) {
    assert.match(activeTask, new RegExp(`^## ${heading}$`, "m"), `active task plan lacks ${heading}`);
  }
});

test("documentation lifecycle paths stay portable and outside the Release artifact", () => {
  const actual = repositoryPaths();
  const artifact = JSON.parse(read(currentArtifactPath));
  const releasePaths = artifact.entries.map(item => item.path);
  const docs = actual.filter(item => item.startsWith("docs/"));
  const { accepted, candidate } = currentRoleWindow();
  const roleVersions = [...new Set([accepted, candidate])].sort();
  const rootBootstraps = actual.filter(item => /^init-cloud-sandbox-v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.bash$/.test(item));
  const acceptanceDocs = docs.filter(item => /^docs\/v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?-cloud-hard-acceptance\.md$/.test(item));

  assert.equal(artifact.excluded_prefixes.includes("docs/"), true);
  for (const relative of docs) {
    assert.match(relative, /^docs\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.md$/);
    assert.equal(releasePaths.includes(relative), false, relative);
  }
  assert.deepEqual(rootBootstraps, roleVersions.map(version => `init-cloud-sandbox-${version}.bash`));
  assert.deepEqual(acceptanceDocs, roleVersions.map(version => `docs/${version}-cloud-hard-acceptance.md`));
  const acceptanceTemplate = read("docs/cloud-hard-acceptance-template.md");
  assert.match(acceptanceTemplate, /^<a name="cloud-hard-acceptance-template"><\/a>$/m);
  assert.match(acceptanceTemplate, /^<a name="acceptance-document-responsibilities"><\/a>$/m);
  assert.match(acceptanceTemplate, /^<a name="version-gate-status-ledger"><\/a>$/m);
  assert.match(acceptanceTemplate, /^<a name="version-acceptance-delta"><\/a>$/m);
  assert.match(acceptanceTemplate, /\| 本模板 \| Source\/Candidate 与 Published Release 的稳定执行协议/);
  assert.match(acceptanceTemplate, /\| 活动 Release task plan \|[^\n]*Next Step/);
  assert.match(acceptanceTemplate, /\| 版本专项 acceptance \|[^\n]*最终结论/);
  assert.match(acceptanceTemplate, /多 gate 开发版本可以维护一张简洁的版本内 gate 验收状态表/);
  assert.match(acceptanceTemplate, /\| 版本专项 acceptance \|[^\n]*\| 逐步骤流水账/);
  assert.match(acceptanceTemplate, /CURRENT \/ CLOUD_ACCEPTANCE_PENDING/);
  assert.match(acceptanceTemplate, /CURRENT \/ EVIDENCE_WRITEBACK_PENDING/);
  assert.match(acceptanceTemplate, /`NOT_AUTHORIZED`/);
  assert.match(acceptanceTemplate, /一次性版本没有中间 gate 时\s*整个状态表省略/);
  assert.match(acceptanceTemplate, /development identity 收敛为 stable identity/);
  assert.match(acceptanceTemplate, /不得让 dev\/stable\s+两份 acceptance 并存/);
  assert.match(acceptanceTemplate, /### 0\.3 “当前 gate 验收增量”（可选）/);
  assert.match(acceptanceTemplate, /没有验收增量时/);
  assert.match(acceptanceTemplate, /B～E 黑盒提示词是否变化/);
  assert.match(acceptanceTemplate, /版本文件不得再次复制脚本、提示词或完整执行步骤/);
  assert.match(acceptanceTemplate, /Environment variables（“环境变量”）[\s\S]*PWF_ACCEPTANCE_NODE_MAJOR[\s\S]*不要只在 setup script 中/);
  assert.match(acceptanceTemplate, /### 4\.2 Published Release[\s\S]*__IMMUTABLE_BOOTSTRAP_URL__[\s\S]*__IMMUTABLE_BOOTSTRAP_SHA256__/);
  assert.match(acceptanceTemplate, /### 9\.2 Published Release[\s\S]*__IMMUTABLE_ZIP_URL__[\s\S]*__IMMUTABLE_ZIP_SHA256__/);
  assert.match(acceptanceTemplate, /PWF_CLOUD_ACCEPTANCE_CANONICAL_V1[\s\S]*PWF_CLOUD_ACCEPTANCE_REAL_RESUME_TAIL/);
  assert.match(acceptanceTemplate,
    /PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1[\s\S]*PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1/);
  for (const sentinel of [
    "PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1",
    "PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1",
  ]) {
    for (const section of [
      acceptanceTemplate.slice(acceptanceTemplate.indexOf("## 6. C"), acceptanceTemplate.indexOf("## 7. D")),
      acceptanceTemplate.slice(acceptanceTemplate.indexOf("## 7. D"), acceptanceTemplate.indexOf("## 8. E")),
      acceptanceTemplate.slice(acceptanceTemplate.indexOf("### 8.2 E2"), acceptanceTemplate.indexOf("## 9. Post-resume")),
    ]) assert.match(section, new RegExp(sentinel), `${sentinel} must remain in C, D, and E2`);
  }
  assert.match(acceptanceTemplate, /不要创建或修改任何 \.pwf-codex-managed、\.mode/);
  assert.match(acceptanceTemplate, /禁止创建或切换 branch，禁止 commit、push、创建或更新 PR\/Release/);
  assert.match(acceptanceTemplate, /C 段改动只保留在工作树，不得提交/);
  assert.match(acceptanceTemplate, /stdout\/stderr 分片不代表进程已经结束/);
  assert.match(acceptanceTemplate, /session_id[\s\S]*继续轮询同一 session[\s\S]*exit_code/);
  assert.match(acceptanceTemplate, /没有明确最终 exit_code/);
  assert.match(acceptanceTemplate, /INCOMPLETE\/UNKNOWN[\s\S]*禁止猜测或补写工具未返回的 exit code/);
  assert.match(acceptanceTemplate, /YYYY-MM-DD-pwf-cloud-acceptance-v1-xxxxxxxx/);
  assert.match(acceptanceTemplate, /PWF_CLOUD_ACCEPTANCE_BASELINE_CREATED plan_id=PLAN_ID/);
  assert.match(acceptanceTemplate, /PWF_WORKTREE_CHANGES=PLANNING_ONLY/);
  assert.match(acceptanceTemplate, /grep -Ev '\^\.\. \\.planning\/'/);
  assert.doesNotMatch(acceptanceTemplate, /PWF_DEEP_CHECK_PROTOCOL=MANIFEST_ROUTED_BUNDLE_V2/);
  for (const fact of [
    "PWF_DEEP_CHECK_MANIFEST_SCHEMA",
    "PWF_DEEP_CHECK_RELEASE_CONTRACT_PATH",
    "PWF_DEEP_CHECK_RELEASE_CONTRACT_ID",
    "PWF_DEEP_CHECK_RELEASE_SCHEMA",
    "PWF_DEEP_CHECK_BUNDLE_CONTRACT_PATH",
    "PWF_DEEP_CHECK_BUNDLE_CONTRACT_ID",
    "PWF_DEEP_CHECK_BUNDLE_SCHEMA",
    "PWF_DEEP_CHECK_INSTALLED_ROOT",
  ]) {
    assert.equal((acceptanceTemplate.match(new RegExp(fact, "g")) || []).length, 2,
      `${fact} must be emitted by both deep-check channels`);
  }
  assert.doesNotMatch(acceptanceTemplate, /ACCEPTANCE_STATE|pwf-source-candidate-acceptance\.json/);
  assert.match(acceptanceTemplate, /bundle\["roots"\]\["installed"\]/);
  assert.equal((acceptanceTemplate.match(/for section in \("upstream_files", "local_files", "installed_contracts"\):/g) || []).length, 4,
    "both deep checks must derive inventory and hashes from all v2 bundle partitions");
  assert.equal((acceptanceTemplate.match(/hash_key = "pristine_sha256" if section == "upstream_files" else "sha256"/g) || []).length, 2);
  assert.doesNotMatch(acceptanceTemplate, /release-artifact-v1|runtime-bundle-v1|bundle\["files"\]/);
  assert.match(acceptanceTemplate, /版本专项 acceptance 应保存以下原始证据/);
  assert.doesNotMatch(acceptanceTemplate, new RegExp(versionPattern, "i"));
  assert.doesNotMatch(acceptanceTemplate, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(acceptanceTemplate, /Phase 4 marker/i);
  assert.doesNotMatch(acceptanceTemplate, /Gate ledger|Cloud state|当前状态|R5_PR_IN_PROGRESS/);
  assert.doesNotMatch(acceptanceTemplate, /readonly (?:PUBLICATION_TAG|PACKAGE_VERSION|ZIP_NAME|ZIP_SIZE)=/);
  assert.equal(releasePaths.includes("docs/cloud-hard-acceptance-template.md"), false);
  const fixedBootstrapName = /init-cloud-sandbox-v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.bash/;
  for (const stableDoc of [
    "README.md", "AGENTS.md", "docs/cloud-hard-acceptance-template.md",
    "docs/repository-governance-guide.md",
  ]) {
    assert.doesNotMatch(read(stableDoc), fixedBootstrapName, `${stableDoc} must use a version-neutral bootstrap command`);
  }
  assert.match(read("README.md"), /for bootstrap in init-cloud-sandbox-v\*\.bash; do/);
  for (const retired of [
    "docs/beta3-dev-m3-cloud-equivalence.md",
    "docs/beta3-dev-m4-cutover-plan.md",
  ]) assert.equal(actual.includes(retired), false, retired);
  assert.match(read("docs/repository-governance-guide.md"), /^<a name="repository-governance-guide"><\/a>$/m);
  assert.match(read("MAINTAINER_HANDOFF.md"), /\[[^\]]*仓库治理指南[^\]]*\]\(docs\/repository-governance-guide\.md\)/);
});

test("historical documents have one macro entrance and remain advisory", () => {
  const readme = read("README.md");
  assert.match(readme, /\]\(docs\/history\/README\.md\)/);
  assert.equal((readme.match(/docs\/history\//g) || []).length, 1,
    "README must expose exactly one historical-document entrance");
  for (const macroDoc of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md", "ROADMAP.md",
  ]) assert.doesNotMatch(read(macroDoc), /docs\/history\//,
    `${macroDoc} must not create a second historical-document entrance`);
});

test("portable repository governance keeps stable retirement anchors", () => {
  const guide = read("docs/repository-governance-guide.md");

  assert.match(guide, /^<a name="repository-governance-guide"><\/a>$/m);
  assert.match(guide, /^<a name="retirement-definition-of-done"><\/a>$/m);
});

test("cold history stays on immutable refs and outside runtime, Release, and adapter dispatch", () => {
  const runtime = read(currentBundlePath);
  const release = read(currentArtifactPath);
  const adapter = read("hooks/hook_adapter.py");
  const installer = read("install.js");
  const provenance = read("BASELINE_PROVENANCE.md");
  const { candidate } = currentRoleWindow();
  for (const content of [runtime, release, adapter]) {
    assert.doesNotMatch(content, /snapshot-prototype|prototype_snapshot_runner/);
    assert.doesNotMatch(content, /docs\/phase-|\.planning\/2026-08-01/);
  }
  const artifact = JSON.parse(release);
  assert.equal(artifact.package_version, candidate.slice(1));
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), false);
  assert.equal(artifact.entries.some(item => item.path === "contracts/compatibility-overlays-v1.json"), false);
  assert.equal(artifact.entries.some(item => item.path.startsWith("docs/") || item.path.startsWith("tests/")), false);
  assert.deepEqual(artifact.external_release_assets, [`init-cloud-sandbox-${candidate}.bash`]);
  assert.match(installer, /\[\[hooks\.SessionStart\.hooks\]\]/);
  assert.match(installer, /\[\[hooks\.UserPromptSubmit\.hooks\]\]/);
  for (const immutable of [
    "39795283cd65f84547651d7bec816191fb5bfedf",
    "0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151",
    "1454c9224c83d11c073b05baf6e536a11c3bb0e5",
    "bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b",
    "3234e4e02090c838f5ee260cd8f2d99daf358d65",
    "cc9bc878ddc7d70c25156dd053e2874758f0814a",
    "c5236958b9830ee3695b0e81e1a0746707a6b8f9",
  ]) assert.match(provenance, new RegExp(immutable));
});

test("change history, programme, provenance, and current acceptance keep separate lifecycle authorities", () => {
  const changelog = read("CHANGELOG.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const architecture = read("ARCHITECTURE.md");
  const design = read("DESIGN.md");
  const agents = read("AGENTS.md");
  const artifact = JSON.parse(read(currentArtifactPath));
  const runtimeBundle = JSON.parse(read(currentBundlePath));
  const { accepted, candidate, immediateFallback, roadmap } = currentRoleWindow();
  const acceptancePath = `docs/${candidate}-cloud-hard-acceptance.md`;
  const acceptance = read(acceptancePath);
  const escapedCandidate = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const changelogVersions = [...changelog.matchAll(new RegExp(`^## (${versionPattern})$`, "gm"))]
    .map(match => match[1]);
  assert.equal(changelogVersions[0], candidate, "CHANGELOG must lead with the current package version");
  assert.equal(changelogVersions.includes(accepted), true, "CHANGELOG must retain the accepted baseline delta");
  assert.equal(changelogVersions.includes(immediateFallback), true,
    "CHANGELOG must retain the immediate fallback delta");
  for (const target of ["ROADMAP.md", "BASELINE_PROVENANCE.md", acceptancePath]) {
    assert.match(changelog, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(changelog, /\b[a-f0-9]{64}\b|Next Step|GitHub `Latest`|production rollback|\d+ registered/);
  assert.equal(artifact.entries.some(entry => entry.path === "CHANGELOG.md"), false);

  assert.match(roadmap, new RegExp("## 3\\. 已完成的基线 `" + accepted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`"));
  assert.doesNotMatch(roadmap, /## 3\. 已完成的仓库迁移|M1 exact mirror|M2 slim transformation/);
  assert.equal((roadmap.match(/GitHub `Latest`/g) || []).length, 1);

  for (const publishedRoleVersion of new Set([accepted, immediateFallback])) {
    assert.match(provenance, new RegExp(publishedRoleVersion.replaceAll(".", "\\.")));
  }
  if (candidate !== accepted) {
    const candidateIsPublished = roadmap.includes(`\`${candidate}\` published prerelease candidate`);
    const candidatePattern = new RegExp(candidate.replaceAll(".", "\\."));
    if (candidateIsPublished) {
      assert.match(provenance, candidatePattern,
        "published candidate must enter the role-neutral provenance ledger");
    } else {
      assert.doesNotMatch(provenance, candidatePattern,
        "unpublished candidate must not enter the published provenance ledger");
    }
  }
  assert.match(provenance, /^## 1\. 已发布身份账本$/m);
  assert.doesNotMatch(provenance, /^### 1\.[12] /m,
    "published identities must share one role-neutral ledger instead of current/history subsections");
  const publishedLedger = provenance.slice(0, provenance.indexOf("## 2. Successor 迁移不可变证据"));
  assert.doesNotMatch(publishedLedger, /\b(?:candidate|accepted)\b|immediate fallback/,
    "published identity entries must not inherit ROADMAP role labels");
  assert.match(provenance, /## 2\. Successor 迁移不可变证据/);
  assert.doesNotMatch(provenance, /## 2\. Successor 迁移来源链/);
  assert.doesNotMatch(provenance, /当前源码权威|current lifecycle role|GitHub `Latest`|Next Step|\d+ registered/);

  for (const macroDoc of [architecture, design, agents]) {
    assert.doesNotMatch(macroDoc, /当前生产回滚|当前回退层级|GitHub `Latest`|production rollback/);
  }
  assert.match(design, /CHANGELOG\.md/);
  assert.match(changelog,
    /\[`BASELINE_PROVENANCE\.md` 的 Successor 迁移不可变证据\]\(BASELINE_PROVENANCE\.md#successor-migration-evidence\)/);
  assert.doesNotMatch(changelog, /docs\/history\//);
  assert.doesNotMatch(changelog, /Successor 迁移来源链/);

  assert.match(acceptance, new RegExp(`^# ${escapedCandidate} Cloud hard acceptance$`, "m"));
  assert.match(acceptance, /^<a name="v0-4-0-dev-gate-status"><\/a>$/m);
  assert.match(acceptance, /F0 development identity \/ guardrails[^\n]*`PASS`/);
  assert.match(acceptance, /F1A contract\/source foundation[^\n]*`PASS`/);
  assert.match(acceptance, /F1B inactive runtime foundation[^\n]*`PASS`/);
  assert.match(acceptance, /F2A local implementation[^\n]*`PASS`/);
  assert.match(acceptance, /F2A Source\/Candidate\/no-live Cloud[^\n]*`PASS`/);
  assert.match(acceptance, /F2B local autonomous implementation[^\n]*`PASS`/);
  assert.match(acceptance, /F2B Source\/Candidate\/no-live Cloud[^\n]*`PASS`/);
  assert.match(acceptance, /F3 Discovery[^\n]*`CONDITIONAL_GO_TO_F3A`/);
  assert.match(acceptance, /F3A local lifecycle foundation[^\n]*`PASS`/);
  assert.match(acceptance, /F3A Source\/Candidate\/no-live Cloud[^\n]*`PASS`/);
  assert.match(acceptance,
    /F3B0 live-preflight Discovery[^\n]*`CONDITIONAL_GO_TO_F3B1_PROTOCOL_MATERIALIZATION`/);
  assert.match(acceptance, /F3B1 protocol materialization \/ no-live dry run[^\n]*`PASS`/);
  assert.match(acceptance, /F3B2 smart live chain[^\n]*`PASS`/);
  assert.match(acceptance,
    /F3B3 autonomous live Discovery[^\n]*`CONDITIONAL_GO_TO_F3B3_AUTONOMOUS_MATERIALIZATION`/);
  assert.match(acceptance, /F3B3 autonomous materialization \/ repository-only audit[^\n]*`PASS`/);
  assert.match(acceptance, /F3B3 autonomous Cloud live[^\n]*`PASS`/);
  assert.match(acceptance,
    /F3B4 evidence-closure Discovery[^\n]*`CONDITIONAL_GO_TO_F3B4_EVIDENCE_CLOSURE`/);
  assert.match(acceptance, /F3B4 evidence closure[^\n]*`PASS`/);
  assert.match(acceptance, /F3C rollback[^\n]*`NOT_AUTHORIZED`/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3b4-aggregate-closure"><\/a>$/m);
  assert.match(acceptance,
    /F3B_LIVE_LIFECYCLE_PASS \/ SMART_AND_AUTONOMOUS_EVIDENCE_RECONCILED \/ STOP_BEFORE_F3C/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3b3-autonomous-live-evidence"><\/a>$/m);
  assert.match(acceptance,
    /F3B3_AUTONOMOUS_LIVE_PASS \/ TAMPER_REFUSAL_AND_REATTEST_CONFIRMED \/ STOP_AND_REVIEW \/ STOP_BEFORE_F3B4/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3a-acceptance-delta"><\/a>$/m);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3b2-smart-live-evidence"><\/a>$/m);
  const f3b2EvidenceStart = acceptance.indexOf('<a name="v0-4-0-dev-f3b2-smart-live-evidence"></a>');
  const f3b1DeltaStart = acceptance.indexOf('<a name="v0-4-0-dev-f3b1-acceptance-delta"></a>');
  const f3b2Evidence = acceptance.slice(f3b2EvidenceStart, f3b1DeltaStart);
  assert.match(f3b2Evidence, /b37eea4706fed8d4e764f824eb75a3820f31c9be/);
  assert.match(f3b2Evidence, /legacy → smart → legacy → smart/);
  assert.match(f3b2Evidence, /F3B2_SMART_LIVE_PASS \/ REVERSIBLE_OPT_IN_LIFECYCLE_CONFIRMED/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3a-source-candidate-evidence"><\/a>$/m);
  const f3aEvidenceStart = acceptance.indexOf('<a name="v0-4-0-dev-f3a-source-candidate-evidence"></a>');
  const f2bDeltaStart = acceptance.indexOf("## F2B 验收增量与模板同步");
  const f3aEvidence = acceptance.slice(f3aEvidenceStart, f2bDeltaStart);
  assert.match(f3aEvidence, /90d00de3f643defe566b1457064f46106ac791ae/);
  assert.match(f3aEvidence, /149 tests，149 pass，0 fail，0 skipped/);
  assert.match(f3aEvidence, /df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c/);
  assert.match(f3aEvidence, /F3A_SOURCE_CANDIDATE_NO_LIVE_CLOUD_PASS \/ STOP_BEFORE_F3B/);
  assert.match(acceptance, /本增量没有改写通用 B～E 提示词或 9\.1 deep-check 脚本/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f2a-acceptance-delta"><\/a>$/m);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f2b-source-candidate-evidence"><\/a>$/m);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f2a-source-candidate-evidence"><\/a>$/m);
  assert.match(acceptance, /F2A test-harness deviation 与协议修正/);
  assert.match(acceptance, /stale external acceptance script/);
  assert.match(acceptance, /不作为最终 exact F2A gate 封账/);
  assert.match(acceptance, /manifest 当前路由打印 release\/bundle contract/);
  assert.doesNotMatch(acceptance, /PWF_DEEP_CHECK_PROTOCOL=MANIFEST_ROUTED_BUNDLE_V2|9\.1 本步骤通过/);
  for (const fragment of [
    "source-candidate-sequence", "source-candidate-setup", "source-candidate-deep-check",
    "blackbox-canonical-baseline", "blackbox-canonical-context", "blackbox-real-resume",
  ]) assert.match(acceptance, new RegExp(`cloud-hard-acceptance-template\\.md#${fragment}`));
  const f2bEvidenceStart = acceptance.indexOf('<a name="v0-4-0-dev-f2b-source-candidate-evidence"></a>');
  const f2aDeltaStart = acceptance.indexOf('<a name="v0-4-0-dev-f2a-acceptance-delta"></a>');
  const f2bEvidence = acceptance.slice(f2bEvidenceStart, f2aDeltaStart);
  assert.match(f2bEvidence, /aeffc4d4c9e709ae59de2b193dabe5d092c5cb42/);
  assert.match(f2bEvidence, /144 tests，144 pass，0 fail，0 skipped/);
  assert.match(f2bEvidence, /df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c/);
  assert.match(f2bEvidence, /F2B_SOURCE_CANDIDATE_CLOUD_PASS \/ STOP_BEFORE_F3/);
  assert.match(f2bEvidence, /asynchronous tool-state misclassification/);
  assert.match(f2bEvidence, /stdout 不是进程状态/);
  const f2aEvidenceStart = acceptance.indexOf('<a name="v0-4-0-dev-f2a-source-candidate-evidence"></a>');
  const f2aDelta = acceptance.slice(f2aDeltaStart, f2aEvidenceStart);
  for (const sentinel of [
    "PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1",
    "PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1",
  ]) assert.equal((f2aDelta.match(new RegExp(sentinel, "g")) || []).length, 1);
  const f2aEvidence = acceptance.slice(f2aEvidenceStart,
    acceptance.indexOf("## F1B 验收增量（historical gate instance）"));
  assert.match(f2aEvidence, /31411b95d126ee9b27986fdcd72044f9474d3816/);
  assert.match(f2aEvidence, /138 tests，138 pass，0 fail，0 skipped/);
  assert.match(f2aEvidence, /7f1b1bd30d73011b0003d9c7e67e2df31bd302a08932c1302a83a84636ac3db4/);
  assert.match(f2aEvidence, /F2A_SOURCE_CANDIDATE_CLOUD_PASS \/ STOP_BEFORE_F2B_F3/);
  const currentTrainLine = roadmap.split(/\r?\n/)
    .find(line => line.startsWith("| 当前开发列车 |")) || "";
  const publishedReleaseComplete = candidate === accepted
    || currentTrainLine.includes("Published Release Cloud hard acceptance 已 PASS");
  const sourceCandidateEvidenceComplete = /SOURCE_CANDIDATE_CLOUD_PASS/.test(acceptance);
  if (candidate === accepted) {
    assert.equal(sourceCandidateEvidenceComplete, true,
      "accepted baseline must retain completed Source/Candidate evidence");
  }
  if (sourceCandidateEvidenceComplete) {
    assert.match(acceptance, /Source\/Candidate Cloud hard acceptance 已.*完成/s);
    assert.match(acceptance, /SOURCE_CANDIDATE_CLOUD_PASS \/ F1_FOUNDATION_COMPLETE/);
    assert.match(acceptance, /严格绑定.*zero-hash candidate/s);
  }
  if (candidate !== accepted && /\b[a-f0-9]{64}\b/i.test(acceptance)) {
    const currentEvidenceHeading = "## F3B3 autonomous live evidence";
    const currentEvidenceAt = acceptance.indexOf(currentEvidenceHeading);
    assert.notEqual(currentEvidenceAt, -1,
      "current completed gate lacks an exact evidence heading");
    assert.doesNotMatch(acceptance.slice(0, currentEvidenceAt), /\b[a-f0-9]{64}\b/i,
      "exact evidence must not leak above its completed-gate heading");
    const historicalEvidenceHeading = "## F1B Source/Candidate evidence (historical gate instance)";
    const historicalEvidenceAt = acceptance.indexOf(historicalEvidenceHeading);
    assert.notEqual(historicalEvidenceAt, -1,
      "retained pre-current-gate evidence must live under an explicitly historical gate heading");
    assert.ok(historicalEvidenceAt > currentEvidenceAt,
      "historical gate evidence must remain separate from current completed-gate evidence");
    assert.match(acceptance.slice(historicalEvidenceAt),
      /SOURCE_CANDIDATE_CLOUD_PASS \/ F1_FOUNDATION_COMPLETE/);
  }
  assert.match(acceptance, /64 位 zero hash.*fail closed/s);
  assert.match(acceptance, /Cloud hard acceptance template/);
  assert.match(acceptance, /不授予 F2A\/F2B activation/);
  assert.match(acceptance, /exact current id\/source inventory guard/);
  assert.match(acceptance, /本次验收增量没有改写 B～E 黑盒提示词/);
  assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-setup/);
  assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-deep-check/);
  assert.doesNotMatch(acceptance,
    /## 1\. 执行输入与边界|维护者执行顺序|回传证据|^## Next Step$|^## Errors Encountered$|第一次失败|重试命令|恢复位置/m);

  if (publishedReleaseComplete) {
    const publishedRow = provenance.split(/\r?\n/)
      .find(line => line.startsWith(`| \`${candidate}\` |`));
    assert.ok(publishedRow, "published candidate lacks a provenance ledger row");
    const publishedSource = publishedRow.match(/\[source `([a-f0-9]{40})`\]/);
    assert.ok(publishedSource, "published candidate provenance lacks an exact source");
    const bootstrapName = `init-cloud-sandbox-${candidate}.bash`;
    const zipName = `pwf-codex-cloud-hooks-${candidate}.zip`;
    const publishedHashes = [...new Set(publishedRow.match(/\b[a-f0-9]{64}\b/g) || [])];
    assert.equal(publishedHashes.length, 2, "published candidate must freeze ZIP and bootstrap SHA-256");
    const installedPrefix = "hooks/planning-with-files/";
    const expectedInstalled = [
      "THIRD_PARTY_NOTICES.md",
      "hook_adapter.py",
      ...runtimeBundle.local_files.map(item => item.installed_path.slice(installedPrefix.length)),
      ...runtimeBundle.installed_contracts.map(item => item.installed_path.slice(installedPrefix.length)),
      ...runtimeBundle.upstream_files.map(item => item.installed_path.slice(installedPrefix.length)),
    ];
    assert.match(acceptance, /## 3\. Published Release 完成证据/);
    assert.match(acceptance, new RegExp(`tag \`${escapedCandidate}\`；source \`${publishedSource[1]}\``));
    for (const identity of [bootstrapName, zipName, ...publishedHashes]) {
      assert.match(acceptance, new RegExp(identity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
    assert.match(acceptance, new RegExp(`PUBLIC_PACKAGE_IDENTITY=${escapedCandidate.slice(1)}`));
    assert.match(acceptance, new RegExp(`${artifact.entries.length} entries`));
    assert.match(acceptance, new RegExp(`exact ${expectedInstalled.length} 项`));
    for (const installedPath of expectedInstalled) assert.match(acceptance,
      new RegExp(installedPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(acceptance, new RegExp(`${runtimeBundle.upstream_files.length} 个 upstream runtime 均保持 pristine`));
    for (const upstream of runtimeBundle.upstream_files) assert.match(acceptance, new RegExp(upstream.pristine_sha256));
    assert.match(acceptance, /MANAGED_POLICY=ADAPTER_ONLY/);
    assert.match(acceptance, /SNAPSHOT_LEFTOVERS=0/);
    assert.match(acceptance, /R5-SC=PASS[\s\S]*R5-PR=PASS[\s\S]*CLOUD-HARD-ACCEPTANCE-PASS/);
    assert.match(acceptance, /不自动授权 GitHub `Latest`、rollback[\s\S]*Product Phase 4/);
  } else {
    assert.doesNotMatch(acceptance, /R5-SC=PASS|R5-PR=PASS|CLOUD-HARD-ACCEPTANCE-PASS/);
    assert.doesNotMatch(acceptance, /https:\/\/github\.com\/[^\s]+\/releases\/download\//i);
  }

  if (candidate === accepted) {
    assert.match(acceptance, /## 5\. Latest promotion 与 postflight/);
    assert.match(acceptance, /isLatest=true[\s\S]*isPrerelease=false[\s\S]*isDraft=false/);
    assert.match(acceptance, /POINTER_ONLY_PROMOTION_POSTFLIGHT=PASS/);
    assert.match(acceptance, new RegExp(`${escapedCandidate} 成为 accepted/Latest`));
    assert.match(acceptance, new RegExp(`${immediateFallback.replaceAll(".", "\\.")} 成为 immediate[\\s\\S]*fallback`));
    assert.match(acceptance, /Product Phase 4 仍未授权/);
  }
});

test("stable architecture contracts do not freeze version history", () => {
  const architectureContracts = read("tests/architecture-contracts.test.js");

  assert.doesNotMatch(architectureContracts, /docs\/v\d+\.\d+\.\d+[^"']*cloud-hard-acceptance\.md/i);
  assert.doesNotMatch(architectureContracts, /\bv\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\b/);
  assert.doesNotMatch(architectureContracts, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(architectureContracts, /artifact\.entries\.length/);
});
