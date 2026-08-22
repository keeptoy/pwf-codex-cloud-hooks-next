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

test("v0.4.1 accepted patch train preserves the fallback identity window", () => {
  const { accepted, candidate, immediateFallback, roadmap } = currentRoleWindow();
  assert.equal(candidate, "v0.4.1");
  assert.equal(accepted, "v0.4.1");
  assert.equal(immediateFallback, "v0.4.0");
  assert.equal(candidate, accepted);
  assert.match(roadmap, /compatibility\/security patch train/);
  assert.match(roadmap, /本地[\s\S]*path-safety gate 与开发候选 exact source/);
  assert.match(roadmap, /P9-B Linux零skip、deterministic ZIP、Fresh\/UserPrompt\/real Resume/);
  assert.match(roadmap,
    /P9-B sealed-source Cloud、P9-C immutable publication、P9-D Published Release Cloud与P9-E Latest promotion均PASS/);
  assert.match(roadmap, /`v0\.4\.1` accepted\/Latest/);
  assert.match(roadmap, /P9-D Published Release Cloud PASS/);
  assert.match(roadmap, /P9-E pointer-only Latest promotion与只读postflight已PASS/);
  assert.match(roadmap, /P9-F retirement仍未授权/);
  assert.match(roadmap, /^<a name="v0-4-1-path-safety-train"><\/a>$/m);
  assert.match(roadmap, /## 3\. 已接受基线 `v0\.4\.1`/);
  assert.match(roadmap,
    /Phase 4 \/ F3C4完成[\s\S]*形成0\.4\.0功能\/候选基线[\s\S]*后继版本列车与Product Phase另行决策/);
});

test("v0.4.0 Phase 9 keeps P9-D evidence distinct from later promotion", () => {
  const phase9 = read("docs/history/phase-9-v0.4.0-release-discovery.md");
  const phase4Closeout = read("docs/history/phase-4.11-f3c4-aggregate-closure-discovery.md");
  const historyIndex = read("docs/history/README.md");
  const acceptance = read("docs/v0.4.0-cloud-hard-acceptance.md");
  const { roadmap } = currentRoleWindow();

  for (const anchor of [
    "phase-9-v0-4-0-positioning", "phase-9-v0-4-0-pre-seal-inventory", "phase-9-v0-4-0-gates",
    "phase-9-v0-4-0-evidence-routing", "phase-9-v0-4-0-lifecycle-ledger",
    "phase-9-v0-4-0-stop-rules", "phase-9-v0-4-0-decision", "phase-9-v0-4-0-verification",
    "phase-9-v0-4-0-successor",
  ]) assert.match(phase9, new RegExp(`<a name="${anchor}"></a>`));

  assert.match(phase9,
    /CONDITIONAL_GO_TO_V0_4_0_PHASE_9_PRE_SEAL_MATERIALIZATION \/ IMPLEMENTATION_NOT_AUTHORIZED \/ RELEASE_AND_REF_MUTATION_NOT_AUTHORIZED/);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-a-post-implementation"><\/a>$/m);
  assert.match(phase9,
    /P9_A_PRE_SEAL_MATERIALIZATION_PASS \/ ZERO_HASH_CANDIDATE_FROZEN \/ STOP_BEFORE_P9_B/);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-b-local-seal"><\/a>$/m);
  assert.match(phase9,
    /P9_B_LOCAL_SEAL_PASS \/ SEALED_SOURCE_CLOUD_PENDING \/ STOP_BEFORE_P9_C/);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-b-sealed-source-cloud"><\/a>$/m);
  assert.match(phase9,
    /P9_B_SEALED_SOURCE_CLOUD_PASS \/ STOP_BEFORE_P9_C \/ PUBLICATION_NOT_AUTHORIZED/);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-c-pre-publication"><\/a>$/m);
  assert.match(phase9,
    /P9_C_OPERATOR_READY \/ TAG_SOURCE_FROZEN \/ MAINTAINER_PUBLICATION_PENDING \/ STOP_BEFORE_P9_D/);
  assert.match(phase9, /24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3/);
  assert.match(phase9, /4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f/);
  assert.match(phase9, /v2 accepted \+ v1 fallback/);
  assert.match(phase9, /11 个 F3 validation refs[\s\S]*`KEEP`/);
  assert.match(phase9, /P9-A pre-seal materialization[\s\S]*P9-F second retirement and handoff/);
  assert.match(phase4Closeout,
    /phase-9-v0\.4\.0-release-discovery\.md#phase-9-v0-4-0-positioning/);
  assert.match(historyIndex,
    /phase-9-v0\.4\.0-release-discovery\.md#phase-9-v0-4-0-decision/);
  assert.match(acceptance,
    /v0\.4\.0 Phase 9 P9-A pre-seal materialization[^\n]*`PASS`/);
  assert.match(acceptance,
    /v0\.4\.0 Phase 9 P9-B sealed-source Cloud[^\n]*`PASS`/);
  assert.match(acceptance,
    /v0\.4\.0 Phase 9 P9-C immutable publication[^\n]*`PASS`/);
  assert.match(acceptance,
    /v0\.4\.0 Phase 9 P9-D Published Release Cloud[^\n]*`PASS`/);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-d-pre-acceptance"><\/a>$/m);
  assert.match(phase9,
    /P9_D_OPERATOR_READY \/ MAINTAINER_FRESH_CLOUD_PENDING \/ STOP_BEFORE_P9_E/);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-d-operator-materialization"><\/a>$/m);
  assert.match(phase9,
    /P9_D_OPERATOR_MATERIALIZED \/ LOCAL_GUARDS_PASS \/ MAINTAINER_FRESH_CLOUD_PENDING \/ STOP_BEFORE_P9_E/);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-d-post-acceptance"><\/a>$/m);
  assert.match(phase9,
    /P9_D_PUBLISHED_RELEASE_CLOUD_PASS \/ PUBLIC_DEFAULT_DOWNLOAD_CHAIN_CONFIRMED \/ STOP_BEFORE_P9_E/);
  assert.match(roadmap, /^<a name="phase-9-v0-4-0-instance"><\/a>$/m);
  assert.match(roadmap, /P9-A pre-seal materialization[\s\S]*P9-F second retirement review/);
});

test("P9-C operator freezes the Cloud-tested tag source and audits immutable public bytes", () => {
  const acceptance = read("docs/v0.4.0-cloud-hard-acceptance.md");
  const phase9 = read("docs/history/phase-9-v0.4.0-release-discovery.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const { roadmap } = currentRoleWindow();
  const tagSource = "fe8cd7f284ea2849f634aa68813dbb0f2cca83f9";
  const evidenceHead = "01fecef569b00e389a3b80ccdceeabd445ff993c";
  const zipSha = "24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3";
  const bootstrapSha = "4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f";

  assert.match(acceptance, /^<a name="v0-4-0-p9-c-immutable-publication-operator"><\/a>$/m);
  assert.match(acceptance, /^<a name="v0-4-0-p9-c-immutable-publication-evidence"><\/a>$/m);
  const start = acceptance.indexOf('<a name="v0-4-0-p9-c-immutable-publication-operator"></a>');
  const end = acceptance.indexOf('<a name="v0-4-0-dev-f3c4-aggregate-closure"></a>');
  assert.ok(start > 0 && end > start);
  const operator = acceptance.slice(start, end);

  for (const fact of [
    tagSource, evidenceHead, zipSha, bootstrapSha,
    "pwf-codex-cloud-hooks-v0.4.0.zip", "init-cloud-sandbox-v0.4.0.bash",
    "22 entries", "85,519 bytes", "21,565 bytes",
    "git tag v0.4.0", "git push origin refs/tags/v0.4.0",
    "gh release create v0.4.0", "--verify-tag", "--prerelease",
    "gh release download $tag", "P9_C_PUBLICATION_AUDIT=PASS",
  ]) assert.match(operator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(operator,
    /tag source[^\n]*fe8cd7f284ea2849f634aa68813dbb0f2cca83f9[\s\S]*01fecef569b00e389a3b80ccdceeabd445ff993c[^\n]*Release-excluded/);
  assert.match(operator, /Pre-release[\s\S]*不得[^\n]*(?:Latest|promotion)/);
  assert.match(operator, /若 tag push 已成功[\s\S]*不得删除、移动或重建 tag/);
  assert.match(phase9,
    /tag source[^]*P9-B实际通过 Cloud[^]*`fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`/);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-c-post-publication"><\/a>$/m);
  assert.match(phase9,
    /P9_C_IMMUTABLE_PUBLICATION_PASS \/ PUBLIC_ASSETS_REBUILT_AND_MATCHED \/ STOP_BEFORE_P9_D/);
  assert.match(roadmap, /P9-A～P9-F已关闭/);
  assert.match(roadmap, /P9-F second retirement review/);
  assert.match(roadmap, /tag source[^]*fe8cd7f284ea2849f634aa68813dbb0f2cca83f9/);
  assert.match(provenance,
    /`v0\.4\.0`[^\n]*fe8cd7f284ea2849f634aa68813dbb0f2cca83f9[^\n]*v0-4-0-p9-f-second-retirement-closeout/);
  for (const fact of [zipSha, bootstrapSha, "85,519 bytes", "21,565 bytes"]) {
    assert.match(provenance, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("P9-D operator binds public assets to the shared Published Release protocol", () => {
  const acceptance = read("docs/v0.4.0-cloud-hard-acceptance.md");
  const template = read("docs/cloud-hard-acceptance-template.md");
  const phase9 = read("docs/history/phase-9-v0.4.0-release-discovery.md");
  const { roadmap } = currentRoleWindow();
  const operatorAnchor = '<a name="v0-4-0-p9-d-published-release-cloud-operator"></a>';
  const operatorStart = acceptance.indexOf(operatorAnchor);
  const operatorEnd = acceptance.indexOf('<a name="v0-4-0-dev-f3c4-aggregate-closure"></a>');

  assert.ok(operatorStart > 0 && operatorEnd > operatorStart);
  const operator = acceptance.slice(operatorStart, operatorEnd);
  for (const anchor of [
    "published-release-setup",
    "blackbox-fresh-startup",
    "blackbox-canonical-baseline",
    "blackbox-canonical-context",
    "blackbox-real-resume",
    "published-release-deep-check",
  ]) {
    assert.match(template, new RegExp(`<a name="${anchor}"></a>`));
    assert.match(operator, new RegExp(`cloud-hard-acceptance-template\\.md#${anchor}`));
  }

  for (const fact of [
    "__PWF_P9D_OPERATOR_HEAD__",
    "fe8cd7f284ea2849f634aa68813dbb0f2cca83f9",
    "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.4.0/init-cloud-sandbox-v0.4.0.bash",
    "4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f",
    "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.4.0/pwf-codex-cloud-hooks-v0.4.0.zip",
    "24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3",
    "PWF_PUBLIC_RELEASE_SETUP=PASS",
    "PUBLIC_PACKAGE_IDENTITY=0.4.0",
    "POST_RESUME_DOCTOR=PASS",
    "BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE",
    "MANAGED_POLICY=ADAPTER_ONLY",
    "PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS",
    "PWF_PUBLIC_POST_RESUME=PASS",
  ]) assert.match(operator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(operator, /4\.2[\s\S]*5\.2[\s\S]*第6节[\s\S]*第7节[\s\S]*8\.1[\s\S]*8\.2[\s\S]*9\.2/);
  assert.match(operator, /不得设置`HOOKS_URL`、`HOOKS_SHA256`或任何ZIP override/);
  assert.match(operator, /必须停止在P9-E前/);
  assert.doesNotMatch(operator, /set -Eeuo pipefail|readonly BOOTSTRAP_URL=|readonly ZIP_URL=/,
    "version operator must not copy the shared setup or deep-check Bash authority");
  assert.match(phase9,
    /P9_D_OPERATOR_READY \/ MAINTAINER_FRESH_CLOUD_PENDING \/ STOP_BEFORE_P9_E/);
  assert.match(roadmap, /P9-D Published Release Cloud PASS/);

  const evidenceAnchor = '<a name="v0-4-0-p9-d-published-release-cloud-evidence"></a>';
  const evidenceStart = acceptance.indexOf(evidenceAnchor);
  assert.ok(evidenceStart > operatorStart && evidenceStart < operatorEnd);
  const evidence = acceptance.slice(evidenceStart, operatorEnd);
  for (const fact of [
    "9d4a914b8b241fa92345702bff74846024eba5b6",
    "2026-08-22-pwf-cloud-acceptance-v1-a3f09c7e",
    "PWF_PUBLIC_BOOTSTRAP_SHA256=4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f",
    "PWF_PUBLIC_RELEASE_SETUP=PASS",
    "SessionStart source=startup",
    "SessionStart source=resume",
    "PUBLIC_PACKAGE_IDENTITY=0.4.0",
    "R5-PR=PASS",
    "CLOUD-HARD-ACCEPTANCE-PASS",
  ]) assert.match(evidence, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(evidence, /最终exit code为0/);
  assert.match(evidence, /\.planning\/\.active_plan[\s\S]*canonical fixture目录/);
  assert.match(phase9,
    /P9_D_PUBLISHED_RELEASE_CLOUD_PASS \/ PUBLIC_DEFAULT_DOWNLOAD_CHAIN_CONFIRMED \/ STOP_BEFORE_P9_E/);
});

test("P9-E evidence closes pointer promotion before P9-F retirement", () => {
  const acceptance = read("docs/v0.4.0-cloud-hard-acceptance.md");
  const phase9 = read("docs/history/phase-9-v0.4.0-release-discovery.md");
  const taskPlan = read(".planning/2026-08-19-v0.4.0-phase-9-release-discovery/task_plan.md");
  const { roadmap } = currentRoleWindow();
  const anchor = '<a name="v0-4-0-p9-e-latest-promotion-operator"></a>';
  const start = acceptance.indexOf(anchor);
  const end = acceptance.indexOf('<a name="v0-4-0-dev-f3c4-aggregate-closure"></a>');

  assert.ok(start > 0 && end > start, "P9-E operator must precede frozen F3 evidence");
  const operator = acceptance.slice(start, end);
  for (const fact of [
    "fe8cd7f284ea2849f634aa68813dbb0f2cca83f9",
    "24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3",
    "4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f",
    "5d01b55890c1da2a5088e2b991b152a9fb1c3f87",
    "7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b",
    "33d7fcaca56c617ef70e33c9708af804a8737d587cc58571382b945e5bff58a5",
    "gh release edit v0.4.0 --repo keeptoy/pwf-codex-cloud-hooks-next --prerelease=false --latest",
    "PWF_P9E_PREVIOUS_LATEST",
    "PWF_P9E_POINTER_PROMOTION=PASS",
    "PWF_P9E_POSTFLIGHT=PASS",
  ]) assert.match(operator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(operator, /v0\.3\.5-dev[\s\S]*control-plane drift/);
  assert.match(operator, /v0\.3\.5[\s\S]*immediate fallback/);
  assert.match(operator, /停止在P9-F前/);
  assert.doesNotMatch(operator,
    /gh release (?:create|delete|upload)|git (?:tag|push)|remove-item|rm\s/,
    "promotion operator must not recreate assets, mutate refs or perform cleanup");
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-e-pre-promotion"><\/a>$/m);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-e-post-promotion"><\/a>$/m);
  assert.match(phase9,
    /P9_E_POINTER_PROMOTION_PASS \/ V0_4_0_ACCEPTED_LATEST \/ V0_3_5_IMMEDIATE_FALLBACK/);
  assert.match(roadmap, /pointer-only promotion与第二轮对象退役均已收敛/);
  assert.match(taskPlan,
    /P9_F_SECOND_RETIREMENT_PASS \/ V0_4_0_TRAIN_CLOSED \/ NEXT_TRAIN_UNDECIDED/);
});

test("P9-F retires only obsolete working-tree role files and keeps durable rollback evidence", () => {
  const acceptance = read("docs/v0.4.0-cloud-hard-acceptance.md");
  const phase9 = read("docs/history/phase-9-v0.4.0-release-discovery.md");
  const provenance = read("BASELINE_PROVENANCE.md");

  assert.equal(fs.existsSync(path.join(root, "init-cloud-sandbox-v0.3.5.bash")), false);
  assert.equal(fs.existsSync(path.join(root, "docs/v0.3.5-cloud-hard-acceptance.md")), false);
  assert.match(provenance,
    /blob\/5d01b55890c1da2a5088e2b991b152a9fb1c3f87\/docs\/v0\.3\.5-cloud-hard-acceptance\.md/);
  assert.match(acceptance, /^<a name="v0-4-0-p9-f-second-retirement-closeout"><\/a>$/m);
  assert.match(phase9, /^<a name="phase-9-v0-4-0-p9-f-post-implementation"><\/a>$/m);
  assert.match(phase9,
    /P9_F_SECOND_RETIREMENT_PASS \/ V0_4_0_TRAIN_CLOSED \/ NEXT_TRAIN_UNDECIDED/);
  for (const retained of [
    "contracts/installed-state-transition-v1.json",
    "docs/v0.4.0-dev-f3b2-smart-live-operator-guide.md",
    "docs/v0.4.0-dev-f3b3-autonomous-live-operator-guide.md",
    "docs/v0.4.0-dev-f3c-rollback-operator-guide.md",
    "tests/f3-lifecycle-helpers.js",
    "tests/owned-plan-runtime.test.js",
  ]) assert.equal(fs.existsSync(path.join(root, retained)), true, retained);
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
  const { accepted, candidate, immediateFallback } = currentRoleWindow();
  const roleVersions = [...new Set([
    accepted, candidate, ...(candidate === accepted ? [immediateFallback] : []),
  ])].sort();
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
    /上一步 B 中“不要调用工具、运行 Shell、读取文件”的限制只适用于 B 的那一次黑盒观察回复，现在已经结束/);
  assert.match(acceptanceTemplate,
    /只允许使用只读文件工具检查 `[.]planning\/[.]active_plan`[\s\S]*只允许使用 apply_patch/);
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
  assert.doesNotMatch(read("README.md"), /尚需 F3 live gate|不得描述成 Cloud lifecycle PASS/);
  assert.match(read("README.md"), /版本专项 acceptance/);
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
  const phase9History = read("docs/history/phase-9-v0.4.0-release-discovery.md");
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
  const currentDeltaStart = changelog.indexOf(`## ${candidate}`);
  const nextDeltaStart = changelog.indexOf("\n## ", currentDeltaStart + 1);
  const currentDelta = changelog.slice(currentDeltaStart,
    nextDeltaStart === -1 ? changelog.length : nextDeltaStart);
  if (candidate === "v0.4.0") {
    for (const durableReleaseFact of [
      /manifest schema 4/,
      /runtime bundle[^\n]*Release artifact[^\n]*v2/,
      /smart activation/,
      /autonomous/,
      /attestation/,
      /nonce/,
      /ledger/,
      /Fresh\/Resume/,
      /tamper refusal/,
      /disarm-first rollback\/recovery/,
      /deterministic ZIP|确定性 ZIP/,
      /Published Release Cloud/,
    ]) assert.match(currentDelta, durableReleaseFact);
    assert.doesNotMatch(currentDelta, /P9-[A-F]|仍须后继 gate|真实 Cloud[^\n]*仍须|zero-hash pre-seal/,
      "released version delta must not retain pre-release gate state or Phase 9 execution chronology");
  } else if (candidate === "v0.4.1") {
    assert.match(currentDelta, /path topology/);
    assert.match(currentDelta, /unknown普通文件和目录仍会先完整备份再清理/);
    assert.match(currentDelta, /exact SHA并fail closed/);
    assert.match(currentDelta, /immutable publication[\s\S]*Published Release Cloud[\s\S]*pointer-only promotion/);
    assert.doesNotMatch(currentDelta, /\b[a-f0-9]{64}\b|P9-[A-F]|仍须后继 gate|未完成gate|zero hash/);
  }
  assert.equal(artifact.entries.some(entry => entry.path === "CHANGELOG.md"), false);

  assert.match(roadmap, new RegExp("## 3\\. 已接受基线 `" + accepted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`"));
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
  if (candidate === "v0.4.1") {
    assert.match(acceptance, /^<a name="v0-4-1-gate-status"><\/a>$/m);
    assert.match(acceptance, /Windows path-topology local implementation[^\n]*`PASS`/);
    assert.match(acceptance,
      /Source\/Candidate Linux\/POSIX \+ Cloud[^\n]*`PASS`/);
    assert.match(acceptance, /P9-B local seal[^\n]*`PASS`/);
    assert.match(acceptance, /P9-B sealed-source Cloud[^\n]*`PASS`/);
    assert.match(acceptance, /P9-C immutable publication[^\n]*`PASS`/);
    assert.match(acceptance, /P9-D Published Release Cloud[^\n]*`PASS`/);
    assert.match(acceptance, /P9-E \/ Latest[^\n]*`PASS`/);
    assert.match(acceptance, /P9-F retirement[^\n]*`NOT_AUTHORIZED`/);
    assert.match(acceptance,
      /V0_4_1_SOURCE_CANDIDATE_CLOUD_PASS \/ STOP_BEFORE_SEAL \/ RELEASE_NOT_AUTHORIZED/);
    assert.match(acceptance,
      /V0_4_1_P9_A_PRE_SEAL_MATERIALIZATION_PASS \/ ZERO_HASH_CANDIDATE_FROZEN \/ STOP_BEFORE_P9_B \/ RELEASE_NOT_AUTHORIZED/);
    assert.match(acceptance,
      /P9_B_SEALED_SOURCE_CLOUD_PASS \/ STOP_BEFORE_P9_C \/ PUBLICATION_NOT_AUTHORIZED/);
    assert.match(acceptance, /^<a name="v0-4-1-p9-b-local-seal-evidence"><\/a>$/m);
    assert.match(acceptance, /^<a name="v0-4-1-p9-b-sealed-source-cloud-operator"><\/a>$/m);
    assert.match(acceptance, /^<a name="v0-4-1-p9-b-sealed-source-cloud-evidence"><\/a>$/m);
    const p9bEvidenceAt = acceptance.indexOf('<a name="v0-4-1-p9-b-sealed-source-cloud-evidence"></a>');
    const historicalDevAt = acceptance.indexOf('<a name="v0-4-1-dev-plain-language-workflow"></a>');
    assert.ok(p9bEvidenceAt > 0 && historicalDevAt > p9bEvidenceAt);
    const p9bEvidence = acceptance.slice(p9bEvidenceAt, historicalDevAt);
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "175 tests，175 pass，0 fail，0 skipped",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "PWF_SOURCE_CANDIDATE_SETUP=PASS", "PWF_WORKTREE_CHANGES=PLANNING_ONLY",
      "POST_RESUME_DOCTOR=PASS", "INSTALLER_VERSION=0.4.1",
      "RELEASE_ARTIFACT_ENTRIES=22", "INSTALLED_RUNTIME_FILES=12",
      "UPSTREAM_PRISTINE_FILES=4", "BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE",
      "MANAGED_POLICY=ADAPTER_ONLY", "SNAPSHOT_LEFTOVERS=0", "PWF_SC_POST_RESUME=PASS",
    ]) assert.match(p9bEvidence, new RegExp(fact.replaceAll(".", "\\.")));
    assert.match(acceptance, /^<a name="v0-4-1-p9-c-immutable-publication-operator"><\/a>$/m);
    const p9cAt = acceptance.indexOf('<a name="v0-4-1-p9-c-immutable-publication-operator"></a>');
    assert.ok(p9cAt > p9bEvidenceAt && historicalDevAt > p9cAt);
    const p9cOperator = acceptance.slice(p9cAt, historicalDevAt);
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "5560175aac3a3a3505f56de1df22e9b81112c4b9",
      "pwf-codex-cloud-hooks-v0.4.1.zip", "init-cloud-sandbox-v0.4.1.bash",
      "22 entries", "85,910 bytes", "21,565 bytes",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
      "PWF_P9C_REMOTE_ABSENCE_PREFLIGHT=PASS", "git tag v0.4.1",
      "git push origin refs/tags/v0.4.1", "gh release create v0.4.1",
      "--verify-tag", "--prerelease", "gh release download $tag",
      "P9_C_PUBLICATION_AUDIT=PASS",
      "P9_C_OPERATOR_READY / TAG_SOURCE_FROZEN / MAINTAINER_PUBLICATION_PENDING / STOP_BEFORE_P9_D",
    ]) assert.match(p9cOperator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(p9cOperator,
      /tag source[^\n]*99885b854bd9621c3340e99f031bf83ceb58414d[\s\S]*5560175aac3a3a3505f56de1df22e9b81112c4b9[^\n]*Release-excluded/);
    assert.match(p9cOperator, /Pre-release[\s\S]*不得[^\n]*(?:Latest|轮转)/);
    assert.match(p9cOperator, /若tag push已成功[\s\S]*不得删除、移动或重建tag/);
    assert.match(acceptance, /^<a name="v0-4-1-p9-c-immutable-publication-evidence"><\/a>$/m);
    const p9cEvidenceAt = acceptance.indexOf('<a name="v0-4-1-p9-c-immutable-publication-evidence"></a>');
    assert.ok(p9cEvidenceAt > p9cAt && historicalDevAt > p9cEvidenceAt);
    const p9cEvidence = acceptance.slice(p9cEvidenceAt, historicalDevAt);
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.4.1",
      "pwf-codex-cloud-hooks-v0.4.1.zip", "init-cloud-sandbox-v0.4.1.bash",
      "22 entries", "85,910 bytes", "21,565 bytes",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
      "isDraft=false", "isPrerelease=true", "P9_C_PUBLICATION_AUDIT=PASS",
      "P9_C_IMMUTABLE_PUBLICATION_PASS / PUBLIC_ASSETS_REBUILT_AND_MATCHED / STOP_BEFORE_P9_D",
    ]) assert.match(p9cEvidence, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(acceptance, /^<a name="v0-4-1-p9-d-published-release-cloud-operator"><\/a>$/m);
    const p9dAt = acceptance.indexOf('<a name="v0-4-1-p9-d-published-release-cloud-operator"></a>');
    assert.match(acceptance, /^<a name="v0-4-1-p9-d-published-release-cloud-evidence"><\/a>$/m);
    const p9dEvidenceAt = acceptance.indexOf('<a name="v0-4-1-p9-d-published-release-cloud-evidence"></a>');
    assert.ok(p9dAt > p9cEvidenceAt && p9dEvidenceAt > p9dAt && historicalDevAt > p9dEvidenceAt);
    const p9dOperator = acceptance.slice(p9dAt, p9dEvidenceAt);
    for (const anchor of [
      "published-release-setup", "blackbox-fresh-startup", "blackbox-canonical-baseline",
      "blackbox-canonical-context", "blackbox-real-resume", "published-release-deep-check",
    ]) assert.match(p9dOperator, new RegExp(`cloud-hard-acceptance-template\\.md#${anchor}`));
    for (const fact of [
      "__PWF_P9D_OPERATOR_HEAD__", "99885b854bd9621c3340e99f031bf83ceb58414d",
      "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.4.1/init-cloud-sandbox-v0.4.1.bash",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
      "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.4.1/pwf-codex-cloud-hooks-v0.4.1.zip",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "PWF_P9D_PUBLIC_IDENTITY_PREFLIGHT=PASS", "PWF_PUBLIC_RELEASE_SETUP=PASS",
      "PUBLIC_PACKAGE_IDENTITY=0.4.1", "POST_RESUME_DOCTOR=PASS",
      "BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE", "MANAGED_POLICY=ADAPTER_ONLY",
      "PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS", "PWF_PUBLIC_POST_RESUME=PASS",
      "P9_D_OPERATOR_READY / MAINTAINER_FRESH_CLOUD_PENDING / STOP_BEFORE_P9_E",
    ]) assert.match(p9dOperator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(p9dOperator, /4\.2[\s\S]*5\.2[\s\S]*第6节[\s\S]*第7节[\s\S]*8\.1[\s\S]*8\.2[\s\S]*9\.2/);
    assert.match(p9dOperator, /不得设置`HOOKS_URL`、`HOOKS_SHA256`或任何ZIP override/);
    assert.match(p9dOperator, /必须停止在P9-E前/);
    assert.doesNotMatch(p9dOperator, /set -Eeuo pipefail|readonly BOOTSTRAP_URL=|readonly ZIP_URL=/,
      "version operator must not copy the shared Published Release Bash authority");
    assert.match(acceptance, /^<a name="v0-4-1-p9-e-latest-promotion-operator"><\/a>$/m);
    assert.match(acceptance, /^<a name="v0-4-1-p9-e-latest-promotion-evidence"><\/a>$/m);
    const p9eAt = acceptance.indexOf('<a name="v0-4-1-p9-e-latest-promotion-operator"></a>');
    const p9eEvidenceAt = acceptance.indexOf('<a name="v0-4-1-p9-e-latest-promotion-evidence"></a>');
    assert.ok(p9eAt > p9dEvidenceAt && p9eEvidenceAt > p9eAt && historicalDevAt > p9eEvidenceAt);
    const p9dEvidence = acceptance.slice(p9dEvidenceAt, p9eAt);
    for (const fact of [
      "b11464b85df8ff4ed90c34492286a0b1b64f32ca",
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "PWF_PUBLIC_RELEASE_SETUP=PASS", "PUBLIC_PACKAGE_IDENTITY=0.4.1",
      '"healthy":true', '"repairable":false', '"managed":true',
      '"events":["SessionStart","UserPromptSubmit"]', '"errors":[]', '"blockers":[]',
      '"entries": 22', '"sha256": "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291"',
      '"size": 85910', "POST_RESUME_DOCTOR=PASS", "PWF_DEEP_CHECK_MANIFEST_SCHEMA=4",
      "PWF_DEEP_CHECK_RELEASE_SCHEMA=2", "PWF_DEEP_CHECK_BUNDLE_SCHEMA=2",
      "RELEASE_ARTIFACT_ENTRIES=22", "INSTALLED_RUNTIME_FILES=12", "UPSTREAM_PRISTINE_FILES=4",
      "BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE", "MANAGED_POLICY=ADAPTER_ONLY",
      "PWF_PUBLIC_ZIP_REDOWNLOAD_SHA256=94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS", "SNAPSHOT_LEFTOVERS=0", "PWF_PUBLIC_POST_RESUME=PASS",
      "P9_D_PUBLISHED_RELEASE_CLOUD_PASS / PUBLIC_DEFAULT_DOWNLOAD_CHAIN_CONFIRMED / STOP_BEFORE_P9_E",
    ]) assert.match(p9dEvidence, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    const p9eOperator = acceptance.slice(p9eAt, p9eEvidenceAt);
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
      "fe8cd7f284ea2849f634aa68813dbb0f2cca83f9",
      "24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3",
      "4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f",
      "git push origin 0.4.1",
      "gh release edit v0.4.1 --repo keeptoy/pwf-codex-cloud-hooks-next --prerelease=false --latest",
      "PWF_P9E_OPERATOR_HEAD", "PWF_P9E_PREVIOUS_LATEST=v0.4.0", "PWF_P9E_PREFLIGHT=PASS",
      "PWF_P9E_POINTER_PROMOTION=PASS", "PWF_P9E_LATEST=v0.4.1", "PWF_P9E_ACCEPTED=v0.4.1",
      "PWF_P9E_IMMEDIATE_FALLBACK=v0.4.0", "PWF_P9E_DEEPER_FALLBACK=v0.3.5",
      "PWF_P9E_POSTFLIGHT=PASS",
      "P9_E_OPERATOR_READY / MAINTAINER_POINTER_PROMOTION_PENDING / STOP_BEFORE_P9_F",
    ]) assert.match(p9eOperator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(p9eOperator, /current Latest[^\n]*`v0\.4\.0`/);
    assert.match(p9eOperator, /停止在P9-F前/);
    assert.equal((p9eOperator.match(/^gh release edit v0\.4\.1 .*--prerelease=false --latest$/gm) || []).length, 1);
    assert.doesNotMatch(p9eOperator,
      /gh release (?:create|delete|upload)|git tag|refs\/tags\/v0\.4\.1|--notes|--title|--target/,
      "P9-E operator must not recreate assets, mutate refs, or widen the pointer-only write");
    const p9eEvidence = acceptance.slice(p9eEvidenceAt, historicalDevAt);
    for (const fact of [
      "PWF_P9E_POINTER_PROMOTION=PASS", "PWF_P9E_LATEST=v0.4.1", "PWF_P9E_ACCEPTED=v0.4.1",
      "PWF_P9E_IMMEDIATE_FALLBACK=v0.4.0", "PWF_P9E_DEEPER_FALLBACK=v0.3.5",
      "PWF_P9E_POSTFLIGHT=PASS", "isLatest=true", "isPrerelease=false", "isDraft=false",
      "P9_E_POINTER_PROMOTION_PASS / V0_4_1_ACCEPTED_LATEST / V0_4_0_IMMEDIATE_FALLBACK / STOP_BEFORE_P9_F",
    ]) assert.match(p9eEvidence, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    const v041Provenance = provenance.split(/\r?\n/)
      .find(line => line.startsWith("| `v0.4.1` |")) || "";
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d", "22 entries", "85,910 bytes", "21,565 bytes",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
    ]) assert.match(v041Provenance, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(acceptance, /__PWF_P9B_EXPECTED_HEAD__/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-setup/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-deep-check/);
    assert.match(acceptance, /默认情况下，智能体不代替维护者 push/);
    assert.match(acceptance, /维护者回传时请保留/);
    assert.match(acceptance, /明确结束 B 的单次无工具\/不读文件观察限制/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#cloud-task-acceptance-permission-prefix/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-setup/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-deep-check/);
    assert.match(acceptance, /^<a name="v0-4-1-dev-source-candidate-evidence"><\/a>$/m);
    assert.match(acceptance, /6c1dd52a3878f59c7140a793b9a2c2a34580b188/);
    assert.match(acceptance, /175 tests \/ 175 pass \/ 0 fail \/ 0 skipped/);
    assert.match(acceptance, /543a72a57fdd7ca04854d5d1dfde6f838bf40e3afa5eb2c52c2d559b3843854a/);
    assert.match(acceptance, /PWF_SOURCE_CANDIDATE_SETUP=PASS/);
    assert.match(acceptance, /PWF_SC_POST_RESUME=PASS/);
    assert.match(acceptance, /首次拒绝作为诊断时间线保留/);
    assert.match(acceptance, /0d470920f42651983062945a129e38838c46f4d7/);
    assert.doesNotMatch(acceptance, /R5-PR=PASS|CLOUD-HARD-ACCEPTANCE-PASS/i);
    assert.match(acceptance,
      /https:\/\/github\.com\/keeptoy\/pwf-codex-cloud-hooks-next\/releases\/download\/v0\.4\.1\//);
    return;
  }
  assert.match(acceptance, /^<a name="v0-4-0-gate-status"><\/a>$/m);
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
  assert.match(acceptance,
    /F3C rollback Discovery[^\n]*`CONDITIONAL_GO_TO_F3C1_ROLLBACK_PROTOCOL_MATERIALIZATION`/);
  assert.match(acceptance,
    /F3C1 rollback protocol \/ Linux no-live[^\n]*`PASS`/);
  assert.match(acceptance,
    /F3C2 smart live rollback\/recovery[^\n]*`PASS`/);
  assert.match(acceptance,
    /F3C3 autonomous live rollback\/recovery[^\n]*`PASS`/);
  assert.match(acceptance,
    /F3C4 aggregate-closure Discovery[^\n]*`CONDITIONAL_GO_TO_F3C4_AGGREGATE_CLOSURE`/);
  assert.match(acceptance, /F3C4 aggregate closure[^\n]*`PASS`/);
  assert.match(acceptance, /v0\.4\.0 Phase 9 P9-B sealed-source Cloud[^\n]*`PASS`/);
  assert.match(acceptance,
    /phase-4\.11-f3c4-aggregate-closure-discovery\.md#phase-4-11-decision/);
  assert.match(acceptance,
    /phase-4\.11-f3c4-aggregate-closure-discovery\.md#phase-4-11-post-implementation-status-f3c4/);
  assert.match(acceptance,
    /phase-4\.10-f3c-rollback-discovery\.md#phase-4-10-decision/);
  assert.match(acceptance,
    /phase-4\.10-f3c-rollback-discovery\.md#phase-4-10-f3c1-linux-no-live-acceptance/);
  assert.match(acceptance, /^<a name="v0-4-0-p9-b-sealed-source-cloud-operator"><\/a>$/m);
  const p9bOperatorStart = acceptance.indexOf('<a name="v0-4-0-p9-b-sealed-source-cloud-operator"></a>');
  const p9bLocalSealStart = acceptance.indexOf('<a name="v0-4-0-p9-b-local-seal-evidence"></a>');
  const p9bCloudEvidenceStart = acceptance.indexOf('<a name="v0-4-0-p9-b-sealed-source-cloud-evidence"></a>');
  const f3c4ClosureStart = acceptance.indexOf('<a name="v0-4-0-dev-f3c4-aggregate-closure"></a>');
  assert.ok(p9bLocalSealStart > 0 && p9bOperatorStart > p9bLocalSealStart
    && p9bCloudEvidenceStart > p9bOperatorStart && f3c4ClosureStart > p9bCloudEvidenceStart);
  const p9bOperator = acceptance.slice(p9bOperatorStart, p9bCloudEvidenceStart);
  for (const anchor of [
    "source-candidate-setup",
    "blackbox-post-install-resume",
    "blackbox-canonical-baseline",
    "blackbox-canonical-context",
    "blackbox-real-resume",
    "source-candidate-deep-check",
  ]) assert.match(p9bOperator, new RegExp(`cloud-hard-acceptance-template\\.md#${anchor}`));
  for (const signal of [
    "git rev-parse HEAD", "git push origin 0.4.0", "git ls-remote origin refs/heads/0.4.0",
    "PWF_ACCEPTANCE_NODE_MAJOR", "PWF_SC_RUNBOOK_HEAD", "PWF_DEEP_CHECK_HEAD",
    "PWF_SOURCE_CANDIDATE_SETUP=PASS", "PWF_SC_POST_RESUME=PASS",
  ]) assert.match(p9bOperator, new RegExp(signal.replaceAll(".", "\\.")));
  assert.match(p9bOperator, /4\.1[\s\S]*5\.1[\s\S]*第 6 节[\s\S]*第 7 节[\s\S]*8\.1[\s\S]*8\.2[\s\S]*9\.1/);
  assert.doesNotMatch(p9bOperator, /~~~bash|```bash|set -Eeuo pipefail/,
    "version acceptance must route to the template rather than copy its Bash authorities");
  const p9bCloudEvidence = acceptance.slice(p9bCloudEvidenceStart, f3c4ClosureStart);
  for (const fact of [
    "fe8cd7f284ea2849f634aa68813dbb0f2cca83f9",
    "164 tests，164 pass，0 fail，0 skipped",
    "24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3",
    "INSTALLER_VERSION=0.4.0", "RELEASE_ARTIFACT_ENTRIES=22",
    "INSTALLED_RUNTIME_FILES=12", "UPSTREAM_PRISTINE_FILES=4",
    "BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE", "MANAGED_POLICY=ADAPTER_ONLY",
    "PWF_SC_POST_RESUME=PASS",
    "P9_B_SEALED_SOURCE_CLOUD_PASS / STOP_BEFORE_P9_C / PUBLICATION_NOT_AUTHORIZED",
  ]) assert.match(p9bCloudEvidence, new RegExp(fact.replaceAll(".", "\\.")));
  assert.match(phase9History, /^<a name="phase-9-v0-4-0-p9-b-sealed-source-cloud"><\/a>$/m);
  assert.match(phase9History,
    /P9_B_SEALED_SOURCE_CLOUD_PASS \/ STOP_BEFORE_P9_C \/ PUBLICATION_NOT_AUTHORIZED/);
  assert.match(roadmap, /P9-E pointer-only promotion与postflight PASS[\s\S]*P9-F第二轮retirement review完成/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3c1-local-materialization"><\/a>$/m);
  assert.match(acceptance,
    /F3C1_PROTOCOL_NO_LIVE_PASS \/ REF_AWARE_LINUX_ZERO_SKIP \/ CLOUD_ROLLBACK_NOT_RUN \/ STOP_BEFORE_F3C2/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3c2-smart-rollback-evidence"><\/a>$/m);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3c2-smart-live-evidence"><\/a>$/m);
  assert.match(acceptance,
    /F3C2_SMART_LIVE_PASS \/ SMART_ROLLBACK_AND_EXACT_RECOVERY_CONFIRMED \/ STOP_BEFORE_F3C3/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3c3-autonomous-rollback-evidence"><\/a>$/m);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3c3-autonomous-live-evidence"><\/a>$/m);
  assert.match(acceptance,
    /F3C3_A_ROLLBACK_PASS \/ AUTONOMOUS_ACCEPTED_ROLLBACK_CONFIRMED \/ A_RECOVER_NOT_RUN \/ STOP_FOR_EVIDENCE_REVIEW/);
  assert.match(acceptance,
    /F3C3_AUTONOMOUS_LIVE_PASS \/ AUTONOMOUS_ROLLBACK_AND_EXACT_RECOVERY_CONFIRMED \/ STOP_BEFORE_F3C4/);
  assert.match(acceptance, /^<a name="v0-4-0-dev-f3c4-aggregate-closure"><\/a>$/m);
  assert.match(acceptance,
    /F3C_ROLLBACK_PASS \/ SMART_AND_AUTONOMOUS_ROLLBACK_EVIDENCE_RECONCILED \/ PHASE_4_FUNCTIONAL_BASELINE_READY \/ STOP_BEFORE_PHASE_9/);
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
  const publishedReleaseOperatorReady =
    /v0\.4\.0 Phase 9 P9-D Published Release Cloud[^\n]*`MAINTAINER_CLOUD_PENDING`/.test(acceptance);
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
    const currentEvidenceHeading = "## P9-B local seal evidence";
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
  assert.match(acceptance, /P9-A.*64 位 zero hash.*fail closed[\s\S]*P9-B.*exact ZIP SHA/s);
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
    assert.match(acceptance,
      /不自动授权 GitHub `Latest`、\s*(?:rollback|accepted\/fallback)[\s\S]*(?:Product Phase|P9-E)/);
  } else {
    assert.doesNotMatch(acceptance, /R5-SC=PASS|R5-PR=PASS|CLOUD-HARD-ACCEPTANCE-PASS/);
    if (publishedReleaseOperatorReady) {
      assert.match(acceptance, /^<a name="v0-4-0-p9-d-published-release-cloud-operator"><\/a>$/m);
      assert.match(acceptance,
        /https:\/\/github\.com\/keeptoy\/pwf-codex-cloud-hooks-next\/releases\/download\/v0\.4\.0\//);
    } else {
      assert.doesNotMatch(acceptance, /https:\/\/github\.com\/[^\s]+\/releases\/download\//i);
    }
  }

  if (candidate === accepted) {
    assert.match(acceptance, /Latest promotion[^\n]*postflight/);
    assert.match(acceptance, /isLatest=true[\s\S]*isPrerelease=false[\s\S]*isDraft=false/);
    assert.match(acceptance, /PWF_P9E_POSTFLIGHT=PASS/);
    assert.match(acceptance, new RegExp(`${escapedCandidate} 成为 accepted/Latest`));
    assert.match(acceptance, new RegExp(`${immediateFallback.replaceAll(".", "\\.")} 成为 immediate[\\s\\S]*fallback`));
    assert.match(acceptance, /P9_E_POINTER_PROMOTION_PASS/);
  }
});

test("stable architecture contracts do not freeze version history", () => {
  const architectureContracts = read("tests/architecture-contracts.test.js");

  assert.doesNotMatch(architectureContracts, /docs\/v\d+\.\d+\.\d+[^"']*cloud-hard-acceptance\.md/i);
  assert.doesNotMatch(architectureContracts, /\bv\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\b/);
  assert.doesNotMatch(architectureContracts, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(architectureContracts, /artifact\.entries\.length/);
});
