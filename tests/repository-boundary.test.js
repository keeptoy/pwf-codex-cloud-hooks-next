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

function trackedPaths() {
  const result = spawnSync("git", ["-c", "core.quotepath=false", "ls-files"], {
    cwd: root, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean)
    .map(value => value.replaceAll("\\", "/")).sort();
}

function isTrustedSource(relative) {
  return trustedRootPaths.has(relative) || trustedPrefixes.some(prefix => relative.startsWith(prefix));
}

function currentRoleWindow() {
  const roadmap = read("ROADMAP.md");
  const candidateMatch = roadmap.match(new RegExp("^\\| 当前开发列车 \\| `(" + versionPattern + ")`", "m"));
  const acceptedMatch = roadmap.match(new RegExp("^\\| 当前已接受版本 \\| `(" + versionPattern + ")`", "m"));
  assert.ok(candidateMatch, "ROADMAP lacks a parseable current candidate role");
  assert.ok(acceptedMatch, "ROADMAP lacks a parseable accepted baseline role");
  const candidate = candidateMatch[1];
  const accepted = acceptedMatch[1];
  const packageVersion = JSON.parse(read("package.json")).version;
  assert.equal(candidate, `v${packageVersion}`, "package identity must match the current candidate role");
  return { accepted, candidate, roadmap };
}

test("trusted source zones are exact while repository governance paths remain lifecycle-managed", () => {
  const actual = trackedPaths();
  const artifact = JSON.parse(read("contracts/release-artifact-v1.json"));
  const releasePaths = artifact.entries.map(item => item.path);
  const expectedTrusted = releasePaths.filter(isTrustedSource).sort();
  const actualTrusted = actual.filter(isTrustedSource).sort();

  assert.deepEqual(actualTrusted, expectedTrusted);
  for (const relative of [...releasePaths, ...artifact.external_release_assets.map(item => item.path)]) {
    assert.equal(actual.includes(relative), true, relative);
  }
  for (const required of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "docs/repository-governance-guide.md",
  ]) assert.equal(actual.includes(required), true, required);
  for (const prefix of [".planning/", "docs/", "tests/"]) {
    assert.equal(artifact.excluded_prefixes.includes(prefix), true, prefix);
    assert.equal(releasePaths.some(item => item.startsWith(prefix)), false, prefix);
  }
  for (const forbidden of [
    "PROJECT_UNDERSTANDING.md", "work_plan.md", "黑盒验证.md", "snapshot-prototype/",
    "tests/phase3-contracts.test.js", "tests/snapshot-prototype-handoff.test.js",
    "tests/fixtures/golden/adapter-output-v0.2.2.json",
    "tests/fixtures/golden/adapter-output-v0.3.0-beta.1.json",
    "tests/fixtures/cloud/session-catchup-v0.2.2.jsonl",
  ]) assert.equal(actual.some(item => item === forbidden || item.startsWith(forbidden)), false, forbidden);
});

test("planning lifecycle has one valid active pointer and complete scoped records", () => {
  const actual = trackedPaths();
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
  assert.deepEqual([...scopeFiles.keys()], [activePlan], "completed planning scopes must leave the current tree");
  for (const [scope, files] of scopeFiles) {
    assert.deepEqual(files.sort(), [...planningFiles].sort(), `incomplete planning scope: ${scope}`);
  }

  const activeTask = read(`.planning/${activePlan}/task_plan.md`);
  for (const heading of ["Authorization", "Next Step", "Stop Conditions"]) {
    assert.match(activeTask, new RegExp(`^## ${heading}$`, "m"), `active task plan lacks ${heading}`);
  }
});

