#!/usr/bin/env bash

set -Eeuo pipefail

#######################################
# Configuration
#######################################

: "${HOME:?HOME must be set}"

# Deployment locations and downloadable assets can be overridden before execution.
# Safety minimums and required-file hashes remain fixed in this script.
# Defaults target the Codex Cloud Debian/Ubuntu sandbox.
export CODEX_HOME="${CODEX_HOME:-/opt/codex}"

readonly MANAGED_REQUIREMENTS="${MANAGED_REQUIREMENTS:-/etc/codex/requirements.toml}"

readonly MINIMUM_NODE_MAJOR=18

readonly PLANNING_WITH_FILES_VERSION="${PLANNING_WITH_FILES_VERSION:-v3.8.2}"
readonly PLANNING_WITH_FILES_ROOT="${PLANNING_WITH_FILES_ROOT:-$HOME/.agents/skills/planning-with-files}"
readonly PLANNING_WITH_FILES_ARCHIVE_URL="${PLANNING_WITH_FILES_ARCHIVE_URL:-https://github.com/OthmanAdi/planning-with-files/archive/refs/tags/v3.8.2.zip}"
readonly PLANNING_WITH_FILES_ARCHIVE_SHA256="${PLANNING_WITH_FILES_ARCHIVE_SHA256:-7dab03ae283da38d33b9d551c7ec621d1818b9f0f17cf9ced566d4accbfc6dd1}"
readonly PLANNING_WITH_FILES_ARCHIVE_ROOT="${PLANNING_WITH_FILES_ARCHIVE_ROOT:-planning-with-files-3.8.2}"
readonly PLANNING_WITH_FILES_SOURCE_PATH="${PLANNING_WITH_FILES_SOURCE_PATH:-skills/planning-with-files}"
readonly PLANNING_WITH_FILES_SKILL_MD_SHA256="bfcdbbbf883bc0db95f84d095d58021fc1a6b97eeeab23cd373f6261779fb232"
readonly PLANNING_WITH_FILES_RESOLVER_SHA256="38a1c5effb35f9506e2e371ccabb6be6e4f4170acc18f1811f08d634f5f0e9bd"
readonly PLANNING_WITH_FILES_CATCHUP_SHA256="6476fd9024d0cbb9bfb850119fd0beff7fb7cfab9c6683ce10e4cc8d830ce6de"

readonly POWERSHELL_VERSION="${POWERSHELL_VERSION:-7.5.9}"
readonly POWERSHELL_PACKAGE="${POWERSHELL_PACKAGE:-powershell_${POWERSHELL_VERSION}-1.deb_amd64.deb}"
readonly POWERSHELL_URL="${POWERSHELL_URL:-https://github.com/PowerShell/PowerShell/releases/download/v${POWERSHELL_VERSION}/${POWERSHELL_PACKAGE}}"
readonly POWERSHELL_SHA256="${POWERSHELL_SHA256:-1d551a739ac5db6957ca9d71bd2e332a7b688e85ea5fb43c73fd42395042ef94}"

readonly HOOKS_VERSION="${HOOKS_VERSION:-v0.3.4-dev}"
readonly HOOKS_PACKAGE="${HOOKS_PACKAGE:-pwf-codex-cloud-hooks-${HOOKS_VERSION}.zip}"
readonly HOOKS_ARCHIVE_ROOT="${HOOKS_ARCHIVE_ROOT:-pwf-codex-cloud-hooks}"
readonly HOOKS_URL="${HOOKS_URL:-https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/${HOOKS_VERSION}/${HOOKS_PACKAGE}}"
readonly HOOKS_SHA256="${HOOKS_SHA256:-0000000000000000000000000000000000000000000000000000000000000000}"

# Mutable state is limited to disposable workspace and the bounded Skill replacement transaction.
WORK_DIR=""
SKILL_TRANSACTION_ACTIVE=0
SKILL_HAD_ORIGINAL=0
SKILL_TRANSACTION_TARGET=""
SKILL_STAGE=""
SKILL_BACKUP=""

#######################################
# Common utilities
#######################################

log() {
  printf '\n==> %s\n' "$*"
}

die() {
  printf '\nError: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 ||
    die "Required command not found: $1"
}

download_file() {
  local url="$1"
  local destination="$2"

  require_command curl

  curl \
    --fail \
    --silent \
    --show-error \
    --location \
    --retry 3 \
    --retry-delay 2 \
    --output "$destination" \
    "$url"
}

