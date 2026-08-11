"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const trustedPrefixes = ["contracts/", "hooks/", "patches/", "runtime/", "tools/"];
const trustedRootPaths = new Set(["install.js", "package.json", "upstream-manifest.json"]);
const planningFiles = ["findings.md", "progress.md", "task_plan.md"];
const versionPattern = "v\\d+\\.\\d+\\.\\d+(?:-[A-Za-z0-9.]+)?";

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

test("trusted source zones are exact while repository governance paths remain lifecycle-managed", () => {
  const actual = repositoryPaths();
  const artifact = JSON.parse(read("contracts/release-artifact-v1.json"));
  const releasePaths = artifact.entries.map(item => item.path);
  const expectedTrusted = releasePaths.filter(isTrustedSource).sort();
  const actualTrusted = actual.filter(isTrustedSource).sort();

  assert.deepEqual(actualTrusted, expectedTrusted);
  for (const relative of [...releasePaths, ...artifact.external_release_assets.map(item => item.path)]) {
    assert.equal(actual.includes(relative), true, relative);
    assert.equal(fs.existsSync(path.join(root, relative)), true, `${relative} must exist in the working tree`);
  }
  for (const required of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "docs/cloud-hard-acceptance-template.md",
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
  const scopeFiles = new Map();

  assert.match(activePlan, /^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9.-]*$/);
  for (const relative of actual.filter(item => item.startsWith(".planning/") && item !== ".planning/.active_plan")) {
    const match = relative.match(/^\.planning\/(\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9.-]*)\/(findings\.md|progress\.md|task_plan\.md)$/);
    assert.ok(match, `unexpected planning lifecycle path: ${relative}`);
    const [, scope, file] = match;
    if (!scopeFiles.has(scope)) scopeFiles.set(scope, []);
    scopeFiles.get(scope).push(file);
  }

  assert.equal(scopeFiles.has(activePlan), true, `active planning scope is not tracked: ${activePlan}`);
  for (const [scope, files] of scopeFiles) {
    assert.deepEqual(files.sort(), [...planningFiles].sort(), `incomplete planning scope: ${scope}`);
  }

  const activeTask = read(`.planning/${activePlan}/task_plan.md`);
  for (const heading of ["Authorization", "Next Step", "Stop Conditions"]) {
    assert.match(activeTask, new RegExp(`^## ${heading}$`, "m"), `active task plan lacks ${heading}`);
  }
});