test("documentation lifecycle paths stay portable and outside the Release artifact", () => {
  const actual = trackedPaths();
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
  const fixedBootstrapName = /init-cloud-sandbox-v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.bash/;
  for (const stableDoc of ["README.md", "AGENTS.md", "docs/repository-governance-guide.md"]) {
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
  assert.equal(artifact.entries.length, 23);
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), true);
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
  const { accepted, candidate, roadmap } = currentRoleWindow();
  const acceptancePath = `docs/${candidate}-cloud-hard-acceptance.md`;
  const acceptance = read(acceptancePath);
  const escapedCandidate = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const changelogVersions = [...changelog.matchAll(new RegExp(`^## (${versionPattern})$`, "gm"))]
    .map(match => match[1]);
  assert.equal(changelogVersions[0], candidate, "CHANGELOG must lead with the current package version");
  assert.equal(changelogVersions.includes(accepted), true, "CHANGELOG must retain the accepted baseline delta");
  for (const target of ["ROADMAP.md", "BASELINE_PROVENANCE.md", acceptancePath]) {
    assert.match(changelog, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(changelog, /\b[a-f0-9]{64}\b|Next Step|GitHub `Latest`|production rollback|\d+ registered/);
  assert.equal(artifact.entries.some(entry => entry.path === "CHANGELOG.md"), false);

  assert.match(roadmap, /活动.*task_plan.*当前唯一 Next Step/s);
  assert.match(roadmap, /一个 active planning.*candidate.*accepted role window.*immutable/s);
  assert.match(roadmap, new RegExp("## 3\\. 已完成的基线 `" + accepted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`"));
  assert.doesNotMatch(roadmap, /## 3\. 已完成的仓库迁移|M1 exact mirror|M2 slim transformation/);
  assert.equal((roadmap.match(/GitHub `Latest`/g) || []).length, 1);

  for (const roleVersion of new Set([candidate, accepted])) {
    assert.match(provenance, new RegExp(roleVersion.replaceAll(".", "\\.")));
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
  assert.match(design, /CHANGELOG\.md/);
  assert.match(changelog,
    /\[`BASELINE_PROVENANCE\.md` 的 Successor 迁移不可变证据\]\(BASELINE_PROVENANCE\.md#successor-migration-evidence\)/);
  assert.doesNotMatch(changelog, /docs\/history\//);
  assert.doesNotMatch(changelog, /Successor 迁移来源链/);

  assert.match(acceptance, new RegExp(`^# ${escapedCandidate} Cloud hard acceptance$`, "m"));
  assert.match(acceptance, /R5-SC.*Source\/Candidate.*HOOKS_URL.*HOOKS_SHA256/is);
  assert.match(acceptance, /R5-PR.*Published Release.*默认.*下载/is);
  assert.match(acceptance, /两条通道不得共用容器、安装状态或 B～F 结果/);
  assert.match(acceptance, /不授权.*Latest.*rollback/is);
  if (roadmap.includes("Cloud hard acceptance PASS")) {
    assert.match(acceptance, /CLOUD-HARD-ACCEPTANCE-PASS/);
    assert.doesNotMatch(acceptance, /PENDING_R5_SC|PENDING_R5_PR|PENDING_R5/);
  }

  const publishedFStart = acceptance.indexOf("### 10.2 R5-PR");
  const evidenceStart = acceptance.indexOf("## 11.", publishedFStart);
  assert.ok(publishedFStart >= 0 && evidenceStart > publishedFStart);
  const publishedF = acceptance.slice(publishedFStart, evidenceStart);
  assert.match(publishedF, new RegExp(`releases/download/${escapedCandidate}/pwf-codex-cloud-hooks-${escapedCandidate}\\.zip`));
  assert.match(publishedF, /tools\/build_release\.py.*check/is);
  assert.match(publishedF, /tools\/import_upstream_runtime\.py.*check/is);
  assert.match(publishedF, /node "\$PACKAGE_ROOT\/install\.js" doctor/);
  assert.match(publishedF, /SNAPSHOT_LEFTOVERS=0/);
  assert.doesNotMatch(publishedF, /git rev-parse|workspace.*install\.js/is);
});

test("stable architecture contracts do not freeze version history", () => {
  const architectureContracts = read("tests/architecture-contracts.test.js");

  assert.doesNotMatch(architectureContracts, /docs\/v\d+\.\d+\.\d+[^"']*cloud-hard-acceptance\.md/i);
  assert.doesNotMatch(architectureContracts, /\bv\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\b/);
  assert.doesNotMatch(architectureContracts, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(architectureContracts, /artifact\.entries\.length/);
});
