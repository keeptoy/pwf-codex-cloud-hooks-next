# Findings: Phase 4 F0 Development Identity

## Frozen boundaries

- F0 is an identity/governance gate only.
- The accepted rollback baseline remains immutable `v0.3.5`.
- The new candidate is an unsealed `0.4.0-dev`; a development bootstrap must carry a 64-character zero SHA-256 and fail closed.
- F0 does not authorize F1A contract-v2 work, runtime behavior changes, Cloud acceptance, sealing, publication, or remote writes.

## Evidence log

- `package.json` 当前 version 为 `0.3.5`。
- `contracts/release-artifact-v1.json` 当前 `package_version` 为 `0.3.5`，唯一 external asset 为 `init-cloud-sandbox-v0.3.5.bash`。
- 根目录当前只有已封板的 `init-cloud-sandbox-v0.3.5.bash`，尚无 development bootstrap。
- Repository lifecycle expects exactly the candidate + accepted bootstrap/acceptance files. F0 must add `v0.4.0-dev` files and retain published `v0.3.5` files unchanged.
- Current governance infers current-candidate Cloud completion from unscoped PASS wording anywhere in ROADMAP. Once candidate and accepted diverge, v0.3.5 PASS text would falsely mark v0.4.0-dev complete. The test must scope completion to the current-train role line.
- The existing acceptance assertion requires wording that the candidate does not authorize all of Product Phase 4. That was correct before Phase 4 began, but F0 is now part of Phase 4; the durable boundary is that candidate preparation does not authorize F1A or later gates.
- Historical `v0.3.5-dev` shows the intended lifecycle: add a separate zero-hash bootstrap and minimal pending acceptance, then rename/replace only during a separately authorized seal. Published `v0.3.5` bytes remain immutable.

## F0 closeout findings

- Current authority closes consistently at candidate `v0.4.0-dev`, accepted `v0.3.5`, external asset `init-cloud-sandbox-v0.4.0-dev.bash`, and a 64-zero default ZIP checksum.
- Release contract identity propagation requires one raw SHA update in `upstream-manifest.json`; this is integrity closure, not schema or inventory evolution.
- Runtime, hooks, installer logic, runtime bundle, ABI schemas, README/ARCHITECTURE/DESIGN and published provenance are unchanged.
- Candidate ZIP remains deterministic and healthy. Its observed development hash is evidence only and must not replace the bootstrap zero hash before a separately authorized seal.
- No current-scope residue says F0 is paused or waiting for authorization. Historical Phase 4.3 records retain that past-time fact intentionally.