verify_sha256() {
  local expected_sha256="$1"
  local file="$2"

  require_command sha256sum

  printf '%s  %s\n' "$expected_sha256" "$file" |
    sha256sum --check --status - ||
    die "SHA-256 verification failed: $file"
}

ensure_work_dir() {
  [ -n "$WORK_DIR" ] && return

  require_command mktemp
  WORK_DIR="$(mktemp -d)"
  trap cleanup EXIT
}

cleanup_skill_transaction() {
  if [ "$SKILL_TRANSACTION_ACTIVE" -eq 1 ]; then
    if [ "$SKILL_HAD_ORIGINAL" -eq 1 ] &&
      [ -n "$SKILL_BACKUP" ] && { [ -e "$SKILL_BACKUP" ] || [ -L "$SKILL_BACKUP" ]; }; then
      if [ -n "$SKILL_TRANSACTION_TARGET" ] && { [ -e "$SKILL_TRANSACTION_TARGET" ] || [ -L "$SKILL_TRANSACTION_TARGET" ]; }; then
        rm -rf -- "$SKILL_TRANSACTION_TARGET"
      fi
      mv -- "$SKILL_BACKUP" "$SKILL_TRANSACTION_TARGET" || true
    elif [ "$SKILL_HAD_ORIGINAL" -eq 0 ] &&
      [ -n "$SKILL_TRANSACTION_TARGET" ] && { [ -e "$SKILL_TRANSACTION_TARGET" ] || [ -L "$SKILL_TRANSACTION_TARGET" ]; }; then
      rm -rf -- "$SKILL_TRANSACTION_TARGET"
    fi
  fi
  if [ -n "$SKILL_STAGE" ] && [ -d "$SKILL_STAGE" ]; then
    rm -rf -- "$SKILL_STAGE"
  fi
}

cleanup_work_dir() {
  [ -n "$WORK_DIR" ] || return 0
  [ -d "$WORK_DIR" ] || return 0

  rm -rf -- "$WORK_DIR"
}

cleanup() {
  cleanup_skill_transaction
  cleanup_work_dir
}

#######################################
# Environment contracts
#######################################

require_root() {
  [ "$(id -u)" -eq 0 ] ||
    die "This component must run as root."
}

require_debian() {
  [ -f /etc/debian_version ] ||
    die "This component currently supports Debian/Ubuntu only."
}

require_amd64() {
  local architecture

  require_command dpkg
  architecture="$(dpkg --print-architecture)"

  [ "$architecture" = "amd64" ] ||
    die "The PowerShell package requires amd64; detected: $architecture"
}

require_codex_runtime() {
  [ -d "$CODEX_HOME" ] ||
    die "Codex Cloud home does not exist: $CODEX_HOME"

  [ -x "$CODEX_HOME/bin/codex" ] ||
    die "Codex executable was not found: $CODEX_HOME/bin/codex"
}

print_environment() {
  local architecture="unknown"

  if command -v dpkg >/dev/null 2>&1; then
    architecture="$(dpkg --print-architecture)"
  fi

  log "Detected Codex Cloud Runtime"

  printf '%s\n' \
    "HOME=$HOME" \
    "CODEX_HOME=$CODEX_HOME" \
    "Codex=$("$CODEX_HOME/bin/codex" --version)" \
    "Architecture=$architecture"
}

#######################################
# Component: system prerequisites
#######################################

install_system_prerequisites() {
  require_command apt-get

  log "Updating APT package metadata"
  env DEBIAN_FRONTEND=noninteractive apt-get update

  log "Installing system prerequisites"
  env DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
      ca-certificates \
      curl \
      unzip

  require_command curl
  require_command unzip
}

#######################################
# Component: PowerShell
#######################################

install_powershell() {
  local package_file="$1"

  require_command apt-get

  log "Downloading PowerShell ${POWERSHELL_VERSION}"
  download_file "$POWERSHELL_URL" "$package_file"

  log "Verifying PowerShell package"
  verify_sha256 "$POWERSHELL_SHA256" "$package_file"

  log "Installing PowerShell ${POWERSHELL_VERSION}"
  env DEBIAN_FRONTEND=noninteractive apt-get install -y "$package_file"

  require_command pwsh
  log "PowerShell installed"
  pwsh --version
}

