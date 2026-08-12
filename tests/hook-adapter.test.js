"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const sourceAdapter = path.resolve(__dirname, "../hooks/hook_adapter.py");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");

const planStub = [
  "import json,os,pathlib,sys",
  "request=json.load(sys.stdin)",
  "capture=os.environ.get('PWF_TEST_PLAN_CAPTURE')",
  "if capture: pathlib.Path(capture).write_text(json.dumps(request),encoding='utf-8')",
  "mode=os.environ.get('PWF_TEST_PLAN_MODE','context')",
  "profile=os.environ.get('PWF_TEST_PLAN_PROFILE','legacy')",
  "root=request['project']['root']",
  "plan_id=request['project']['plan_id'] or 'portable-test'",
  "plan=str(pathlib.Path(root)/'.planning'/plan_id)",
  "attachment=os.environ.get('PWF_TEST_ATTACHMENT','legacy')",
  "enabled=request['policy']['planning_enabled']",
  "warnings=[]",
  "plan_id_state='absent' if request['project']['plan_id'] is None else 'accepted'",
  "if not enabled:",
  " outcome='planning_disabled'; inject=False; context=None; attachment='legacy'; state='none'; scope='none'; plan_dir=None",
  "elif mode=='detached':",
  " outcome='session_not_attached'; inject=False; context=None; attachment='detached'; state='none'; scope='none'; plan_dir=None",
  "elif mode=='no_plan':",
  " outcome='no_plan'; inject=False; context=None; state='none'; scope='none'; plan_dir=None",
  "else:",
  " outcome='context_emitted'; inject=True; context=os.environ.get('PWF_TEST_PLAN_CONTEXT','OWNED_PORTABLE_CONTEXT'); state='resolved'; scope='scoped'; plan_dir=str(pathlib.Path(root).parent/'outside') if mode=='outside' else plan",
  "result={'schema_version':2,'outcome':outcome,'inject':inject,'context':context,'effective_profile':profile,'advisory':None,'project':{'root':root,'planning_enabled':enabled,'session_attachment':attachment,'plan_state':state,'plan_scope':scope,'plan_dir':plan_dir},'warnings':warnings,'diagnostic':{'event_name':request['event']['name'],'plan_id_state':plan_id_state,'selected_plan_scope':scope,'selected_plan_dir':plan_dir}}",
  "print(json.dumps(result))",
].join("\n");

function projectFixture() {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-hook-project-"));
  const root = path.join(workspace, "project");
  const managed = path.join(workspace, "codex", "hooks", "planning-with-files");
  fs.mkdirSync(path.join(root, ".planning", "portable-test"), { recursive: true });
  fs.mkdirSync(managed, { recursive: true });
  fs.copyFileSync(sourceAdapter, path.join(managed, "hook_adapter.py"));
  fs.writeFileSync(path.join(managed, "owned-plan.py"), planStub);
  return { workspace, root, managed };
}

function invoke(layout, event, extra = {}, envOverrides = {}) {
  const payload = JSON.stringify({ cwd: layout.root, hook_event_name: event, ...extra });
  const env = { ...process.env };
  delete env.PLAN_ID;
  delete env.PLANNING_DISABLED;
  for (const [key, value] of Object.entries(envOverrides)) {
    if (value === null) delete env[key];
    else env[key] = value;
  }
  const result = spawnSync(python, [path.join(layout.managed, "hook_adapter.py"), event], {
    input: payload,
    encoding: "utf8",
    env,
  });
  return { ...result, json: result.stdout.trim() ? JSON.parse(result.stdout) : null };
}

function invokeRaw(layout, event, raw, envOverrides = {}) {
  const env = { ...process.env };
  delete env.PLAN_ID;
  delete env.PLANNING_DISABLED;
  for (const [key, value] of Object.entries(envOverrides)) {
    if (value === null) delete env[key];
    else env[key] = value;
  }
  const result = spawnSync(python, [path.join(layout.managed, "hook_adapter.py"), event], {
    input: raw,
    encoding: "utf8",
    env,
  });
  return { ...result, json: result.stdout.trim() ? JSON.parse(result.stdout) : null };
}

function jsonPayloadOfBytes(layout, event, targetBytes, multibyte = false) {
  const value = { cwd: layout.root, hook_event_name: event, turn_id: "turn-budget", marker: multibyte ? "边界" : "", padding: "" };
  const empty = JSON.stringify(value);
  value.padding = "x".repeat(targetBytes - Buffer.byteLength(empty));
  const raw = JSON.stringify(value);
  assert.equal(Buffer.byteLength(raw), targetBytes);
  return raw;
}

