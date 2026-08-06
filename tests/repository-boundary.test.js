"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

const expectedPaths = [
  ".gitattributes", ".gitignore", ".planning/.active_plan",
  ".planning/2026-08-05-slim-repository-migration/findings.md",
  ".planning/2026-08-05-slim-repository-migration/progress.md",
  ".planning/2026-08-05-slim-repository-migration/task_plan.md",
  ".planning/2026-08-06-v0.3.0-stable-release/findings.md",
  ".planning/2026-08-06-v0.3.0-stable-release/progress.md",
  ".planning/2026-08-06-v0.3.0-stable-release/task_plan.md",
  ".planning/2026-08-06-v0.3.1-security-fix-discovery/findings.md",
  ".planning/2026-08-06-v0.3.1-security-fix-discovery/progress.md",
  ".planning/2026-08-06-v0.3.1-security-fix-discovery/task_plan.md",
  "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "LICENSE",
  "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "THIRD_PARTY_NOTICES.md",
  "contracts/adapter-plan-context-request-v1.schema.json",
  "contracts/adapter-runtime-request-v1.schema.json",
  "contracts/compatibility-overlays-v1.json",
  "contracts/plan-context-result-v1.schema.json",
  "contracts/release-artifact-v1.json", "contracts/runtime-bundle-v1.json",
  "contracts/runtime-result-v1.schema.json", "docs/beta3-dev-m3-cloud-equivalence.md",
  "docs/beta3-dev-m4-cutover-plan.md",
  "docs/git-file-modes.md",
  "docs/v0.3.0-beta.2-cloud-hard-acceptance.md", "hooks/hook_adapter.py",
  "docs/v0.3.0-cloud-hard-acceptance.md",
  "init-cloud-sandbox-v0.3.0.bash", "install.js", "package.json",
  "patches/patch_planning_skill.py", "runtime/owned-catchup.py", "runtime/owned-plan.py",
  "runtime/upstream/inject-plan.sh", "runtime/upstream/ledger-summary.sh",
  "runtime/upstream/resolve-plan-dir.sh", "runtime/upstream/session-catchup.py",
  "tests/activation.test.js", "tests/architecture-contracts.test.js",
  "tests/cloud-fixtures.test.js", "tests/contracts.test.js",
  "tests/fixtures/cloud/hook-observations-v1.json",
  "tests/fixtures/cloud/session-catchup-cloud-wrapper.jsonl",
  "tests/fixtures/golden/adapter-output-canonical-plan.json",
  "tests/fixtures/golden/adapter-output-managed-legacy.json",
  "tests/fixtures/planning-with-files/README.md", "tests/fixtures/planning-with-files/SKILL.md",
  "tests/fixtures/planning-with-files/scripts/resolve-plan-dir.sh",
  "tests/fixtures/planning-with-files/scripts/session-catchup.py",
  "tests/golden-output.test.js", "tests/hook-adapter.test.js", "tests/import-runtime.test.js",
  "tests/installer.test.js", "tests/owned-plan-runtime.test.js", "tests/owned-runtime.test.js",
  "tests/release-package.test.js", "tests/repository-boundary.test.js",
  "tests/runtime-supervisor.test.js", "tests/skill-patch.test.js",
  "tools/build_release.py", "tools/import_upstream_runtime.py", "upstream-manifest.json",
].sort();

test("slim repository has the exact current allowlist and no archived path aliases", () => {
  const result = spawnSync("git", ["-c", "core.quotepath=false", "ls-files"], {
    cwd: root, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const actual = result.stdout.trim().split(/\r?\n/).filter(Boolean).map(value => value.replaceAll("\\", "/")).sort();
  assert.equal(expectedPaths.length, 68);
  assert.deepEqual(actual, expectedPaths);
  for (const forbidden of [
    "PROJECT_UNDERSTANDING.md", "work_plan.md", "黑盒验证.md", "snapshot-prototype/",
    "tests/phase3-contracts.test.js", "tests/snapshot-prototype-handoff.test.js",
    "tests/fixtures/golden/adapter-output-v0.2.2.json",
    "tests/fixtures/golden/adapter-output-v0.3.0-beta.1.json",
    "tests/fixtures/cloud/session-catchup-v0.2.2.jsonl",
  ]) assert.equal(actual.some(item => item === forbidden || item.startsWith(forbidden)), false, forbidden);
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

test("archived prototype and history remain outside runtime, Release, and adapter dispatch", () => {
  const runtime = read("contracts/runtime-bundle-v1.json");
  const release = read("contracts/release-artifact-v1.json");
  const adapter = read("hooks/hook_adapter.py");
  const installer = read("install.js");
  const m3Runbook = read("docs/beta3-dev-m3-cloud-equivalence.md");
  const m4Runbook = read("docs/beta3-dev-m4-cutover-plan.md");
  const stableRunbook = read("docs/v0.3.0-cloud-hard-acceptance.md");
  for (const content of [runtime, release, adapter]) {
    assert.doesNotMatch(content, /snapshot-prototype|prototype_snapshot_runner/);
    assert.doesNotMatch(content, /docs\/phase-|\.planning\/2026-08-01/);
  }
  const artifact = JSON.parse(release);
  assert.equal(artifact.entries.length, 22);
  assert.equal(artifact.entries.some(item => item.path.startsWith("docs/") || item.path.startsWith("tests/")), false);
  assert.deepEqual(artifact.external_release_assets.map(item => item.path), ["init-cloud-sandbox-v0.3.0.bash"]);
  assert.match(installer, /\[\[hooks\.SessionStart\.hooks\]\]/);
  assert.match(installer, /\[\[hooks\.UserPromptSubmit\.hooks\]\]/);
  assert.match(m3Runbook, /event_groups = policy\["hooks"\]\[event\]/);
  assert.match(m3Runbook, /handlers = event_groups\[0\]\["hooks"\]/);
  assert.doesNotMatch(m3Runbook, /handlers\[0\]\["command"\]/);
  assert.match(m4Runbook, /M4A_SUCCESSOR_AUTHORITY_CUTOVER=PASS/);
  assert.match(m4Runbook, /M4B_ARCHIVE_PROVENANCE_HANDOFF=PASS/);
  assert.match(m4Runbook, /M4C_CUTOVER_ROLLBACK_ACCEPTANCE=PASS/);
  assert.match(m4Runbook, /M4 不发布 beta\.3/);
  assert.doesNotMatch(stableRunbook, /item\["relative"\]/);
  assert.equal((stableRunbook.match(/item\["path"\]/g) || []).length, 2);
});
