#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = __dirname;
const VERSION = require("./package.json").version;
const UPSTREAM = require("./upstream-manifest.json");
const OWNER = "pwf-codex-cloud-hooks";
const MANAGED_PYTHON = "/usr/bin/python3";
const OWNED_SEGMENT = "/hooks/planning-with-files/hook_adapter.py";
const REQUIREMENTS_BEGIN = "# BEGIN pwf-codex-cloud-hooks managed requirements";
const REQUIREMENTS_END = "# END pwf-codex-cloud-hooks managed requirements";
const EVENTS = ["SessionStart", "UserPromptSubmit"];
const MANIFEST_SCHEMA = 3;
let TEST_HOOKS = null;

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileHash(file) { return sha256(fs.readFileSync(file)); }
function commandPath(value) { return String(value).split(path.sep).join("/"); }
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
  return JSON.stringify(value);
}
function quoteCommand(value) { return `"${String(value).replace(/(["\\$`])/g, "\\$1")}"`; }
function setTestHooks(value) { TEST_HOOKS = value && typeof value === "object" ? value : null; }
function runTestHook(name, payload) { if (typeof TEST_HOOKS?.[name] === "function") TEST_HOOKS[name](payload); }
function statFingerprint(file) {
  if (!fs.existsSync(file)) return { exists: false };
  const before = fs.lstatSync(file, { bigint: true });
  if (!before.isFile()) throw new Error(`BLOCKED_UNSAFE_SHARED_STATE: ${file} is not a regular file`);
  const bytes = fs.readFileSync(file);
  const after = fs.lstatSync(file, { bigint: true });
  const identity = info => ({
    exists: true,
    dev: info.dev.toString(), ino: info.ino.toString(), size: info.size.toString(),
    mtimeNs: info.mtimeNs.toString(), ctimeNs: info.ctimeNs.toString(),
    sha256: sha256(bytes), bytes,
  });
  const first = identity(before), second = identity(after);
  if (canonical({ ...first, bytes: undefined }) !== canonical({ ...second, bytes: undefined })) throw new Error(`BLOCKED_CONCURRENT_DRIFT: ${file}`);
  return first;
}
function sameFingerprint(left, right) {
  const omit = value => ({ ...value, bytes: undefined });
  return canonical(omit(left)) === canonical(omit(right));
}
function assertFingerprint(file, expected) {
  const actual = statFingerprint(file);
  if (!sameFingerprint(actual, expected)) throw new Error(`BLOCKED_CONCURRENT_DRIFT: ${file}`);
}
function atomicWrite(file, content, mode = 0o600, expected = null) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.tmp-${process.pid}-${Date.now()}`;
  try {
    fs.writeFileSync(temp, content, { encoding: "utf8", mode });
    runTestHook("beforeAtomicReplace", { file, expected });
    if (expected) assertFingerprint(file, expected);
    fs.renameSync(temp, file);
    fs.chmodSync(file, mode);
    const written = fs.readFileSync(file);
    const expectedBytes = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    if (sha256(written) !== sha256(expectedBytes)) throw new Error(`BLOCKED_POST_WRITE_DRIFT: ${file}`);
  } finally {
    fs.rmSync(temp, { force: true });
  }
}
function atomicJson(file, value, expected = null) { atomicWrite(file, `${JSON.stringify(value, null, 2)}\n`, 0o600, expected); }
function parseJson(file, fallback) { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback; }
function pathsFor(codexHome, requirementsPath = "/etc/codex/requirements.toml") {
  const home = path.resolve(codexHome);
  if (!path.isAbsolute(codexHome) || home === path.parse(home).root) throw new Error("--codex-home must be an absolute non-root path");
  if (!path.isAbsolute(requirementsPath)) throw new Error("--managed-requirements must be an absolute path");
  return {
    home,
    requirements: path.resolve(requirementsPath),
    runtime: path.join(home, "hooks", "planning-with-files"),
    adapter: path.join(home, "hooks", "planning-with-files", "hook_adapter.py"),
    manifest: path.join(home, "hooks", "planning-with-files", "installed-manifest.json"),
    lock: path.join(home, ".pwf-codex-cloud-hooks.lock"),
    backups: path.join(home, "backups", "planning-with-files-hooks"),
  };
}
function sourceRuntimeFiles() {
  const managed = UPSTREAM.managed_runtime;
  if (!managed || managed.schema_version !== 1 || !Array.isArray(managed.files)) throw new Error("BLOCKED_PACKAGE_DRIFT: managed runtime manifest missing");
  const files = [{
    id: "adapter",
    relative: "hook_adapter.py",
    source: path.join(ROOT, "hooks", "hook_adapter.py"),
    expected: fileHash(path.join(ROOT, "hooks", "hook_adapter.py")),
    mode: 0o755,
  }];
  for (const item of managed.local_files || []) {
    const relative = path.posix.relative("runtime", item.package_path);
    if (!relative || relative.startsWith("../") || path.posix.isAbsolute(relative)) throw new Error(`BLOCKED_PACKAGE_DRIFT: invalid local runtime package path ${item.package_path}`);
    files.push({
      id: item.id,
      relative,
      source: path.join(ROOT, ...item.package_path.split("/")),
      expected: item.sha256,
      mode: Number.parseInt(item.mode, 8),
    });
  }
  for (const item of managed.files) {
    const relative = path.posix.relative("runtime", item.package_path);
    if (!relative || relative.startsWith("../") || path.posix.isAbsolute(relative)) throw new Error(`BLOCKED_PACKAGE_DRIFT: invalid runtime package path ${item.package_path}`);
    files.push({
      id: item.id,
      relative,
      source: path.join(ROOT, ...item.package_path.split("/")),
      expected: item.managed_sha256,
      mode: Number.parseInt(item.mode, 8),
    });
  }
  for (const [id, item] of Object.entries(managed.contracts || {})) {
    if (!item.installed_path) continue;
    const relative = path.posix.relative("hooks/planning-with-files", item.installed_path);
    if (!relative || relative.startsWith("../") || path.posix.isAbsolute(relative)) throw new Error(`BLOCKED_PACKAGE_DRIFT: invalid installed contract path ${item.installed_path}`);
    files.push({
      id,
      relative,
      source: path.join(ROOT, ...item.path.split("/")),
      expected: item.sha256,
      mode: 0o644,
    });
  }
  files.push({
    id: "compatibility_overlays",
    relative: "compatibility-overlays-v1.json",
    source: path.join(ROOT, managed.contracts.compatibility_overlays.path),
    expected: managed.contracts.compatibility_overlays.sha256,
    mode: 0o644,
  });
  files.push({
    id: "third_party_notices",
    relative: "THIRD_PARTY_NOTICES.md",
    source: path.join(ROOT, managed.license_provenance.notice_path),
    expected: managed.license_provenance.notice_sha256,
    mode: 0o644,
  });
  const seen = new Set();
  for (const file of files) {
    const normalized = file.relative.split(path.sep).join("/");
    if (seen.has(normalized) || normalized.startsWith("../") || path.posix.isAbsolute(normalized)) throw new Error(`BLOCKED_PACKAGE_DRIFT: duplicate or unsafe runtime path ${file.relative}`);
    if (!fs.existsSync(file.source) || fileHash(file.source) !== file.expected) throw new Error(`BLOCKED_PACKAGE_DRIFT: ${file.id}`);
    file.relative = normalized;
    seen.add(normalized);
  }
  return files;
}
function runtimeInventory() {
  return sourceRuntimeFiles().map(file => ({ id: file.id, path: file.relative, sha256: file.expected, mode: file.mode.toString(8).padStart(4, "0") }));
}
function writeRuntimeFiles(paths) {
  fs.mkdirSync(paths.runtime, { recursive: true, mode: 0o755 });
  fs.chmodSync(paths.runtime, 0o755);
  const directories = new Set(sourceRuntimeFiles().map(file => path.posix.dirname(file.relative)).filter(relative => relative !== "."));
  for (const relative of [...directories].sort((a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b))) {
    const directory = path.join(paths.runtime, ...relative.split("/"));
    fs.mkdirSync(directory, { recursive: true, mode: 0o755 });
    fs.chmodSync(directory, 0o755);
  }
  for (const file of sourceRuntimeFiles()) atomicWrite(path.join(paths.runtime, ...file.relative.split("/")), fs.readFileSync(file.source), file.mode);
}
function resolveSkill(explicit, codexHome) {
  const candidates = explicit ? [path.resolve(explicit)] : [
    path.join(os.homedir(), ".agents", "skills", "planning-with-files"),
    path.join(codexHome, "skills", "planning-with-files"),
    path.join(os.homedir(), ".codex", "skills", "planning-with-files"),
  ];
  const skill = candidates.find(p => fs.existsSync(path.join(p, "SKILL.md")));
  if (!skill) throw new Error("planning-with-files SKILL.md was not found in an approved global location");
  // The global Skill remains an independently installed, pristine upstream
  // package. Managed Hooks no longer patch or execute its catch-up script.
  const requiredFiles = UPSTREAM.required_skill_files;
  for (const [relative, expected] of Object.entries(requiredFiles)) {
    const file = path.join(skill, relative);
    if (!fs.existsSync(file) || fileHash(file) !== expected) throw new Error(`BLOCKED_UPSTREAM_OR_INSTALL_DRIFT: ${relative}`);
  }
  return skill;
}
function tomlLines(text) {
  const records = String(text || "").match(/[^\n]*(?:\n|$)/g) || [];
  if (records.at(-1) === "") records.pop();
  return records.map(raw => ({ raw, body: raw.replace(/\n$/, "").replace(/\r$/, "") }));
}

function tomlHeader(line) {
  const value = String(line).trimStart();
  if (!value.startsWith("[")) return null;
  const array = value.startsWith("[[");
  const open = array ? 2 : 1;
  let quote = null, escaped = false, close = -1;
  for (let i = open; i < value.length; i++) {
    const character = value[i];
    if (quote === '"') {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') quote = null;
      continue;
    }
    if (quote === "'") {
      if (character === "'") quote = null;
      continue;
    }
    if (character === '"' || character === "'") { quote = character; continue; }
    if (array ? value.startsWith("]]", i) : character === "]") { close = i; break; }
  }
  if (close < 0 || quote !== null) return { invalid: true };
  const tail = value.slice(close + (array ? 2 : 1)).trimStart();
  const inner = value.slice(open, close).trim();
  if (!inner || (tail && !tail.startsWith("#"))) return { invalid: true };
  return { invalid: false, array, inner };
}

function blockedRequirements(message) {
  throw new Error(`BLOCKED_AMBIGUOUS_MANAGED_REQUIREMENTS: ${message}`);
}

function validateOwnedSections(records, headerPositions) {
  const expected = [
    ["hooks.SessionStart", new Set(["matcher"])],
    ["hooks.SessionStart.hooks", new Set(["type", "command", "timeout", "statusMessage"])],
    ["hooks.UserPromptSubmit", new Set()],
    ["hooks.UserPromptSubmit.hooks", new Set(["type", "command", "timeout", "statusMessage"])],
  ];
  if (headerPositions.length !== expected.length) blockedRequirements("owned header count is invalid");
  for (let index = 0; index < expected.length; index++) {
    const position = headerPositions[index], header = tomlHeader(records[position].body);
    if (!header || header.invalid || !header.array || header.inner !== expected[index][0]) blockedRequirements("owned header sequence is invalid");
    const end = index + 1 < headerPositions.length ? headerPositions[index + 1] : records.length;
    const found = new Map();
    for (let lineIndex = position + 1; lineIndex < end; lineIndex++) {
      const body = records[lineIndex].body;
      if (!body.trim() || body.trimStart().startsWith("#")) continue;
      if (tomlHeader(body)) blockedRequirements("unexpected header inside owned section");
      const key = body.match(/^\s*([A-Za-z_][A-Za-z0-9_-]*)\s*=/)?.[1];
      if (!key || !expected[index][1].has(key) || found.has(key)) blockedRequirements("unknown or duplicate owned key");
      found.set(key, body);
    }
    if (found.size !== expected[index][1].size) blockedRequirements("owned keys are incomplete");
    if (found.has("type") && !/^\s*type\s*=\s*(["'])command\1\s*(?:#.*)?$/.test(found.get("type"))) blockedRequirements("owned handler type is invalid");
    if (found.has("command")) {
      const event = index === 1 ? "SessionStart" : "UserPromptSubmit";
      const command = found.get("command");
      if (!command.includes(MANAGED_PYTHON) || !command.includes(OWNED_SEGMENT) || !command.includes(event)) blockedRequirements("owned command identity is invalid");
    }
  }
}

function removeMarkedRequirements(records) {
  const begins = [], ends = [];
  records.forEach((line, index) => {
    if (line.body.trim() === REQUIREMENTS_BEGIN) begins.push(index);
    if (line.body.trim() === REQUIREMENTS_END) ends.push(index);
  });
  if (!begins.length && !ends.length) return null;
  if (begins.length !== 1 || ends.length !== 1 || begins[0] >= ends[0]) blockedRequirements("ownership markers are not uniquely paired");
  const begin = begins[0], end = ends[0], headerPositions = [];
  for (let index = begin + 1; index < end; index++) {
    const header = tomlHeader(records[index].body);
    if (header?.invalid) blockedRequirements("malformed TOML header in owned region");
    if (header) headerPositions.push(index);
  }
  const region = records.slice(begin + 1, end);
  validateOwnedSections(region, headerPositions.map(position => position - begin - 1));
  return records.slice(0, begin).concat(records.slice(end + 1)).map(line => line.raw).join("");
}

function removeOwnedRequirements(text) {
  const records = tomlLines(text);
  const marked = removeMarkedRequirements(records);
  if (marked !== null) return marked;
  if (records.some(line => line.body.includes(OWNED_SEGMENT))) {
    blockedRequirements("unmarked owned handlers are unsupported");
  }
  return records.map(line => line.raw).join("");
}

function setTableKey(text, table, key, value) {
  const lines = String(text || "").split("\n"), header = `[${table}]`;
  let start = lines.findIndex(line => line.trim() === header);
  if (start < 0) {
    const prefix = lines.join("\n").trimEnd();
    return `${prefix}${prefix ? "\n\n" : ""}${header}\n${key} = ${value}\n`;
  }
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) if (/^\s*\[/.test(lines[i])) { end = i; break; }
  const keyPattern = new RegExp(`^\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*=`);
  const index = lines.slice(start + 1, end).findIndex(line => keyPattern.test(line));
  if (index >= 0) lines[start + 1 + index] = `${key} = ${value}`;
  else lines.splice(start + 1, 0, `${key} = ${value}`);
  return `${lines.join("\n").trimEnd()}\n`;
}

function tableStringValue(text, table, key) {
  const lines = String(text || "").split("\n");
  const start = lines.findIndex(line => line.trim() === `[${table}]`);
  if (start < 0) return null;
  for (let i = start + 1; i < lines.length && !/^\s*\[/.test(lines[i]); i++) {
    const match = lines[i].match(new RegExp(`^\\s*${key}\\s*=\\s*(["'])(.*?)\\1\\s*(?:#.*)?$`));
    if (match) return match[2];
  }
  return null;
}