#######################################
# Component: platform Node.js
#######################################

verify_node_toolchain() {
  local node_version
  local node_major

  require_command node
  node_version="$(node --version 2>/dev/null)" ||
    die "Unable to query the platform-provided Node.js version."

  if [[ ! "$node_version" =~ ^v?([0-9]+)\.[0-9]+\.[0-9]+([+-][0-9A-Za-z.-]+)?$ ]]; then
    die "Unable to parse Node.js version: $node_version"
  fi

  node_major="${BASH_REMATCH[1]}"
  if (( 10#$node_major < MINIMUM_NODE_MAJOR )); then
    die "Node.js 18 or newer is required; detected: $node_version"
  fi

  log "Using platform-provided Node.js"
  printf 'Node.js=%s\n' "$node_version"
}

#######################################
# Component: planning-with-files Skill
#######################################

verify_planning_skill_at() {
  local skill_root="$1"

  [ -d "$skill_root" ] && [ ! -L "$skill_root" ] ||
    die "planning-with-files is not a regular directory: $skill_root"

  verify_sha256 "$PLANNING_WITH_FILES_SKILL_MD_SHA256" "$skill_root/SKILL.md"
  verify_sha256 "$PLANNING_WITH_FILES_RESOLVER_SHA256" "$skill_root/scripts/resolve-plan-dir.sh"
  verify_sha256 "$PLANNING_WITH_FILES_CATCHUP_SHA256" "$skill_root/scripts/session-catchup.py"
}

verify_planning_skill() {
  verify_planning_skill_at "$PLANNING_WITH_FILES_ROOT"
}

validate_planning_skill_destination() {
  case "$PLANNING_WITH_FILES_ROOT" in
    /*) ;;
    *) die "PLANNING_WITH_FILES_ROOT must be absolute: $PLANNING_WITH_FILES_ROOT" ;;
  esac

  [ "$PLANNING_WITH_FILES_ROOT" != "/" ] &&
    [ "$PLANNING_WITH_FILES_ROOT" != "$HOME" ] &&
    [ "${PLANNING_WITH_FILES_ROOT##*/}" = "planning-with-files" ] ||
    die "Refusing unsafe planning-with-files destination: $PLANNING_WITH_FILES_ROOT"

  [ ! -L "$PLANNING_WITH_FILES_ROOT" ] ||
    die "Refusing symlink planning-with-files destination: $PLANNING_WITH_FILES_ROOT"

  if [ -e "$PLANNING_WITH_FILES_ROOT" ] && [ ! -d "$PLANNING_WITH_FILES_ROOT" ]; then
    die "planning-with-files destination is not a directory: $PLANNING_WITH_FILES_ROOT"
  fi
}

extract_planning_skill() {
  local archive_file="$1"
  local extract_dir="$2"
  local source_root="$extract_dir/$PLANNING_WITH_FILES_ARCHIVE_ROOT/$PLANNING_WITH_FILES_SOURCE_PATH"

  require_command unzip
  require_command find
  mkdir -p "$extract_dir"

  log "Extracting planning-with-files ${PLANNING_WITH_FILES_VERSION}" >&2
  unzip -q "$archive_file" -d "$extract_dir"

  [ -d "$source_root" ] && [ ! -L "$source_root" ] ||
    die "Pinned archive Skill subtree was not found: $source_root"

  if find "$source_root" -type l -print -quit | grep -q .; then
    die "Pinned archive Skill subtree contains a symlink."
  fi

  printf '%s\n' "$source_root"
}

replace_planning_skill() {
  local source_root="$1"
  local destination_parent="${PLANNING_WITH_FILES_ROOT%/*}"

  validate_planning_skill_destination
  require_command cp
  require_command mv
  require_command rm
  require_command mktemp

  mkdir -p "$destination_parent"
  SKILL_TRANSACTION_TARGET="$PLANNING_WITH_FILES_ROOT"
  SKILL_STAGE="$(mktemp -d "$destination_parent/.planning-with-files.stage.XXXXXX")"
  cp -a -- "$source_root/." "$SKILL_STAGE/"
  verify_planning_skill_at "$SKILL_STAGE"

  if [ -e "$PLANNING_WITH_FILES_ROOT" ]; then
    SKILL_HAD_ORIGINAL=1
    SKILL_BACKUP="$(mktemp -d "$destination_parent/.planning-with-files.backup.XXXXXX")"
    rmdir -- "$SKILL_BACKUP"
  else
    SKILL_HAD_ORIGINAL=0
  fi

  SKILL_TRANSACTION_ACTIVE=1
  if [ "$SKILL_HAD_ORIGINAL" -eq 1 ]; then
    mv -- "$PLANNING_WITH_FILES_ROOT" "$SKILL_BACKUP"
  fi

  mv -- "$SKILL_STAGE" "$PLANNING_WITH_FILES_ROOT"
  SKILL_STAGE=""
  verify_planning_skill

  if [ -n "$SKILL_BACKUP" ]; then
    rm -rf -- "$SKILL_BACKUP"
    SKILL_BACKUP=""
  fi
  SKILL_TRANSACTION_ACTIVE=0
  SKILL_HAD_ORIGINAL=0
  SKILL_TRANSACTION_TARGET=""
}

install_planning_skill() {
  local archive_file
  local extract_dir
  local source_root

  ensure_work_dir
  archive_file="$WORK_DIR/planning-with-files-${PLANNING_WITH_FILES_VERSION}.zip"
  extract_dir="$WORK_DIR/planning-with-files-extract"

  log "Downloading planning-with-files ${PLANNING_WITH_FILES_VERSION}"
  download_file "$PLANNING_WITH_FILES_ARCHIVE_URL" "$archive_file"

  log "Verifying planning-with-files archive"
  verify_sha256 "$PLANNING_WITH_FILES_ARCHIVE_SHA256" "$archive_file"

  source_root="$(extract_planning_skill "$archive_file" "$extract_dir")"
  replace_planning_skill "$source_root"

  log "planning-with-files installed"
  printf 'Skill root: %s\n' "$PLANNING_WITH_FILES_ROOT"
}

#######################################
# Component: Managed Hooks installer
#######################################

assert_hooks_checksum_configured() {
  [ "$HOOKS_SHA256" != "0000000000000000000000000000000000000000000000000000000000000000" ] ||
    die "HOOKS_SHA256 is still a placeholder. Publish ${HOOKS_VERSION} and set its real SHA-256."
}

download_hooks_archive() {
  local archive_file="$1"

  assert_hooks_checksum_configured

  log "Downloading pwf-codex-cloud-hooks ${HOOKS_VERSION}"
  download_file "$HOOKS_URL" "$archive_file"

  log "Verifying pwf-codex-cloud-hooks archive"
  verify_sha256 "$HOOKS_SHA256" "$archive_file"
}

extract_hooks_installer() {
  local archive_file="$1"
  local extract_dir="$2"
  local installer_dir="$3"

  require_command unzip
  mkdir -p "$extract_dir"

  log "Extracting pwf-codex-cloud-hooks"
  unzip -q "$archive_file" -d "$extract_dir"

  [ -f "$installer_dir/install.js" ] ||
    die "Hook installer entry point was not found: $installer_dir/install.js"
}

run_hooks_installer() {
  local installer_dir="$1"
  shift

  require_command node

  node "$installer_dir/install.js" \
    "$@" \
    --json \
    --codex-home "$CODEX_HOME" \
    --skill-root "$PLANNING_WITH_FILES_ROOT" \
    --managed-requirements "$MANAGED_REQUIREMENTS"
}

install_managed_hooks() {
  local installer_dir="$1"

  log "Previewing Managed Hook installation"
  run_hooks_installer "$installer_dir" install --dry-run

  log "Installing Managed Hooks"
  run_hooks_installer "$installer_dir" install
}

doctor_managed_hooks() {
  local installer_dir="$1"

  log "Running Managed Hook doctor"
  run_hooks_installer "$installer_dir" doctor
}

install_hooks_component() {
  local archive_file="$WORK_DIR/$HOOKS_PACKAGE"
  local extract_dir="$WORK_DIR/hooks-extract"
  local installer_dir="$extract_dir/$HOOKS_ARCHIVE_ROOT"

  download_hooks_archive "$archive_file"
  extract_hooks_installer "$archive_file" "$extract_dir" "$installer_dir"
  install_managed_hooks "$installer_dir"
  doctor_managed_hooks "$installer_dir"
}

#######################################
# Component: Managed Hooks verification
#######################################

verify_hooks_filesystem() {
  local hook_adapter="$1"
  local hook_manifest="$2"

  require_command grep

  [ -f "$MANAGED_REQUIREMENTS" ] ||
    die "Managed requirements file was not created: $MANAGED_REQUIREMENTS"

  [ -x "$hook_adapter" ] ||
    die "Hook adapter was not installed or is not executable: $hook_adapter"

  [ -f "$hook_manifest" ] ||
    die "Hook manifest was not created: $hook_manifest"

  grep -Eq '^[[:space:]]*hooks[[:space:]]*=[[:space:]]*true' \
    "$MANAGED_REQUIREMENTS" ||
    die "features.hooks=true was not found in $MANAGED_REQUIREMENTS"

  grep -Fq '[[hooks.SessionStart]]' "$MANAGED_REQUIREMENTS" ||
    die "Managed SessionStart Hook was not found."

  grep -Fq '[[hooks.UserPromptSubmit]]' "$MANAGED_REQUIREMENTS" ||
    die "Managed UserPromptSubmit Hook was not found."

  grep -Fq "$hook_adapter" "$MANAGED_REQUIREMENTS" ||
    die "Managed requirements do not reference the installed adapter."
}

validate_managed_requirements_toml() {
  require_command python3

  log "Validating Managed requirements TOML"

  python3 - "$MANAGED_REQUIREMENTS" <<'PY'
import sys
import tomllib

requirements_file = sys.argv[1]

with open(requirements_file, "rb") as file:
    config = tomllib.load(file)

if config.get("features", {}).get("hooks") is not True:
    raise SystemExit("features.hooks is not true")

hooks = config.get("hooks", {})

if not hooks.get("managed_dir"):
    raise SystemExit("hooks.managed_dir is missing")

if len(hooks.get("SessionStart", [])) != 1:
    raise SystemExit("Expected exactly one managed SessionStart Hook")

if len(hooks.get("UserPromptSubmit", [])) != 1:
    raise SystemExit("Expected exactly one managed UserPromptSubmit Hook")

print("Managed requirements TOML is valid")
PY
}

verify_codex_hooks_feature() {
  require_command grep

  log "Checking Codex Hook feature"

  "$CODEX_HOME/bin/codex" features list |
    grep -E '^hooks[[:space:]]+stable[[:space:]]+true$' ||
    die "Codex does not report Hooks as stable and enabled."
}

test_hook_protocol() {
  local hook_adapter="$1"
  local session_start_output
  local user_prompt_output

  require_command python3

  log "Testing SessionStart Hook adapter"

  session_start_output="$(
    printf '%s' \
      '{"hook_event_name":"SessionStart","source":"startup","cwd":"'"$(pwd)"'"}' |
      python3 "$hook_adapter" SessionStart
  )"

  printf '%s\n' "$session_start_output"
  printf '%s\n' "$session_start_output" |
    grep -Fq 'PWF_GLOBAL_HOOK_CANARY_V1 event=SessionStart source=startup' ||
    die "SessionStart adapter did not return its canary."

  log "Testing UserPromptSubmit Hook adapter"

  user_prompt_output="$(
    printf '%s' \
      '{"hook_event_name":"UserPromptSubmit","cwd":"'"$(pwd)"'","prompt":"setup verification"}' |
      python3 "$hook_adapter" UserPromptSubmit
  )"

  printf '%s\n' "$user_prompt_output"
  printf '%s\n' "$user_prompt_output" |
    grep -Fq 'PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit' ||
    die "UserPromptSubmit adapter did not return its canary."
}

