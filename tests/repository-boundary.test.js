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
  const rootBootstraps = actual.filter(item => /^init-cloud-sandbox-v\d+\.\d+\.\d+\.bash$/.test(item));

  assert.equal(artifact.excluded_prefixes.includes("docs/"), true);
  for (const relative of docs) {
    assert.match(relative, /^docs\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.md$/);
    assert.equal(releasePaths.includes(relative), false, relative);
  }
  assert.deepEqual(rootBootstraps, ["init-cloud-sandbox-v0.3.1.bash", "init-cloud-sandbox-v0.3.2.bash"]);
  for (const retired of [
    "docs/beta3-dev-m3-cloud-equivalence.md",
    "docs/beta3-dev-m4-cutover-plan.md",
    "docs/v0.3.0-beta.2-cloud-hard-acceptance.md",
    "docs/v0.3.0-cloud-hard-acceptance.md",
    "init-cloud-sandbox-v0.3.0.bash",
  ]) assert.equal(actual.includes(retired), false, retired);
  assert.match(read("docs/repository-governance-guide.md"), /^<a name="repository-governance-guide"><\/a>$/m);
  assert.match(read("MAINTAINER_HANDOFF.md"), /\[[^\]]*仓库治理指南[^\]]*\]\(docs\/repository-governance-guide\.md\)/);
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
  for (const content of [runtime, release, adapter]) {
    assert.doesNotMatch(content, /snapshot-prototype|prototype_snapshot_runner/);
    assert.doesNotMatch(content, /docs\/phase-|\.planning\/2026-08-01/);
  }
  const artifact = JSON.parse(release);
  assert.equal(artifact.package_version, "0.3.2-dev");
  assert.equal(artifact.entries.length, 23);
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), true);
  assert.equal(artifact.entries.some(item => item.path.startsWith("docs/") || item.path.startsWith("tests/")), false);
  assert.deepEqual(artifact.external_release_assets.map(item => item.path), ["init-cloud-sandbox-v0.3.2.bash"]);
  assert.match(installer, /\[\[hooks\.SessionStart\.hooks\]\]/);
  assert.match(installer, /\[\[hooks\.UserPromptSubmit\.hooks\]\]/);
  for (const immutable of [
    "39795283cd65f84547651d7bec816191fb5bfedf",
    "0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151",
    "1454c9224c83d11c073b05baf6e536a11c3bb0e5",
    "bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b",
  ]) assert.match(provenance, new RegExp(immutable));
});
