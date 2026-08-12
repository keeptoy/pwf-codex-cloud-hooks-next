"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const fileHash = relative => crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relative))).digest("hex");

test("source manifest is exact schema4 and routes all package-level contracts", () => {
  const manifest = readJson("upstream-manifest.json");
  assert.deepEqual(Object.keys(manifest).sort(), [
    "commit", "managed_runtime", "release", "release_archive_sha256", "release_archive_url",
    "required_skill_files", "schema_version", "upstream",
  ]);
  assert.equal(manifest.schema_version, 4);
  assert.equal(Object.hasOwn(manifest, "skill_version"), false);
  assert.deepEqual(Object.keys(manifest.managed_runtime).sort(), ["contracts", "importer", "license_provenance", "schema_version"]);
  assert.equal(manifest.managed_runtime.schema_version, 3);
  assert.deepEqual(Object.keys(manifest.managed_runtime.contracts).sort(), [
    "installed_state_transition", "release_artifact", "runtime_bundle",
  ]);
  for (const reference of [
    ...Object.values(manifest.managed_runtime.contracts), manifest.managed_runtime.importer,
  ]) assert.equal(fileHash(reference.path), reference.sha256, reference.path);
});

test("runtime bundle v2 uses structural source partitions and one install inventory", () => {
  const bundle = readJson("contracts/runtime-bundle-v2.json");
  assert.equal(bundle.schema_version, 2);
  assert.equal(bundle.contract_id, "PWF_MANAGED_RUNTIME_BUNDLE_V2");
  assert.deepEqual(Object.keys(bundle).sort(), [
    "contract_id", "installed_contracts", "local_files", "roots", "schema_version", "upstream", "upstream_files",
  ]);
  assert.deepEqual(Object.keys(bundle.roots).sort(), [
    "contract_package", "installed", "local_packages", "upstream_package", "upstream_source",
  ]);
  assert.deepEqual(bundle.upstream_files.map(item => item.id), [
    "session_catchup", "resolve_plan_dir", "inject_plan", "ledger_summary",
  ]);
  assert.deepEqual(bundle.local_files.map(item => item.id), ["adapter", "owned_catchup", "owned_plan"]);
  assert.deepEqual(bundle.installed_contracts.map(item => item.id), [
    "adapter_runtime_request", "runtime_result", "adapter_plan_context_request", "plan_context_result",
  ]);
  const entries = [...bundle.upstream_files, ...bundle.local_files, ...bundle.installed_contracts];
  assert.equal(new Set(entries.map(item => item.id)).size, entries.length);
  assert.equal(new Set(entries.map(item => item.package_path)).size, entries.length);
  assert.equal(new Set(entries.map(item => item.installed_path)).size, entries.length);
  for (const entry of entries) {
    for (const retired of ["origin", "managed_sha256", "overlay_ids", "language", "host_dependencies", "direct_file_dependencies"])
      assert.equal(Object.hasOwn(entry, retired), false, `${entry.id}.${retired}`);
    assert.equal(fileHash(entry.package_path), entry.pristine_sha256 || entry.sha256, entry.id);
    for (const dependency of entry.direct_dependencies || []) {
      assert.ok(entries.some(item => item.id === dependency.id), `${entry.id}.${dependency.id}`);
      assert.equal(Object.hasOwn(dependency, "condition"), false);
      assert.equal(Object.hasOwn(dependency, "required"), false);
    }
  }
  assert.deepEqual(bundle.local_files.find(item => item.id === "adapter").direct_dependencies.map(item => item.id),
    ["owned_plan", "owned_catchup"]);
});

test("Release v2 entries own exact ZIP inventory and mode", () => {
  const artifact = readJson("contracts/release-artifact-v2.json");
  const packageMetadata = readJson("package.json");
  assert.equal(artifact.schema_version, 2);
  assert.equal(artifact.contract_id, "PWF_RELEASE_ARTIFACT_V2");
  assert.equal(artifact.package_name, packageMetadata.name);
  assert.equal(artifact.package_version, packageMetadata.version);
  assert.ok(artifact.entries.length > 0);
  assert.ok(artifact.entries.every(entry => Object.keys(entry).sort().join(",") === "mode,path"));
  assert.ok(artifact.entries.every(entry => ["0644", "0755"].includes(entry.mode)));
  assert.equal(new Set(artifact.entries.map(entry => entry.path)).size, artifact.entries.length);
  assert.deepEqual(artifact.external_release_assets, [`init-cloud-sandbox-v${packageMetadata.version}.bash`]);
  assert.equal(artifact.entries.some(entry => entry.path.startsWith("init-cloud-sandbox-")), false);
  assert.equal(fs.existsSync(path.join(root, "contracts/runtime-bundle-v1.json")), false);
  assert.equal(fs.existsSync(path.join(root, "contracts/release-artifact-v1.json")), false);
});

test("installed transition admits exactly one accepted v0.3.5 state shape", () => {
  const transition = readJson("contracts/installed-state-transition-v1.json");
  assert.deepEqual(Object.keys(transition).sort(), ["contract_id", "predecessor", "schema_version"]);
  assert.equal(transition.schema_version, 1);
  assert.equal(transition.contract_id, "PWF_INSTALLED_STATE_TRANSITION_V1");
  assert.equal(transition.predecessor.package_version, "0.3.5");
  assert.equal(transition.predecessor.installed_manifest_schema, 3);
  assert.equal(transition.predecessor.owner, "pwf-codex-cloud-hooks");
  assert.equal(transition.predecessor.runtime_files.length, 10);
  assert.equal(new Set(transition.predecessor.runtime_files.map(item => item.path)).size, 10);
});

test("F1B rotates only the plan protocol to exact v2", () => {
  for (const relative of [
    "contracts/adapter-runtime-request-v1.schema.json", "contracts/runtime-result-v1.schema.json",
  ]) {
    const schema = readJson(relative);
    assert.equal(schema.type, "object", relative);
    assert.equal(schema.additionalProperties, false, relative);
    assert.equal(schema.properties.schema_version.const, 1, relative);
  }
  const request = readJson("contracts/adapter-plan-context-request-v2.schema.json");
  const result = readJson("contracts/plan-context-result-v2.schema.json");
  assert.equal(request.properties.schema_version.const, 2);
  assert.deepEqual(request.properties.policy.required,
    ["planning_enabled", "allowed_profiles", "opt_in_protocol"]);
  assert.equal(request.properties.policy.properties.opt_in_protocol.const, "codex-managed-v1");
  assert.deepEqual(result.properties.effective_profile.enum, ["legacy", "smart", "autonomous", null]);
  assert.ok(result.properties.advisory.enum.includes("profile_unsupported"));
  assert.equal(fs.existsSync(path.join(root, "contracts/adapter-plan-context-request-v1.schema.json")), false);
  assert.equal(fs.existsSync(path.join(root, "contracts/plan-context-result-v1.schema.json")), false);
});