verify_managed_hooks() {
  local hook_runtime="$CODEX_HOME/hooks/planning-with-files"
  local hook_adapter="$hook_runtime/hook_adapter.py"
  local owned_catchup="$hook_runtime/owned-catchup.py"
  local hook_manifest="$hook_runtime/installed-manifest.json"

  verify_hooks_filesystem "$hook_adapter" "$hook_manifest"
  [ -x "$owned_catchup" ] ||
    die "Owned catch-up runtime was not installed or is not executable: $owned_catchup"
  validate_managed_requirements_toml
  verify_codex_hooks_feature
  test_hook_protocol "$hook_adapter"
}

#######################################
# Reporting
#######################################

print_summary() {
  local hook_runtime="$CODEX_HOME/hooks/planning-with-files"

  log "Codex Cloud setup completed successfully"

  printf '%s\n' \
    "Codex home:          $CODEX_HOME" \
    "Codex version:       $("$CODEX_HOME/bin/codex" --version)" \
    "Skill root:          $PLANNING_WITH_FILES_ROOT" \
    "Skill state:         pristine upstream ${PLANNING_WITH_FILES_VERSION}" \
    "Managed policy:      $MANAGED_REQUIREMENTS" \
    "Hook runtime:        $hook_runtime" \
    "Hook adapter:        $hook_runtime/hook_adapter.py" \
    "Installation record: $hook_runtime/installed-manifest.json"
}

