"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const wrapperSource = path.join(root, "runtime", "owned-catchup.py");
const managedSource = path.join(root, "runtime", "upstream", "session-catchup.py");
const pristineSource = path.join(root, "tests", "fixtures", "planning-with-files", "scripts", "session-catchup.py");
const transcriptFixture = path.join(root, "tests", "fixtures", "cloud", "session-catchup-cloud-wrapper.jsonl");
const observations = JSON.parse(fs.readFileSync(path.join(root, "tests", "fixtures", "cloud", "hook-observations-v1.json"), "utf8"));

const helperRoots = Object.freeze([
  "extract_messages_after",
  "find_last_planning_update",
  "same_project_path",
  "text_content",
]);

function installRuntime(workspace, name, upstreamSource) {
  const runtimeRoot = path.join(workspace, name);
  const upstreamRoot = path.join(runtimeRoot, "upstream");
  fs.mkdirSync(upstreamRoot, { recursive: true });
  fs.copyFileSync(wrapperSource, path.join(runtimeRoot, "owned-catchup.py"));
  fs.copyFileSync(upstreamSource, path.join(upstreamRoot, "session-catchup.py"));
  return path.join(runtimeRoot, "owned-catchup.py");
}

function fixture(workspace) {
  const project = path.join(workspace, "project");
  const plan = path.join(project, ".planning", "pristine-boundary");
  const store = path.join(workspace, "codex", "sessions");
  const sessionDirectory = path.join(store, "2026", "08", "10");
  const session = path.join(sessionDirectory, "rollout-pristine-boundary.jsonl");
  fs.mkdirSync(plan, { recursive: true });
  fs.writeFileSync(path.join(plan, "task_plan.md"), "# Task Plan: Pristine Boundary\n");
  fs.mkdirSync(sessionDirectory, { recursive: true });
  const escapedProject = JSON.stringify(project).slice(1, -1);
  fs.writeFileSync(session, fs.readFileSync(transcriptFixture, "utf8").replaceAll("{{PROJECT_ROOT}}", escapedProject));
  return {
    project, plan, store, session,
    request: {
      schema_version: 1,
      runtime: "codex",
      event: { name: "SessionStart", source: "resume", session_id: observations.session.session_id, turn_id: null },
      project: { root: project, planning_enabled: true, session_attachment: "legacy", plan_state: "resolved", plan_scope: "scoped", plan_dir: plan },
      transcript: { host_path_state: "validated", host_path: session, session_store_roots: [store], allow_scan_fallback: false },
      output_budget: {
        max_report_chars: 20000,
        max_messages: 15,
        max_tools_per_message: 4,
        assistant_chars: 300,
        user_untruncated_chars: 1000,
        user_head_chars: 350,
        user_tail_chars: 650,
        truncation_marker: "...[truncated]...",
      },
    },
  };
}

function runRuntime(runtime, request) {
  const harness = [
    "import importlib.util,json,sys",
    "spec=importlib.util.spec_from_file_location('owned_catchup',sys.argv[1])",
    "module=importlib.util.module_from_spec(spec)",
    "spec.loader.exec_module(module)",
    "value=json.loads(sys.stdin.read())",
    "print(json.dumps(module.run_request(value,require_posix=False),separators=(',',':')))",
  ].join(";");
  const result = spawnSync(python, ["-c", harness, runtime], {
    encoding: "utf8",
    input: JSON.stringify(request),
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

const analyzer = String.raw`
import ast, json, pathlib, sys

tree = ast.parse(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
functions = {node.name: node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))}
edges = {}
for name, node in functions.items():
    edges[name] = sorted({
        call.func.id
        for call in ast.walk(node)
        if isinstance(call, ast.Call) and isinstance(call.func, ast.Name) and call.func.id in functions
    })

roots = json.loads(sys.argv[2])
closure = set()
pending = list(roots)
while pending:
    name = pending.pop()
    if name in closure:
        continue
    if name not in functions:
        raise SystemExit(f"missing helper root: {name}")
    closure.add(name)
    pending.extend(edges[name])

top_level_calls = []
optional_imports = []
for node in tree.body:
    if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call) and isinstance(node.value.func, ast.Name):
        top_level_calls.append(node.value.func.id)
    if isinstance(node, ast.Try):
        for child in node.body:
            if isinstance(child, ast.Import):
                optional_imports.extend(alias.name for alias in child.names)
            elif isinstance(child, ast.ImportFrom):
                optional_imports.append(child.module)

print(json.dumps({
    "closure": sorted(closure),
    "top_level_calls": sorted(top_level_calls),
    "optional_imports": sorted(optional_imports),
}, separators=(",", ":")))
`;

function analyze(source) {
  const result = spawnSync(python, ["-c", analyzer, source, JSON.stringify(helperRoots)], {
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("owned catch-up produces identical envelopes with managed and pristine pinned parser modules", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-pristine-equivalence-"));
  try {
    const managedRuntime = installRuntime(workspace, "managed", managedSource);
    const pristineRuntime = installRuntime(workspace, "pristine", pristineSource);
    const value = fixture(workspace);

    let managed = runRuntime(managedRuntime, value.request);
    let pristine = runRuntime(pristineRuntime, value.request);
    assert.deepEqual(pristine, managed);
    assert.equal(pristine.outcome, "report_emitted");

    value.request.transcript = {
      host_path_state: "rejected",
      host_path: null,
      session_store_roots: [value.store],
      allow_scan_fallback: true,
    };
    managed = runRuntime(managedRuntime, value.request);
    pristine = runRuntime(pristineRuntime, value.request);
    assert.deepEqual(pristine, managed);
    assert.equal(pristine.diagnostic.selected_transcript, "session_store_fallback");

    fs.appendFileSync(value.session, "{not-json\n");
    managed = runRuntime(managedRuntime, value.request);
    pristine = runRuntime(pristineRuntime, value.request);
    assert.deepEqual(pristine, managed);
    assert.equal(pristine.outcome, "malformed_transcript");
    assert.equal(pristine.inject, false);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("owned catch-up freezes the explicit upstream helper root allowlist", () => {
  const source = fs.readFileSync(wrapperSource, "utf8");
  const actual = [...source.matchAll(/\bupstream\.([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)]
    .map(match => match[1]).sort();
  assert.deepEqual(actual, helperRoots);
});

test("managed and pristine helper closures avoid CLI overlays and keep a bounded import-time surface", () => {
  const managed = analyze(managedSource);
  const pristine = analyze(pristineSource);
  assert.deepEqual(managed, pristine);
  assert.deepEqual(pristine.top_level_calls, ["configure_utf8_stdio"]);
  assert.deepEqual(pristine.optional_imports, ["orjson"]);
  for (const forbidden of ["get_codex_sessions", "get_session_candidates", "has_planning_state", "main"]) {
    assert.equal(pristine.closure.includes(forbidden), false, forbidden);
  }
});
