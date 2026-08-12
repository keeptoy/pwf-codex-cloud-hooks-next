#!/usr/bin/env python3
"""Build or verify the deterministic Release ZIP allowlist."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import stat
import sys
import zipfile


ROOT = Path(__file__).resolve().parents[1]
ZIP_TIMESTAMP = (1980, 1, 1, 0, 0, 0)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def safe_path(value: object) -> str:
    if not isinstance(value, str) or not value or "\\" in value:
        raise ValueError("artifact entry path is invalid")
    path = PurePosixPath(value)
    if path.is_absolute() or any(part in ("", ".", "..") for part in path.parts):
        raise ValueError(f"unsafe artifact entry path: {value}")
    return path.as_posix()


def default_contract() -> Path:
    manifest = json.loads((ROOT / "upstream-manifest.json").read_text(encoding="utf-8"))
    if set(manifest) != {
        "schema_version", "upstream", "release", "commit", "release_archive_url",
        "release_archive_sha256", "required_skill_files", "managed_runtime",
    } or manifest.get("schema_version") != 4:
        raise ValueError("unsupported source manifest schema or fields")
    managed = manifest.get("managed_runtime")
    if not isinstance(managed, dict) or set(managed) != {"schema_version", "contracts", "importer", "license_provenance"} or managed.get("schema_version") != 3:
        raise ValueError("unsupported managed runtime manifest schema or fields")
    contracts = managed.get("contracts")
    if not isinstance(contracts, dict) or set(contracts) != {"runtime_bundle", "release_artifact", "installed_state_transition"}:
        raise ValueError("unsupported managed runtime contract fields")
    reference = contracts.get("release_artifact")
    if not isinstance(reference, dict) or set(reference) != {"path", "sha256"}:
        raise ValueError("invalid release artifact integrity reference")
    relative = safe_path(reference.get("path"))
    target = ROOT.joinpath(*PurePosixPath(relative).parts).resolve(strict=True)
    if target.parent != (ROOT / "contracts").resolve():
        raise ValueError("release artifact contract escapes contracts root")
    if sha256_bytes(target.read_bytes()) != reference.get("sha256"):
        raise ValueError("release artifact contract SHA-256 mismatch")
    return target


def load_contract(path: Path) -> tuple[dict, list[tuple[str, int]]]:
    contract = json.loads(path.read_text(encoding="utf-8"))
    if set(contract) != {
        "schema_version", "contract_id", "package_name", "package_version", "archive_root",
        "ordering", "timestamp", "compression", "entries", "external_release_assets", "excluded_prefixes",
    } or contract.get("schema_version") != 2 or contract.get("contract_id") != "PWF_RELEASE_ARTIFACT_V2":
        raise ValueError("unsupported release artifact schema")
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    for contract_key, package_key in (("package_name", "name"), ("package_version", "version")):
        expected = contract.get(contract_key)
        actual = package.get(package_key)
        if not isinstance(expected, str) or not expected:
            raise ValueError(f"artifact {contract_key.replace('_', ' ')} is invalid")
        if expected != actual:
            raise ValueError(f"package {package_key} mismatch: contract={expected!r}, package.json={actual!r}")
    if contract.get("ordering") != "lexicographic_by_utf8_path":
        raise ValueError("unsupported artifact ordering")
    if contract.get("timestamp") != "1980-01-01T00:00:00Z":
        raise ValueError("unsupported artifact timestamp")
    if contract.get("compression") != "deflate":
        raise ValueError("unsupported artifact compression")
    root = contract.get("archive_root")
    if not isinstance(root, str) or not root.endswith("/") or safe_path(root[:-1]) != root[:-1]:
        raise ValueError("invalid archive root")

    entries = contract.get("entries")
    if not isinstance(entries, list) or not entries:
        raise ValueError("artifact entry list is empty")
    paths: list[tuple[str, int]] = []
    for entry in entries:
        if not isinstance(entry, dict) or set(entry) != {"path", "mode"} or entry.get("mode") not in {"0644", "0755"}:
            raise ValueError(f"artifact entry is not ready: {entry}")
        paths.append((safe_path(entry.get("path")), int(entry["mode"], 8)))
    path_names = [item[0] for item in paths]
    if len(path_names) != len(set(path_names)):
        raise ValueError("artifact entry list contains duplicates")
    external_assets = contract.get("external_release_assets")
    if not isinstance(external_assets, list) or not external_assets or any(not isinstance(item, str) for item in external_assets):
        raise ValueError("external release assets must be a non-empty string list")
    if len(external_assets) != len(set(external_assets)):
        raise ValueError("external release asset list contains duplicates")
    for external in external_assets:
        if safe_path(external) in path_names:
            raise ValueError("external release asset entered ZIP allowlist")
    excluded_prefixes = contract.get("excluded_prefixes")
    if not isinstance(excluded_prefixes, list) or any(not isinstance(item, str) for item in excluded_prefixes):
        raise ValueError("excluded prefixes must be a string list")
    if len(excluded_prefixes) != len(set(excluded_prefixes)):
        raise ValueError("excluded prefix list contains duplicates")
    for prefix in excluded_prefixes:
        if not prefix.endswith("/") or safe_path(prefix[:-1]) != prefix[:-1] or any(item == prefix[:-1] or item.startswith(prefix) for item in path_names):
            raise ValueError(f"excluded prefix entered ZIP allowlist: {prefix}")
    return contract, sorted(paths, key=lambda item: item[0].encode("utf-8"))


def source_bytes(relative: str) -> bytes:
    target = ROOT.joinpath(*PurePosixPath(relative).parts)
    if target.is_symlink() or not target.is_file():
        raise ValueError(f"artifact source is missing or unsafe: {relative}")
    return target.read_bytes()


def build_bytes(contract: dict, paths: list[tuple[str, int]], output: Path) -> None:
    archive_root = contract["archive_root"]
    temporary = output.with_name(f".{output.name}.pwf-build-{os.getpid()}")
    if temporary.exists() or temporary.is_symlink():
        raise ValueError(f"temporary artifact path already exists: {temporary}")
    try:
        output.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(temporary, "x", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for relative, mode in paths:
                info = zipfile.ZipInfo(f"{archive_root}{relative}", ZIP_TIMESTAMP)
                info.create_system = 3
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = (stat.S_IFREG | mode) << 16
                archive.writestr(info, source_bytes(relative), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
        os.replace(temporary, output)
    finally:
        try:
            temporary.unlink()
        except FileNotFoundError:
            pass


def inspect_archive(archive_path: Path, contract: dict, paths: list[tuple[str, int]]) -> dict:
    archive_root = contract["archive_root"]
    expected_names = [f"{archive_root}{relative}" for relative, _ in paths]
    with zipfile.ZipFile(archive_path) as archive:
        infos = archive.infolist()
        names = [info.filename for info in infos]
        if names != expected_names:
            raise ValueError("artifact inventory or ordering mismatch")
        for (relative, expected_mode), info in zip(paths, infos):
            if info.is_dir() or info.date_time != ZIP_TIMESTAMP or info.compress_type != zipfile.ZIP_DEFLATED:
                raise ValueError(f"artifact metadata mismatch: {relative}")
            if stat.S_IMODE(info.external_attr >> 16) != expected_mode:
                raise ValueError(f"artifact mode mismatch: {relative}")
            if archive.read(info) != source_bytes(relative):
                raise ValueError(f"artifact content mismatch: {relative}")
    content = archive_path.read_bytes()
    return {
        "healthy": True,
        "archive": str(archive_path),
        "entries": len(paths),
        "sha256": sha256_bytes(content),
        "size": len(content),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("build", "check"))
    parser.add_argument("--contract", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--archive", type=Path)
    args = parser.parse_args()
    if args.command == "build" and args.output is None:
        parser.error("--output is required for build")
    if args.command == "check" and args.archive is None:
        parser.error("--archive is required for check")
    return args


def main() -> int:
    try:
        args = parse_args()
        contract_path = args.contract.resolve(strict=True) if args.contract else default_contract()
        contract, paths = load_contract(contract_path)
        target = args.output if args.command == "build" else args.archive
        archive_path = Path(os.path.abspath(target))
        if args.command == "build":
            build_bytes(contract, paths, archive_path)
        result = inspect_archive(archive_path.resolve(strict=True), contract, paths)
        print(json.dumps(result, sort_keys=True))
        return 0
    except (OSError, ValueError, UnicodeError, json.JSONDecodeError, zipfile.BadZipFile) as error:
        print(json.dumps({"healthy": False, "error": str(error)}, sort_keys=True), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