test("documentation lifecycle paths stay portable and outside the Release artifact", () => {
  const actual = repositoryPaths();
  const artifact = JSON.parse(read("contracts/release-artifact-v1.json"));
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
  assert.match(acceptanceTemplate, /^<a name="version-acceptance-delta"><\/a>$/m);
  assert.match(acceptanceTemplate, /本模板[\s\S]*稳定执行协议[\s\S]*活动 Release task plan[\s\S]*Next Step[\s\S]*版本专项 acceptance[\s\S]*最终不可变结论/);
  assert.match(acceptanceTemplate, /通道尚未完成[\s\S]*进度只写活动 Release task plan[\s\S]*不在版本 acceptance 预建 PENDING/);
  assert.match(acceptanceTemplate, /development identity 收敛为 stable identity[\s\S]*重命名[\s\S]*不得让 dev\/stable 两份 acceptance 并存/);
  assert.match(acceptanceTemplate, /“本版本验收增量”（可选）[\s\S]*没有验收增量时[\s\S]*整个章节直接省略/);
  assert.match(acceptanceTemplate, /B～E 黑盒提示词是否变化[\s\S]*版本文件不得再次复制脚本、提示词或完整执行步骤/);
  assert.match(acceptanceTemplate, /Environment variables（“环境变量”）[\s\S]*PWF_ACCEPTANCE_NODE_MAJOR[\s\S]*不要只在 setup script 中/);
  assert.match(acceptanceTemplate, /### 4\.2 Published Release[\s\S]*__IMMUTABLE_BOOTSTRAP_URL__[\s\S]*__IMMUTABLE_BOOTSTRAP_SHA256__/);
  assert.match(acceptanceTemplate, /### 9\.2 Published Release[\s\S]*__IMMUTABLE_ZIP_URL__[\s\S]*__IMMUTABLE_ZIP_SHA256__/);
  assert.match(acceptanceTemplate, /PWF_CLOUD_ACCEPTANCE_CANONICAL_V1[\s\S]*PWF_CLOUD_ACCEPTANCE_REAL_RESUME_TAIL/);
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
  const index = read("docs/history/README.md");
  assert.match(index, /warm layer.*不是源码 archive.*当前\s+programme authority/s);
  assert.match(index, /只允许事实纠错或修复.*immutable link/s);
  assert.match(index, /不得进入 Release.*trusted graph.*runtime dispatch/s);

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

test("portable repository governance defines a closed retirement transaction", () => {
  const guide = read("docs/repository-governance-guide.md");

  assert.match(guide, /^<a name="retirement-definition-of-done"><\/a>$/m);
  assert.match(guide, /同一次 lifecycle rotation.*不要求.*同一个 commit.*实施 gate/s);
  assert.match(guide, /eviction.*关闭前不得开启下一开发列车/s);
  assert.match(guide, /candidate \+ accepted 角色窗口/);
  assert.match(guide, /accepted \+ immediate fallback 两个席位/);
  assert.match(guide, /长期安全不变量已经迁入当前版本或版本无关测试/);
  assert.match(guide, /unsealed transition.*旧版本 bootstrap checksum/s);
  assert.match(guide, /不是第四种长期 baseline/);
  assert.match(guide, /compatibility code.*支持来源窗口.*owner.*行为测试.*retirement condition/s);
  assert.match(guide, /machine contract.*Phase\/Round.*运行时、构建或验证语义/s);
  assert.match(guide, /稳定协议、活动施工状态和当前角色窗口内的版本证据三层/);
  assert.match(guide, /Cloud hard acceptance template.*版本中立黑盒提示词/s);
  assert.match(guide, /模板不得保存具体版本.*PASS\/PENDING.*不占用 candidate \+ accepted 文件窗口/s);
  assert.match(guide, /活动 Release task plan 保存.*Next Step.*PENDING.*失败记录/s);
  assert.match(guide, /版本专项 acceptance 只引用模板.*不得复制模板脚本或保存施工进度表/s);
  assert.match(guide, /模板和所有版本 acceptance.*Release.*trusted execution graph 排除/s);
});

test("retired prototype conclusions remain covered by production safety tests", () => {
  const planTests = read("tests/owned-plan-runtime.test.js");
  const activationTests = read("tests/activation.test.js");
  const catchupTests = read("tests/owned-runtime.test.js");
  for (const title of [
    "owned plan emits pristine managed-legacy context from a private snapshot",
    "owned plan rejects linked, non-regular, oversized, and invalid UTF-8 inputs",
    "owned plan safe reads detect replacement, truncation, append, and hard-link races",
    "owned plan kills the injector process group, bounds output, and cleans snapshots",
    "owned plan removes only bounded safe stale snapshots from its trusted base",
  ]) assert.match(planTests, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(activationTests, /Linux synthetic install-user\/Hook-user split executes both real owned runtimes/);
  assert.match(catchupTests, /owned runtime distinguishes planning\/update\/output-budget skip reasons/);
});

test("cold history stays on immutable refs and outside runtime, Release, and adapter dispatch", () => {
  const runtime = read("contracts/runtime-bundle-v1.json");
  const release = read("contracts/release-artifact-v1.json");
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
  assert.equal(artifact.entries.length, 21);
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), false);
  assert.equal(artifact.entries.some(item => item.path === "contracts/compatibility-overlays-v1.json"), false);
  assert.equal(artifact.entries.some(item => item.path.startsWith("docs/") || item.path.startsWith("tests/")), false);
  assert.deepEqual(artifact.external_release_assets.map(item => item.path), [`init-cloud-sandbox-${candidate}.bash`]);
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
  const artifact = JSON.parse(read("contracts/release-artifact-v1.json"));
  const runtimeBundle = JSON.parse(read("contracts/runtime-bundle-v1.json"));
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

  assert.match(roadmap, /活动.*task_plan.*当前唯一 Next Step/s);
  assert.match(roadmap, /一个 active planning.*candidate \+ accepted role window.*immediate fallback.*immutable/s);
  assert.match(roadmap, /accepted \+ immediate fallback.*publication\/rollback 资产席位/s);
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
  assert.match(provenance, /持续维护的\*\*冷证据账本\*\*/);
  assert.match(provenance, /索引可以在新证据闭合后新增或轮换精选入口/);
  assert.match(provenance, /已经登记的 tag、source、ZIP\/bootstrap 字节、SHA 和 acceptance identity 不得.*改写/s);
  assert.match(provenance, /架构共识.*ARCHITECTURE\.md.*machine contracts.*programme\/lifecycle 角色只见.*ROADMAP\.md/s);
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
  assert.match(agents, /当前版本角色只见 `ROADMAP\.md`/);
  assert.match(agents, /for bootstrap in init-cloud-sandbox-v\*\.bash; do/);
  assert.match(agents, /重要且可独立恢复的阶段.*自动创建本地[\s\S]*commit/);
  assert.match(agents, /所有远端写操作由维护者负责[\s\S]*push\/force-push[\s\S]*Pre-release\/Latest/);
  assert.match(agents, /远端只读查询[\s\S]*维护者完成[\s\S]*只读 postflight/);
  assert.match(agents, /减少[\s\S]*权限确认、网络重试和来回等待[\s\S]*不得因此跳过测试/);
  assert.match(design, /CHANGELOG\.md/);
  assert.match(changelog,
    /\[`BASELINE_PROVENANCE\.md` 的 Successor 迁移不可变证据\]\(BASELINE_PROVENANCE\.md#successor-migration-evidence\)/);
  assert.doesNotMatch(changelog, /docs\/history\//);
  assert.doesNotMatch(changelog, /Successor 迁移来源链/);

  assert.match(acceptance, new RegExp(`^# ${escapedCandidate} Cloud hard acceptance$`, "m"));
  const sourceCandidateComplete = candidate === accepted
    || roadmap.includes("zero-hash Source/Candidate Cloud 已 PASS");
  const publishedReleaseComplete = candidate === accepted
    || roadmap.includes("Published Release Cloud hard acceptance 已 PASS");
  if (sourceCandidateComplete) {
    assert.match(acceptance, /Source\/Candidate Cloud hard acceptance 已.*完成/s);
    assert.match(acceptance, /SOURCE_CANDIDATE_CLOUD_PASS \/ I3_COMPLETE/);
    assert.match(acceptance, /严格绑定.*zero-hash candidate/s);
  } else {
    assert.match(acceptance, /Source\/Candidate.*Cloud hard acceptance 尚未开始/s);
    assert.doesNotMatch(acceptance, /\b[a-f0-9]{64}\b/i);
  }
  assert.match(acceptance, /64 位 zero hash.*fail closed/s);
  assert.match(acceptance, /Cloud hard acceptance template/);
  assert.match(acceptance, /不授予 Product Phase 4/);
  assert.match(acceptance, /exact current id\/source inventory guard/);
  assert.match(acceptance, /本次验收增量没有改写 B～E 黑盒提示词/);
  assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-setup/);
  assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-deep-check/);
  assert.doesNotMatch(acceptance, /## 1\. 执行输入与边界|维护者执行顺序|回传证据|NOT EXECUTED|NOT AUTHORIZED|PENDING|Next Step|当前状态/);

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
      ...runtimeBundle.files.map(item => item.installed_path.slice(installedPrefix.length)),
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
    assert.match(acceptance, new RegExp(`${runtimeBundle.files.length} 个 upstream runtime 均保持 pristine`));
    for (const upstream of runtimeBundle.files) assert.match(acceptance, new RegExp(upstream.pristine_sha256));
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
