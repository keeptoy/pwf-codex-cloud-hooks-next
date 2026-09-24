# Progress: R29 cold-evidence fact repair

## 2026-09-24

- Read planning-with-files, ran session catch-up and confirmed clean worktree. Opened a bounded gate after maintainer authorization.
- Prior read-only audit traced both false tail pointers to stage-guide retirement commit `39f6616`; compared the deleted guide blobs with accepted immutable commit `6b3885…` and located the required explicit anchors. Next: recheck exact objects and append two tail sections.
- Reconfirmed equal guide blob IDs in `6b3885…` and `39f6616^`, plus all four cited explicit anchors. Appended one Phase-scoped, end-of-record Cold evidence section to each affected history file, each with a single immutable commit link and exact retired guide path. Existing historical text and R29 tests remain unchanged.
- Diff review confirmed only two final sections were added to historical files. Focused architecture/repository-boundary suite passed 47/47; full Windows `npm test` passed 184/210 with 26 POSIX-only skips and zero failures. Exact source and anchors were rechecked via local Git; no Linux/Cloud claim is made. Planning findings now record the remaining separate R29 test-retirement decision.