test("SessionStart emits source canary and authoritative owned plan context", () => {
  const layout = projectFixture();
  try {
    const result = invoke(layout, "SessionStart", { source: "startup" }, {
      PWF_TEST_PLAN_CONTEXT: "OWNED_SESSION_PLAN_CONTEXT",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.json.hookSpecificOutput.hookEventName, "SessionStart");
    assert.equal(result.json.hookSpecificOutput.additionalContext,
      "PWF_GLOBAL_HOOK_CANARY_V1 event=SessionStart source=startup\n\nOWNED_SESSION_PLAN_CONTEXT");
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("UserPromptSubmit emits event canary and authoritative owned plan context", () => {
  const layout = projectFixture();
  try {
    const result = invoke(layout, "UserPromptSubmit", { turn_id: "turn-portable" }, {
      PWF_TEST_PLAN_CONTEXT: "OWNED_PROMPT_PLAN_CONTEXT",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.json.hookSpecificOutput.additionalContext,
      "PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit\n\nOWNED_PROMPT_PLAN_CONTEXT");
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("adapter advertises smart capability and accepts a requested smart result", () => {
  const layout = projectFixture();
  const capture = path.join(layout.workspace, "plan-request.json");
  try {
    const result = invoke(layout, "UserPromptSubmit", {}, {
      PWF_TEST_PLAN_CAPTURE: capture,
      PWF_TEST_PLAN_PROFILE: "smart",
      PWF_TEST_PLAN_CONTEXT: "OWNED_SMART_CONTEXT",
    });
    assert.equal(result.status, 0, result.stderr);
    const request = JSON.parse(fs.readFileSync(capture, "utf8"));
    assert.deepEqual(request.policy.allowed_profiles, ["legacy", "smart"]);
    assert.match(result.json.hookSpecificOutput.additionalContext, /OWNED_SMART_CONTEXT/);
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("an authoritative no-plan result emits only the event canary", () => {
  const layout = projectFixture();
  try {
    const result = invoke(layout, "UserPromptSubmit", {}, { PWF_TEST_PLAN_MODE: "no_plan" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.json.hookSpecificOutput.additionalContext,
      "PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit");
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("adapter enforces the exact Host stdin byte budget before child dispatch", () => {
  const layout = projectFixture();
  const capture = path.join(layout.workspace, "plan-request.json");
  try {
    let result = invokeRaw(
      layout,
      "UserPromptSubmit",
      jsonPayloadOfBytes(layout, "UserPromptSubmit", 1_000_000),
      { PWF_TEST_PLAN_CAPTURE: capture },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.json.hookSpecificOutput.additionalContext, /OWNED_PORTABLE_CONTEXT/);
    assert.equal(fs.existsSync(capture), true);

    fs.rmSync(capture);
    result = invokeRaw(
      layout,
      "UserPromptSubmit",
      jsonPayloadOfBytes(layout, "UserPromptSubmit", 1_000_000, true),
      { PWF_TEST_PLAN_CAPTURE: capture },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.json.hookSpecificOutput.additionalContext, /OWNED_PORTABLE_CONTEXT/);
    assert.equal(fs.existsSync(capture), true);

    fs.rmSync(capture);
    result = invokeRaw(
      layout,
      "UserPromptSubmit",
      jsonPayloadOfBytes(layout, "UserPromptSubmit", 1_000_001),
      { PWF_TEST_PLAN_CAPTURE: capture },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.json.hookSpecificOutput.additionalContext,
      "PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit");
    assert.equal(fs.existsSync(capture), false);
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("adapter rejects invalid UTF-8 and non-object JSON as canary-only", () => {
  const layout = projectFixture();
  const capture = path.join(layout.workspace, "plan-request.json");
  try {
    for (const raw of [Buffer.from([0xff]), Buffer.from("[]")]) {
      const result = invokeRaw(layout, "UserPromptSubmit", raw, { PWF_TEST_PLAN_CAPTURE: capture });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.json.hookSpecificOutput.additionalContext,
        "PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit");
      assert.equal(fs.existsSync(capture), false);
    }
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("adapter obeys authoritative legacy, detached, and attached plan results", () => {
  const layout = projectFixture();
  try {
    let result = invoke(layout, "UserPromptSubmit", { session_id: "session-a" });
    assert.match(result.json.hookSpecificOutput.additionalContext, /OWNED_PORTABLE_CONTEXT/);

    result = invoke(layout, "UserPromptSubmit", { session_id: "session-a" }, { PWF_TEST_PLAN_MODE: "detached" });
    assert.equal(result.json.hookSpecificOutput.additionalContext,
      "PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit");

    result = invoke(layout, "UserPromptSubmit", { session_id: "session-a" }, { PWF_TEST_ATTACHMENT: "attached" });
    assert.match(result.json.hookSpecificOutput.additionalContext, /OWNED_PORTABLE_CONTEXT/);
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("PLANNING_DISABLED=1 is forwarded and produces canary-only output", () => {
  const layout = projectFixture();
  const capture = path.join(layout.workspace, "plan-request.json");
  try {
    const result = invoke(layout, "SessionStart", { source: "resume", session_id: "session-a" }, {
      PLANNING_DISABLED: "1",
      PWF_TEST_PLAN_CAPTURE: capture,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(fs.readFileSync(capture, "utf8")).policy.planning_enabled, false);
    assert.equal(result.json.hookSpecificOutput.additionalContext,
      "PWF_GLOBAL_HOOK_CANARY_V1 event=SessionStart source=resume");
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("PLAN_ID is forwarded and the owned result remains the only selection authority", () => {
  const layout = projectFixture();
  const capture = path.join(layout.workspace, "plan-request.json");
  try {
    const result = invoke(layout, "UserPromptSubmit", { session_id: "session-a" }, {
      PLAN_ID: "selected",
      PWF_TEST_PLAN_CAPTURE: capture,
      PWF_TEST_PLAN_CONTEXT: "SELECTED_BY_OWNED_PLAN",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(fs.readFileSync(capture, "utf8")).project.plan_id, "selected");
    assert.match(result.json.hookSpecificOutput.additionalContext, /SELECTED_BY_OWNED_PLAN/);
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});

test("an out-of-root owned result is rejected without adapter filesystem fallback", () => {
  const layout = projectFixture();
  try {
    const result = invoke(layout, "UserPromptSubmit", { session_id: "session-a" }, {
      PWF_TEST_PLAN_MODE: "outside",
      PWF_TEST_PLAN_CONTEXT: "EXTERNAL_PLAN_SECRET",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.json.hookSpecificOutput.additionalContext,
      "PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit");
  } finally { fs.rmSync(layout.workspace, { recursive: true, force: true }); }
});