function pathContains(directory, file) {
  const relative = path.relative(path.resolve(directory), path.resolve(file));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function managedRequirements(text, paths) {
  let result = removeOwnedRequirements(text);
  const existingManagedDir = tableStringValue(result, "hooks", "managed_dir");
  if (existingManagedDir && !pathContains(existingManagedDir, paths.adapter)) throw new Error(`existing hooks.managed_dir does not contain adapter: ${existingManagedDir}`);
  result = setTableKey(result, "features", "hooks", "true");
  if (!existingManagedDir) result = setTableKey(result, "hooks", "managed_dir", JSON.stringify(commandPath(paths.runtime)));
  const command = event => `${MANAGED_PYTHON} ${quoteCommand(commandPath(paths.adapter))} ${event}`;
  const blocks = [
    `[[hooks.SessionStart]]\nmatcher = "startup|resume|clear|compact"\n\n[[hooks.SessionStart.hooks]]\ntype = "command"\ncommand = ${JSON.stringify(command("SessionStart"))}\ntimeout = 30\nstatusMessage = "Loading planning context"`,
    `[[hooks.UserPromptSubmit]]\n\n[[hooks.UserPromptSubmit.hooks]]\ntype = "command"\ncommand = ${JSON.stringify(command("UserPromptSubmit"))}\ntimeout = 30\nstatusMessage = "Refreshing planning context"`,
  ];
  return `${result.trimEnd()}\n\n${REQUIREMENTS_BEGIN}\n${blocks.join("\n\n")}\n${REQUIREMENTS_END}\n`;
}
function acquire(paths, operation) {
  fs.mkdirSync(paths.home, { recursive: true, mode: 0o700 });
  fs.mkdirSync(paths.lock, { mode: 0o700 });
  runTestHook("afterAcquire", { operation, paths });
  return () => fs.rmSync(paths.lock, { recursive: true, force: true });
}
function timestamp() { return new Date().toISOString().replace(/[:.]/g, "-"); }
function captureSharedState(paths) {
  return new Map([paths.requirements, paths.manifest].map(file => [file, statFingerprint(file)]));
}
function capturedText(captures, file) {
  const captured = captures.get(file);
  return captured?.exists ? captured.bytes.toString("utf8") : "";
}
function assertSharedState(captures) {
  for (const [file, expected] of captures) assertFingerprint(file, expected);
}
function backup(paths, captures) {
  const dir = path.join(paths.backups, timestamp()); fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  for (const file of [paths.requirements]) {
    const captured = captures.get(file);
    if (!captured?.exists) continue;
    const destination = path.join(dir, "system-requirements.toml");
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, captured.bytes);
  }
  if (fs.existsSync(paths.runtime)) {
    const destination = path.join(dir, path.relative(paths.home, paths.runtime));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(paths.runtime, destination, { recursive: true, force: true });
    const manifest = captures.get(paths.manifest);
    if (manifest?.exists) fs.writeFileSync(path.join(destination, path.basename(paths.manifest)), manifest.bytes);
  }
  return dir;
}
function buildManifest(paths, skill, requirements) {
  return {
    schema_version: MANIFEST_SCHEMA,
    owner: OWNER,
    installer_version: VERSION,
    upstream: UPSTREAM,
    skill_root: skill,
    adapter_sha256: fileHash(path.join(ROOT, "hooks", "hook_adapter.py")),
    runtime_files: runtimeInventory(),
    requirements_file: paths.requirements,
    requirements_sha256: sha256(requirements),
    unowned_requirements_sha256: sha256(removeOwnedRequirements(requirements)),
    events: EVENTS,
  };
}
function readManifest(paths) {
  if (!fs.existsSync(paths.manifest)) return { manifest: null, error: "installed manifest missing" };
  try { return { manifest: parseJson(paths.manifest, null), error: null }; }
  catch { return { manifest: null, error: "installed manifest is invalid JSON" }; }
}
function inspectInstallation(paths, skill) {
  const errors = [], blockers = [];
  const add = (message, repairable = false) => { errors.push(message); if (!repairable) blockers.push(message); };
  const sourceAdapterHash = fileHash(path.join(ROOT, "hooks", "hook_adapter.py"));
  const adapterExists = fs.existsSync(paths.adapter);
  const requirementsExists = fs.existsSync(paths.requirements);
  const requirements = requirementsExists ? fs.readFileSync(paths.requirements, "utf8") : "";
  const { manifest, error: manifestError } = readManifest(paths);

  if (manifestError) add(manifestError);
  if (manifest) {
    if (manifest.schema_version !== MANIFEST_SCHEMA) add(`manifest schema ${manifest.schema_version}, expected ${MANIFEST_SCHEMA}`);
    if (manifest.owner !== OWNER) add("manifest owner mismatch");
    if (manifest.installer_version !== VERSION) add("manifest installer version mismatch");
    if (canonical(manifest.upstream) !== canonical(UPSTREAM)) add("manifest upstream mismatch");
    if (manifest.skill_root !== skill) add("manifest skill root mismatch");
    if (manifest.requirements_file !== paths.requirements) add("managed requirements path drift");
    if (canonical(manifest.events) !== canonical(EVENTS)) add("manifest events mismatch");
    if (manifest.adapter_sha256 !== sourceAdapterHash) add("manifest adapter hash mismatch");
    if (canonical(manifest.runtime_files) !== canonical(runtimeInventory())) add("manifest runtime inventory mismatch");
  }

  if (!requirementsExists) add("managed requirements missing");
  if (requirementsExists && manifest) {
    let baseHash = null;
    try { baseHash = sha256(removeOwnedRequirements(requirements)); }
    catch (error) {
      if (!String(error.message).startsWith("BLOCKED_AMBIGUOUS_MANAGED_REQUIREMENTS:")) throw error;
      add(error.message);
    }
    if (baseHash !== null) {
      if (baseHash !== manifest.unowned_requirements_sha256) add("unowned managed requirements drift");
      if (sha256(requirements) !== manifest.requirements_sha256) add("owned managed requirements drift", baseHash === manifest.unowned_requirements_sha256);
    }
  }
  if (requirementsExists) {
    if (!/^\s*hooks\s*=\s*true\s*(?:#.*)?$/m.test(requirements)) add("managed features.hooks is not true", Boolean(manifest));
    const managedDir = tableStringValue(requirements, "hooks", "managed_dir");
    if (!managedDir || !pathContains(managedDir, paths.adapter)) add("hooks.managed_dir does not contain adapter");
    for (const event of EVENTS) {
      const command = `${MANAGED_PYTHON} ${quoteCommand(commandPath(paths.adapter))} ${event}`;
      if (requirements.split(`command = ${JSON.stringify(command)}`).length - 1 !== 1) add(`managed ${event} handler count is not 1`, Boolean(manifest));
    }
  }

  const expectedFiles = new Map(sourceRuntimeFiles().map(file => [file.relative, file]));
  const expectedDirectories = new Set();
  for (const relative of expectedFiles.keys()) {
    let parent = path.posix.dirname(relative);
    while (parent !== ".") { expectedDirectories.add(parent); parent = path.posix.dirname(parent); }
  }
  const actualFiles = new Set(), actualDirectories = new Set(), unsafe = [];
  for (const component of [path.join(paths.home, "hooks"), paths.runtime]) {
    try {
      if (fs.lstatSync(component).isSymbolicLink()) unsafe.push(path.relative(paths.runtime, component) || ".");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  function walk(directory, prefix = "") {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const target = path.join(directory, entry.name);
      const info = fs.lstatSync(target);
      if (info.isSymbolicLink()) unsafe.push(relative);
      else if (info.isDirectory()) { actualDirectories.add(relative); walk(target, relative); }
      else if (info.isFile()) actualFiles.add(relative);
      else unsafe.push(relative);
    }
  }
  if (!unsafe.length) walk(paths.runtime);
  const allowedFiles = new Set([...expectedFiles.keys(), path.basename(paths.manifest)]);
  const unknown = [
    ...unsafe,
    ...[...actualFiles].filter(item => !allowedFiles.has(item)),
    ...[...actualDirectories].filter(item => !expectedDirectories.has(item)),
  ].sort();
  if (unknown.length) add(`unknown runtime entries: ${unknown.join(", ")}`);
  if (process.platform !== "win32" && actualDirectories.size) {
    try {
      if ((fs.statSync(paths.runtime).mode & 0o777) !== 0o755) add("runtime directory mode drift", Boolean(manifest));
      for (const relative of expectedDirectories) {
        const target = path.join(paths.runtime, ...relative.split("/"));
        if (actualDirectories.has(relative) && (fs.statSync(target).mode & 0o777) !== 0o755) {
          add(`${relative} directory mode drift`, Boolean(manifest));
        }
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  for (const [relative, expected] of expectedFiles) {
    const target = path.join(paths.runtime, ...relative.split("/"));
    if (!actualFiles.has(relative)) add(`${expected.id} missing`, Boolean(manifest));
    else {
      if (fileHash(target) !== expected.expected) add(`${expected.id} hash drift`, Boolean(manifest));
      if (process.platform !== "win32" && (fs.statSync(target).mode & 0o777) !== expected.mode) add(`${expected.id} mode drift`, Boolean(manifest));
    }
  }
  return { errors, blockers, manifest, requirements, healthy: errors.length === 0, repairable: errors.length > 0 && blockers.length === 0 };
}
function assertSafeRuntimeForInstall(paths) {
  if (!fs.existsSync(paths.runtime)) return;
  for (const component of [path.join(paths.home, "hooks"), paths.runtime]) {
    if (fs.lstatSync(component).isSymbolicLink()) throw new Error(`BLOCKED_UNKNOWN_RUNTIME: symlinked path ${component}`);
  }
  const entries = [];
  function walk(directory, prefix = "") {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const target = path.join(directory, entry.name);
      const info = fs.lstatSync(target);
      if (info.isSymbolicLink() || (!info.isDirectory() && !info.isFile())) throw new Error(`BLOCKED_UNKNOWN_RUNTIME: unsafe entry ${relative}`);
      entries.push({ relative, directory: info.isDirectory() });
      if (info.isDirectory()) walk(target, relative);
    }
  }
  walk(paths.runtime);
  if (!entries.length) return;
  const { manifest, error } = readManifest(paths);
  if (error) throw new Error(`BLOCKED_UNKNOWN_RUNTIME: ${error}`);
  if (manifest.schema_version !== MANIFEST_SCHEMA || manifest.owner !== OWNER) {
    throw new Error("BLOCKED_UNKNOWN_RUNTIME: installed manifest identity mismatch");
  }
  const allowedFiles = new Set(sourceRuntimeFiles().map(file => file.relative));
  allowedFiles.add(path.basename(paths.manifest));
  const allowedDirectories = new Set();
  for (const relative of allowedFiles) {
    let parent = path.posix.dirname(relative);
    while (parent !== ".") { allowedDirectories.add(parent); parent = path.posix.dirname(parent); }
  }
  const unknown = entries.filter(entry => entry.directory ? !allowedDirectories.has(entry.relative) : !allowedFiles.has(entry.relative)).map(entry => entry.relative).sort();
  if (unknown.length) throw new Error(`BLOCKED_UNKNOWN_RUNTIME: ${unknown.join(", ")}`);
}
function install(options) {
  const paths = pathsFor(options.codexHome, options.managedRequirements), skill = resolveSkill(options.skillRoot, paths.home);
  if (!fs.existsSync(MANAGED_PYTHON)) throw new Error(`managed Hook interpreter not found: ${MANAGED_PYTHON}`);
  if (options.repair) return repair({ ...options, paths, skill });
  if (options.dryRun) {
    const currentRequirements = fs.existsSync(paths.requirements) ? fs.readFileSync(paths.requirements, "utf8") : "";
    const proposedRequirements = managedRequirements(currentRequirements, paths);
    return { action: "dry-run", codex_home: paths.home, skill_root: skill, requirements_file: paths.requirements, events: EVENTS, changed: proposedRequirements !== currentRequirements };
  }
  const release = acquire(paths, "install"); try {
    const captures = captureSharedState(paths);
    const currentRequirements = capturedText(captures, paths.requirements);
    const proposedRequirements = managedRequirements(currentRequirements, paths);
    assertSafeRuntimeForInstall(paths);
    const backupDir = backup(paths, captures);
    assertSharedState(captures);
    writeRuntimeFiles(paths);
    atomicWrite(paths.requirements, proposedRequirements, 0o644, captures.get(paths.requirements));
    atomicJson(paths.manifest, buildManifest(paths, skill, proposedRequirements), captures.get(paths.manifest));
    const inspected = inspectInstallation(paths, skill);
    const checked = doctorResult(paths, skill, inspected);
    return { ...checked, action: "install", backup: backupDir };
  } finally { release(); }
}
function repair(options) {
  const { paths, skill } = options;
  if (options.dryRun) {
    const before = inspectInstallation(paths, skill);
    if (before.healthy) return { action: "repair-dry-run", healthy: true, changed: false, repairable: false, codex_home: paths.home, skill_root: skill, requirements_file: paths.requirements, events: EVENTS, errors: [] };
    if (!before.repairable) throw new Error(`REPAIR_BLOCKED_UNKNOWN_DRIFT: ${before.blockers.join("; ")}`);
    const repairedRequirements = managedRequirements(removeOwnedRequirements(before.requirements), paths);
    if (sha256(repairedRequirements) !== before.manifest.requirements_sha256) throw new Error("REPAIR_BLOCKED_UNKNOWN_DRIFT: reconstructed requirements do not match manifest");
    return { action: "repair-dry-run", healthy: false, changed: true, repairable: true, codex_home: paths.home, skill_root: skill, requirements_file: paths.requirements, events: EVENTS, errors: before.errors };
  }
  const release = acquire(paths, "repair"); try {
    const captures = captureSharedState(paths);
    const before = inspectInstallation(paths, skill);
    assertSharedState(captures);
    if (before.healthy) return { action: "repair", healthy: true, changed: false, repairable: false, codex_home: paths.home, skill_root: skill, requirements_file: paths.requirements, events: EVENTS, errors: [] };
    if (!before.repairable) throw new Error(`REPAIR_BLOCKED_UNKNOWN_DRIFT: ${before.blockers.join("; ")}`);
    if (capturedText(captures, paths.requirements) !== before.requirements) throw new Error(`BLOCKED_CONCURRENT_DRIFT: ${paths.requirements}`);
    const repairedRequirements = managedRequirements(removeOwnedRequirements(before.requirements), paths);
    if (sha256(repairedRequirements) !== before.manifest.requirements_sha256) throw new Error("REPAIR_BLOCKED_UNKNOWN_DRIFT: reconstructed requirements do not match manifest");
    const backupDir = backup(paths, captures);
    assertSharedState(captures);
    writeRuntimeFiles(paths);
    atomicWrite(paths.requirements, repairedRequirements, 0o644, captures.get(paths.requirements));
    const inspected = inspectInstallation(paths, skill);
    const checked = doctorResult(paths, skill, inspected);
    return { ...checked, action: "repair", changed: true, backup: backupDir };
  } finally { release(); }
}
function doctorResult(paths, skill, inspected) {
  return { action: "doctor", healthy: inspected.healthy, repairable: inspected.repairable, codex_home: paths.home, skill_root: skill, requirements_file: paths.requirements, managed: true, events: EVENTS, errors: inspected.errors, blockers: inspected.blockers };
}
function doctor(options) {
  const paths = pathsFor(options.codexHome, options.managedRequirements), skill = resolveSkill(options.skillRoot, paths.home);
  const captures = captureSharedState(paths);
  const inspected = inspectInstallation(paths, skill);
  try { assertSharedState(captures); }
  catch (error) {
    inspected.errors.push(error.message);
    inspected.blockers.push(error.message);
    inspected.healthy = false;
    inspected.repairable = false;
  }
  return doctorResult(paths, skill, inspected);
}
function uninstall(options) {
  const paths = pathsFor(options.codexHome, options.managedRequirements), release = acquire(paths, "uninstall"); try {
    const captures = captureSharedState(paths);
    const backupDir = backup(paths, captures);
    assertSharedState(captures);
    if (captures.get(paths.requirements).exists) {
      const cleaned = removeOwnedRequirements(capturedText(captures, paths.requirements));
      atomicWrite(paths.requirements, `${cleaned.trimEnd()}\n`, 0o644, captures.get(paths.requirements));
    }
    fs.rmSync(paths.runtime, { recursive: true, force: true });
    return { action: "uninstall", codex_home: paths.home, requirements_file: paths.requirements, backup: backupDir, healthy: true };
  } finally { release(); }
}
function parseArgs(argv) {
  const command = argv[0], options = { json: false, dryRun: false, repair: false, codexHome: process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), managedRequirements: "/etc/codex/requirements.toml" };
  if (!new Set(["install", "doctor", "uninstall"]).has(command)) throw new Error("usage: install.js <install|doctor|uninstall> [--repair] [--codex-home PATH] [--skill-root PATH] [--managed-requirements PATH] [--dry-run] [--json]");
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === "--json") options.json = true;
    else if (argv[i] === "--dry-run") options.dryRun = true;
    else if (argv[i] === "--repair") options.repair = true;
    else if (argv[i] === "--codex-home") options.codexHome = argv[++i];
    else if (argv[i] === "--skill-root") options.skillRoot = argv[++i];
    else if (argv[i] === "--managed-requirements") options.managedRequirements = argv[++i];
    else throw new Error(`unknown argument: ${argv[i]}`);
  }
  if (options.repair && command !== "install") throw new Error("--repair is valid only with install");
  return { command, options };
}
function main() {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const result = command === "install" ? install(options) : command === "doctor" ? doctor(options) : uninstall(options);
    console.log(options.json ? JSON.stringify(result) : JSON.stringify(result, null, 2));
    if (result.healthy === false) process.exitCode = 1;
  } catch (error) { console.error(JSON.stringify({ healthy: false, error: error.message })); process.exitCode = 1; }
}
if (require.main === module) main();
module.exports = { canonical, install, managedRequirements, removeOwnedRequirements, pathsFor, setTableKey, setTestHooks };