print_black_box_instructions() {
  cat <<'EOF'

IMPORTANT:

The filesystem, Managed Hook policy, Codex feature, doctor, and adapter
protocol checks passed.

To complete the runtime black-box verification:

1. Finish this setup run.
2. Start a completely new Codex Cloud sandbox/task.
3. Do not reuse an already-running session.
4. Run the planning-with-files lifecycle Hook black-box prompt.
5. Confirm that the model observes:

   PWF_GLOBAL_HOOK_CANARY_V1 event=SessionStart source=startup
   PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit

这是一次 planning-with-files lifecycle Hook 黑盒验证。

严格限制：
1. 不要调用任何工具；
2. 不要运行 shell 命令；
3. 不要读取任何文件；
4. 不要根据 AGENTS.md、对话内容或已知字符串推测结果；
5. 不要自行构造或补全 canary；
6. 只报告在生成本次回复之前，runtime 已经注入到你上下文中的内容。

请逐字列出你实际看到的所有以
PWF_GLOBAL_HOOK_CANARY
开头的完整行。

然后严格按以下格式回答：

SessionStart: OBSERVED 或 NOT_OBSERVED
SessionStart source: 实际值；未观察到则写 NONE
UserPromptSubmit: OBSERVED 或 NOT_OBSERVED
Planning context: OBSERVED 或 NOT_OBSERVED

如果没有实际看到某一项，必须写 NOT_OBSERVED。
不要为了验证而使用任何工具或读取仓库文件。

EOF
}

