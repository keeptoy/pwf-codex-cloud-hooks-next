#!/usr/bin/env python3
"""Materialize the tracked candidate bootstrap or a sealed ZIP/bootstrap pair."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import tempfile

import build_release


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "tools" / "templates" / "init-cloud-sandbox.bash.in"
ZERO_SHA256 = "0" * 64
VERSION_PATTERN = re.compile(r"v[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?\Z")
SHA256_PATTERN = re.compile(r"[a-f0-9]{64}\Z")
TOKEN_PATTERN = re.compile(r"@[A-Z0-9_]+@")
EXPECTED_TOKENS = {"@HOOKS_VERSION@", "@HOOKS_SHA256@"}
UTF8_SENTINEL = "这是一次 planning-with-files lifecycle Hook 黑盒验证。"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def validate_version(value: str) -> str:
    if not VERSION_PATTERN.fullmatch(value):
        raise ValueError(f"invalid release version: {value!r}")
    return value


def validate_sha256(value: str, *, allow_zero: bool) -> str:
    if not SHA256_PATTERN.fullmatch(value):
        raise ValueError("ZIP SHA-256 must be 64 lowercase hexadecimal characters")
    if not allow_zero and value == ZERO_SHA256:
        raise ValueError("release ZIP SHA-256 must not be the development zero placeholder")
    return value


def load_identity() -> tuple[str, str, dict, list[tuple[str, int]]]:
    contract_path = build_release.default_contract()
    contract, paths = build_release.load_contract(contract_path)
    version = validate_version(f"v{contract['package_version']}")
    bootstrap_name = f"init-cloud-sandbox-{version}.bash"
    if contract.get("external_release_assets") != [bootstrap_name]:
        raise ValueError(
            "Release contract external asset identity mismatch: "
            f"expected={[bootstrap_name]!r} actual={contract.get('external_release_assets')!r}"
        )
    return version, bootstrap_name, contract, paths


def render_bootstrap(version: str, zip_sha256: str) -> bytes:
    validate_version(version)
    validate_sha256(zip_sha256, allow_zero=True)
    source = TEMPLATE.read_text(encoding="utf-8")
    tokens = TOKEN_PATTERN.findall(source)
    if set(tokens) != EXPECTED_TOKENS or any(tokens.count(token) != 1 for token in EXPECTED_TOKENS):
        raise ValueError(
            "bootstrap template must contain exactly one @HOOKS_VERSION@ and "
            "one @HOOKS_SHA256@ token and no other tokens"
        )
    if UTF8_SENTINEL not in source:
        raise ValueError("bootstrap template UTF-8 lifecycle prompt sentinel is missing")
    rendered = source.replace("@HOOKS_VERSION@", version).replace("@HOOKS_SHA256@", zip_sha256)
    if TOKEN_PATTERN.search(rendered):
        raise ValueError("bootstrap template contains an unresolved token")
    return rendered.encode("utf-8")


def target_state(path: Path, content: bytes) -> str:
    if path.is_symlink():
        raise ValueError(f"refusing symlink output target: {path}")
    if not path.exists():
        return "created"
    if not path.is_file():
        raise ValueError(f"output target is not a regular file: {path}")
    if path.read_bytes() != content:
        raise ValueError(f"refusing to overwrite different existing output: {path}")
    return "unchanged"


def write_atomic(path: Path, content: bytes, *, replace: bool) -> str:
    if path.is_symlink():
        raise ValueError(f"refusing symlink output target: {path}")
    if path.exists() and not path.is_file():
        raise ValueError(f"output target is not a regular file: {path}")
    existed = path.exists()
    if path.exists() and path.read_bytes() == content:
        return "unchanged"
    if path.exists() and not replace:
        raise ValueError(f"refusing to overwrite different existing output: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.pwf-materialize-{os.getpid()}")
    if temporary.exists() or temporary.is_symlink():
        raise ValueError(f"temporary output path already exists: {temporary}")
    try:
        temporary.write_bytes(content)
        temporary.chmod(0o644)
        os.replace(temporary, path)
    finally:
        try:
            temporary.unlink()
        except FileNotFoundError:
            pass
    return "replaced" if existed else "created"


def candidate_bootstrap(write: bool) -> dict:
    version, bootstrap_name, _, _ = load_identity()
    rendered = render_bootstrap(version, ZERO_SHA256)
    output = ROOT / bootstrap_name
    if write:
        state = write_atomic(output, rendered, replace=True)
    else:
        state = target_state(output, rendered)
        if state != "unchanged":
            raise ValueError(f"tracked candidate bootstrap is missing: {output}")
    return {
        "action": "candidate-bootstrap",
        "bootstrap": str(output),
        "bootstrap_sha256": sha256_bytes(rendered),
        "state": state,
        "version": version,
        "zip_sha256": ZERO_SHA256,
    }


def prepare_output_directory(value: Path) -> Path:
    output = Path(os.path.abspath(value))
    if output.is_symlink():
        raise ValueError(f"refusing symlink output directory: {output}")
    if output.exists() and not output.is_dir():
        raise ValueError(f"output directory is not a directory: {output}")
    output.mkdir(parents=True, exist_ok=True)
    return output


def release_assets(version: str, expected_zip_sha256: str, output_directory: Path) -> dict:
    current_version, bootstrap_name, contract, paths = load_identity()
    version = validate_version(version)
    expected_zip_sha256 = validate_sha256(expected_zip_sha256, allow_zero=False)
    if version != current_version:
        raise ValueError(f"release version mismatch: requested={version!r} current={current_version!r}")
    candidate_path = ROOT / bootstrap_name
    expected_candidate = render_bootstrap(version, ZERO_SHA256)
    if candidate_path.is_symlink() or not candidate_path.is_file():
        raise ValueError(f"tracked candidate bootstrap is missing or unsafe: {candidate_path}")
    if candidate_path.read_bytes() != expected_candidate:
        raise ValueError(
            "tracked candidate bootstrap differs from the canonical zero-hash render; "
            "regenerate it before C0 and rerun Source/Candidate"
        )
    output_directory = prepare_output_directory(output_directory)
    zip_name = f"pwf-codex-cloud-hooks-{version}.zip"
    zip_target = output_directory / zip_name
    bootstrap_target = output_directory / bootstrap_name

    with tempfile.TemporaryDirectory(prefix="pwf-release-materialize-") as workspace:
        staged_zip = Path(workspace) / zip_name
        build_release.build_bytes(contract, paths, staged_zip)
        zip_result = build_release.inspect_archive(staged_zip, contract, paths)
        if zip_result["sha256"] != expected_zip_sha256:
            raise ValueError(
                "Source/Candidate ZIP SHA-256 mismatch: "
                f"expected={expected_zip_sha256} actual={zip_result['sha256']}"
            )
        zip_bytes = staged_zip.read_bytes()

    bootstrap_bytes = render_bootstrap(version, expected_zip_sha256)
    zip_state = target_state(zip_target, zip_bytes)
    bootstrap_state = target_state(bootstrap_target, bootstrap_bytes)
    if zip_state == "created":
        write_atomic(zip_target, zip_bytes, replace=False)
    if bootstrap_state == "created":
        write_atomic(bootstrap_target, bootstrap_bytes, replace=False)

    return {
        "action": "release",
        "bootstrap": {
            "path": str(bootstrap_target),
            "sha256": sha256_bytes(bootstrap_bytes),
            "size": len(bootstrap_bytes),
            "state": bootstrap_state,
        },
        "version": version,
        "zip": {
            "entries": zip_result["entries"],
            "path": str(zip_target),
            "sha256": zip_result["sha256"],
            "size": zip_result["size"],
            "state": zip_state,
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    candidate = commands.add_parser("candidate-bootstrap", help="check or rewrite the tracked zero-hash bootstrap")
    candidate.add_argument("--write", action="store_true", help="atomically rewrite the tracked bootstrap from the template")
    release = commands.add_parser("release", help="materialize the exact ZIP and bootstrap pair after Source/Candidate PASS")
    release.add_argument("--version", required=True)
    release.add_argument("--expected-zip-sha", required=True)
    release.add_argument("--output-dir", type=Path, default=Path("dist"))
    return parser.parse_args()


def main() -> int:
    try:
        args = parse_args()
        if args.command == "candidate-bootstrap":
            result = candidate_bootstrap(args.write)
        else:
            result = release_assets(args.version, args.expected_zip_sha, args.output_dir)
        print(json.dumps(result, ensure_ascii=False, sort_keys=True))
        return 0
    except (OSError, ValueError, UnicodeError, json.JSONDecodeError) as error:
        print(json.dumps({"healthy": False, "error": str(error)}, ensure_ascii=False, sort_keys=True), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
