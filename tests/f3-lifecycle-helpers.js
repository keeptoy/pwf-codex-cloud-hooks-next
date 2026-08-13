"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const RECORDS = new Set(["findings.md", "progress.md", "task_plan.md"]);
const FIXED_STATE = new Set([".attestation", ".mode", ".nonce", ".pwf-codex-managed"]);
const LEDGER_NAME = /^ledger-([A-Za-z0-9][A-Za-z0-9_-]{0,63})\.jsonl$/;
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const ownedPlan = path.resolve(__dirname, "..", "runtime", "owned-plan.py");

function exactFile(file, maximum) {
  const info = fs.lstatSync(file);
  assert.equal(info.isSymbolicLink(), false, `planning state must not be a symlink: ${file}`);
  assert.equal(info.isFile(), true, `planning state must be a regular file: ${file}`);
  assert.equal(info.nlink, 1, `planning state must have one hard link: ${file}`);
  const content = fs.readFileSync(file);
  assert.ok(content.length <= maximum, `planning state exceeds byte budget: ${file}`);
  return content;
}

function validateLedger(file, expectedAgent) {
  const content = exactFile(file, 256 * 1024);
  const text = content.toString("utf8");
  assert.equal(Buffer.from(text, "utf8").equals(content), true, `ledger must be UTF-8: ${file}`);
  const script = [
    "import importlib.util,json,pathlib,sys",
    "spec=importlib.util.spec_from_file_location('pwf_owned_plan',sys.argv[1])",
    "module=importlib.util.module_from_spec(spec)",
    "spec.loader.exec_module(module)",
    "normalized,records=module.normalize_ledger(pathlib.Path(sys.argv[2]).read_bytes(),sys.argv[3])",
    "print(json.dumps({'bytes':len(pathlib.Path(sys.argv[2]).read_bytes()),'records':records}))",
  ].join(";");
  const result = spawnSync(python, ["-B", "-c", script, ownedPlan, file, expectedAgent], {
    encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  assert.equal(result.status, 0, `production ledger admission rejected ${file}: ${result.stderr}`);
  return JSON.parse(result.stdout);
}

function validateActivePlanState(planDir) {
  for (const record of RECORDS) {
    assert.equal(fs.existsSync(path.join(planDir, record)), true, `active plan lacks ${record}`);
  }
  const names = fs.readdirSync(planDir).sort();
  const stateNames = names.filter(name => !RECORDS.has(name));
  for (const name of stateNames) {
    assert.equal(FIXED_STATE.has(name) || LEDGER_NAME.test(name), true,
      `unexpected active-plan state path: ${name}`);
  }
  assert.ok(stateNames.filter(name => LEDGER_NAME.test(name)).length <= 32, "too many ledger files");
  if (stateNames.length === 0) return "legacy";

  const modePath = path.join(planDir, ".mode");
  assert.equal(fs.existsSync(modePath), true, "machine state requires .mode");
  const mode = exactFile(modePath, 256).toString("utf8");
  assert.ok(mode === "inject-smart\n" || mode === "autonomous\n", "mode must use an exact supported profile");
  const activationPath = path.join(planDir, ".pwf-codex-managed");
  const activation = fs.existsSync(activationPath) ? exactFile(activationPath, 128).toString("utf8") : null;
  const ledgers = stateNames.filter(name => LEDGER_NAME.test(name));

  if (mode === "inject-smart\n") {
    for (const forbidden of [".attestation", ".nonce", ...ledgers]) {
      assert.equal(stateNames.includes(forbidden), false, `smart state must not contain ${forbidden}`);
    }
    assert.ok(activation === null || activation === "codex-managed-v1\n", "smart activation token is invalid");
    return activation === null ? "smart_prepared" : "smart_armed";
  }

  const nonce = exactFile(path.join(planDir, ".nonce"), 64).toString("utf8");
  const attestation = exactFile(path.join(planDir, ".attestation"), 128).toString("utf8");
  assert.match(nonce, /^[0-9a-f]{16}\n$/, "autonomous nonce is invalid");
  assert.match(attestation, /^[0-9a-f]{64}\n$/, "autonomous attestation is invalid");
  const task = fs.readFileSync(path.join(planDir, "task_plan.md"));
  assert.equal(attestation, `${crypto.createHash("sha256").update(task).digest("hex")}\n`,
    "autonomous attestation does not match task_plan.md");
  assert.ok(activation === null || activation === "codex-managed-v1 autonomous\n",
    "autonomous activation token is invalid");
  let totalBytes = 0;
  let totalRecords = 0;
  for (const name of ledgers) {
    const parsed = validateLedger(path.join(planDir, name), name.match(LEDGER_NAME)[1]);
    totalBytes += parsed.bytes;
    totalRecords += parsed.records;
  }
  assert.ok(totalBytes <= 1024 * 1024, "ledger aggregate exceeds byte budget");
  assert.ok(totalRecords <= 10_000, "ledger aggregate exceeds record budget");
  return activation === null ? "autonomous_prepared" : "autonomous_armed";
}

function validatePlanningScopes(root, activePlan, relativePaths) {
  const scopes = new Map();
  for (const relative of relativePaths.filter(item => item.startsWith(".planning/") && item !== ".planning/.active_plan")) {
    const match = relative.match(/^\.planning\/(\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9.-]*)\/([^/]+)$/);
    assert.ok(match, `unexpected planning lifecycle path: ${relative}`);
    const [, scope, file] = match;
    if (!scopes.has(scope)) scopes.set(scope, []);
    scopes.get(scope).push(file);
  }
  assert.equal(scopes.has(activePlan), true, `active planning scope is not tracked: ${activePlan}`);
  for (const [scope, files] of scopes) {
    if (scope !== activePlan) {
      assert.deepEqual(files.sort(), [...RECORDS].sort(), `inactive planning scope contains state: ${scope}`);
      continue;
    }
    for (const record of RECORDS) assert.equal(files.includes(record), true, `active planning scope lacks ${record}`);
    for (const file of files.filter(item => !RECORDS.has(item))) {
      assert.equal(FIXED_STATE.has(file) || LEDGER_NAME.test(file), true, `unexpected active-plan state path: ${file}`);
    }
  }
  return validateActivePlanState(path.join(root, ".planning", activePlan));
}

module.exports = { validateActivePlanState, validatePlanningScopes };
