"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");
const fileHash = file => sha256(fs.readFileSync(file));

test("managed runtime manifest delegates source and install inventory to the verified bundle", () => {
  const upstream = readJson("upstream-manifest.json");
  const managed = upstream.managed_runtime;
  const violations = [];

  if (managed.schema_version !== 2) violations.push(`managed_runtime.schema_version=${managed.schema_version}, expected 2`);
  for (const retiredMirror of ["package_root", "local_package_root", "local_files", "files"]) {
    if (Object.hasOwn(managed, retiredMirror)) violations.push(`mirrored inventory field remains: ${retiredMirror}`);
  }
  for (const installedContract of ["adapter_plan_context_request", "plan_context_result"]) {
    if (Object.hasOwn(managed.contracts, installedContract)) violations.push(`mirrored installed contract remains: ${installedContract}`);
  }
  assert.deepEqual(violations, []);
});

test("machine contracts freeze provenance, pristine runtime, Host protocol, and artifact boundary", () => {
  const bundle = readJson("contracts/runtime-bundle-v1.json");
  const request = readJson("contracts/adapter-runtime-request-v1.schema.json");
  const result = readJson("contracts/runtime-result-v1.schema.json");
  const artifact = readJson("contracts/release-artifact-v1.json");
  const upstream = readJson("upstream-manifest.json");

  assert.equal(bundle.schema_version, 1);
  assert.equal(upstream.schema_version, 3);
  assert.equal(bundle.upstream.repository, upstream.upstream);
  assert.equal(bundle.upstream.release, upstream.release);
  assert.equal(bundle.upstream.commit, upstream.commit);
  assert.equal(bundle.upstream.release_archive_sha256, upstream.release_archive_sha256);
  assert.equal(bundle.upstream.release_archive_url, upstream.release_archive_url);
  assert.equal(bundle.upstream.license_sha256, upstream.managed_runtime.license_provenance.upstream_sha256);
  assert.equal(bundle.upstream.canonical_source_root, "skills/planning-with-files");

  const files = new Map(bundle.files.map(file => [file.id, file]));
  assert.equal(files.size, bundle.files.length);
  assert.deepEqual([...files.keys()], ["session_catchup", "resolve_plan_dir", "inject_plan", "ledger_summary"]);
  assert.deepEqual([...files.values()].map(file => file.source_path), [
    "skills/planning-with-files/scripts/session-catchup.py",
    "skills/planning-with-files/scripts/resolve-plan-dir.sh",
    "skills/planning-with-files/scripts/inject-plan.sh",
    "skills/planning-with-files/scripts/ledger-summary.sh",
  ]);
  assert.equal(Object.hasOwn(bundle, "deferred_upstream_candidates"), false,
    "programme roadmap candidates must stay outside the runtime bundle");
  const admittedSources = new Set(bundle.files.map(file => file.source_path));
  for (const phase4Source of [
    "skills/planning-with-files/scripts/attest-plan.sh",
    "skills/planning-with-files/scripts/ledger-append.sh",
    "skills/planning-with-files/scripts/phase-status.sh",
  ]) {
    assert.equal(admittedSources.has(phase4Source), false,
      `unadmitted Phase 4 source must stay outside runtime inventory: ${phase4Source}`);
  }
  for (const file of files.values()) {
    assert.equal(Object.hasOwn(file, "activation_phase"), false,
      `${file.id} must not carry historical programme phase metadata`);
    assert.match(file.source_path, /^skills\/planning-with-files\/scripts\/[A-Za-z0-9._-]+$/);
    assert.match(file.package_path, /^runtime\/upstream\/[A-Za-z0-9._-]+$/);
    assert.match(file.installed_path, /^hooks\/planning-with-files\/upstream\/[A-Za-z0-9._-]+$/);
    assert.match(file.pristine_sha256, /^[a-f0-9]{64}$/);
    assert.match(file.managed_sha256, /^[a-f0-9]{64}$/);
    assert.equal(file.mode, "0755");
    assert.equal(file.origin, "upstream_pristine");
    assert.equal(file.managed_sha256, file.pristine_sha256);
    assert.deepEqual(file.overlay_ids, []);
    for (const dependency of file.direct_file_dependencies) {
      assert.ok(files.has(dependency.id), `${file.id} has unknown dependency ${dependency.id}`);
    }
  }
  assert.equal(files.get("ledger_summary").direct_file_dependencies[0].id, "resolve_plan_dir");
  assert.equal(files.get("inject_plan").direct_file_dependencies[0].condition, "mode=autonomous|gated");

  const fixtureRoot = path.join(root, "tests", "fixtures", "planning-with-files");
  assert.equal(fileHash(path.join(fixtureRoot, "scripts", "session-catchup.py")), files.get("session_catchup").pristine_sha256);
  assert.equal(fileHash(path.join(fixtureRoot, "scripts", "resolve-plan-dir.sh")), files.get("resolve_plan_dir").pristine_sha256);
  const referenceRoot = path.join(root, "planning-with-files-3.8.2");
  if (fs.existsSync(referenceRoot)) {
    for (const file of files.values()) {
      assert.equal(fileHash(path.join(referenceRoot, file.source_path)), file.pristine_sha256, file.id);
    }
  }
  assert.equal(Object.hasOwn(upstream, "compatibility_patches"), false);
  assert.equal(Object.hasOwn(upstream, "historical_patched_skill_files"), false);
  assert.equal(Object.hasOwn(upstream.managed_runtime.contracts, "compatibility_overlays"), false);

  assert.equal(upstream.managed_runtime.schema_version, 2);
  assert.deepEqual(Object.keys(upstream.managed_runtime).sort(),
    ["contracts", "importer", "license_provenance", "schema_version"]);
  for (const frozen of files.values()) {
    assert.equal(fileHash(path.join(root, frozen.package_path)), frozen.managed_sha256, frozen.id);
  }
  for (const contract of Object.values(upstream.managed_runtime.contracts)) {
    assert.equal(fileHash(path.join(root, contract.path)), contract.sha256, contract.path);
  }
  const localFiles = new Map(bundle.local_files.map(file => [file.id, file]));
  assert.deepEqual([...localFiles.keys()], ["owned_catchup", "owned_plan"]);
  assert.deepEqual(localFiles.get("owned_catchup").direct_file_dependencies, [{
    id: "session_catchup",
    condition: "always",
    required: true,
    allowed_symbols: ["extract_messages_after", "find_last_planning_update", "same_project_path", "text_content"],
  }]);
  assert.deepEqual(localFiles.get("owned_plan").direct_file_dependencies.map(item => item.id), ["resolve_plan_dir", "inject_plan"]);
  for (const local of localFiles.values()) {
    assert.equal(Object.hasOwn(local, "activation_phase"), false,
      `${local.id} must not carry historical programme phase metadata`);
    assert.equal(fileHash(path.join(root, local.package_path)), local.sha256, local.id);
  }
  assert.deepEqual(
    bundle.installed_contracts.map(item => item.id),
    ["adapter_plan_context_request", "plan_context_result"],
  );
  for (const installed of bundle.installed_contracts) {
    assert.equal(fileHash(path.join(root, installed.package_path)), installed.sha256);
  }
  assert.equal(fileHash(path.join(root, upstream.managed_runtime.importer.path)), upstream.managed_runtime.importer.sha256);
  assert.equal(fileHash(path.join(root, upstream.managed_runtime.license_provenance.notice_path)), upstream.managed_runtime.license_provenance.notice_sha256);
  const notice = fs.readFileSync(path.join(root, upstream.managed_runtime.license_provenance.notice_path), "utf8");
  assert.match(notice, /runtime\/upstream[\s\S]*byte-for-byte pristine/);
  assert.match(notice, /repository-owned wrappers/);
  assert.doesNotMatch(notice, /compatibility overlays? applied|overlays? applied/i);

  assert.equal(request.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(request.additionalProperties, false);
  assert.deepEqual(request.required, ["schema_version", "runtime", "event", "project", "transcript", "output_budget"]);
  assert.deepEqual(request.properties.project.required, ["root", "planning_enabled", "session_attachment", "plan_state", "plan_scope", "plan_dir"]);
  assert.deepEqual(request.properties.project.properties.session_attachment.enum, ["legacy", "attached", "detached"]);
  assert.equal(request.properties.event.properties.session_id.pattern, "^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$");
  assert.equal(request.properties.output_budget.properties.max_report_chars.const, 20000);
  assert.equal(request.properties.output_budget.properties.max_messages.const, 15);
  assert.equal(request.properties.output_budget.properties.user_head_chars.const, 350);
  assert.equal(request.properties.output_budget.properties.user_tail_chars.const, 650);
  assert.equal(request.properties.output_budget.properties.truncation_marker.const, "...[truncated]...");
  assert.equal(Object.hasOwn(request.properties, "prompt"), false);

  assert.equal(result.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(result.additionalProperties, false);
  assert.ok(result.$defs.outcome.enum.includes("report_emitted"));
  assert.ok(result.$defs.outcome.enum.includes("diagnostic_report_available"));
  assert.ok(result.$defs.outcome.enum.includes("planning_disabled"));
  assert.ok(result.$defs.outcome.enum.includes("session_not_attached"));
  assert.ok(result.$defs.outcome.enum.includes("no_plan"));
  assert.ok(result.$defs.outcome.enum.includes("runtime_error"));
  assert.ok(result.$defs.outcome.enum.includes("malformed_transcript"));
  assert.ok(result.$defs.outcome.enum.includes("transcript_unreadable"));
  assert.ok(result.properties.diagnostic.required.includes("planning_enabled"));
  assert.ok(result.properties.diagnostic.required.includes("session_attachment"));
  assert.ok(result.properties.diagnostic.required.includes("selected_transcript_path"));
  assert.ok(result.properties.diagnostic.required.includes("selected_plan_dir"));
  assert.ok(result.properties.warnings.items.enum.includes("invalid_utf8_record"));
  assert.ok(result.properties.warnings.items.enum.includes("invalid_json_record"));
  assert.ok(result.properties.warnings.items.enum.includes("record_too_large"));
  assert.equal(result.properties.report.maxLength, 20000);

  assert.equal(artifact.archive_root, "pwf-codex-cloud-hooks/");
  assert.equal(artifact.package_name, "pwf-codex-cloud-hooks");
  assert.equal(artifact.package_version, readJson("package.json").version);
  assert.equal(artifact.ordering, "lexicographic_by_utf8_path");
  assert.equal(artifact.external_release_assets.length, 1);
  assert.equal(artifact.external_release_assets[0].path,
    `init-cloud-sandbox-v${artifact.package_version}.bash`);
  const artifactPaths = artifact.entries.map(entry => entry.path);
  assert.equal(new Set(artifactPaths).size, artifactPaths.length);
  assert.equal(artifactPaths.length, 21);
  assert.equal(artifactPaths.includes("patches/patch_planning_skill.py"), false);
  assert.equal(artifactPaths.includes("contracts/compatibility-overlays-v1.json"), false);
  assert.equal(artifactPaths.some(item => item.startsWith("init-cloud-sandbox-")), false);
  for (const entry of artifact.entries.filter(entry => entry.state === "present")) {
    assert.equal(fs.existsSync(path.join(root, entry.path)), true, entry.path);
  }
  for (const forbidden of artifact.excluded_prefixes) {
    assert.equal(artifactPaths.some(entry => entry === forbidden.slice(0, -1) || entry.startsWith(forbidden)), false, forbidden);
  }
});