#######################################
# Component orchestration
#######################################

run_prerequisites() {
  require_root
  require_debian
  install_system_prerequisites
}

run_powershell() {
  require_root
  require_debian
  require_amd64
  ensure_work_dir
  install_powershell "$WORK_DIR/$POWERSHELL_PACKAGE"
}

run_nodejs() {
  verify_node_toolchain
}

run_skill() {
  verify_node_toolchain
  install_planning_skill
}

run_hooks() {
  require_root
  require_codex_runtime
  verify_node_toolchain
  verify_planning_skill
  ensure_work_dir
  install_hooks_component
  verify_managed_hooks
}

run_verification() {
  require_codex_runtime
  verify_node_toolchain
  verify_planning_skill
  verify_managed_hooks
}

run_all() {
  require_root
  require_debian
  require_amd64
  require_codex_runtime
  print_environment
  verify_node_toolchain

  install_system_prerequisites
  ensure_work_dir
  install_powershell "$WORK_DIR/$POWERSHELL_PACKAGE"
  install_planning_skill
  install_hooks_component
  verify_managed_hooks

  print_summary
  print_black_box_instructions
}

usage() {
  cat <<'EOF'
Usage: setup.bash [command]

Commands:
  all            Run the complete Codex Cloud setup (default).
  prerequisites  Install shared APT packages: ca-certificates, curl, unzip.
  powershell     Install and verify PowerShell; requires the prerequisite packages.
  nodejs         Verify the platform-provided Node.js runtime (version 18 or newer).
  skill          Install and verify planning-with-files from the pinned archive; requires Node.js.
  hooks          Install, doctor, and verify Managed Hooks; requires Node.js and the
                 pristine upstream Skill.
  verify         Verify the pristine Skill and Managed Hooks without installing anything.
  help           Show this help.

Component commands do not implicitly install other components. Run their stated
dependencies first, or use "all" for the complete ordered workflow.
EOF
}

main() {
  local command="${1:-all}"

  [ "$#" -le 1 ] || {
    usage >&2
    die "Expected at most one command."
  }

  case "$command" in
    all) run_all ;;
    prerequisites) run_prerequisites ;;
    powershell) run_powershell ;;
    nodejs) run_nodejs ;;
    skill) run_skill ;;
    hooks) run_hooks ;;
    verify) run_verification ;;
    help|-h|--help) usage ;;
    *)
      usage >&2
      die "Unknown command: $command"
      ;;
  esac
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi

