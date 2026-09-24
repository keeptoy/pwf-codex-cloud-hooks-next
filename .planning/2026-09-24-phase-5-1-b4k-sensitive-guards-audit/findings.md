# Findings: B4k sensitive R36 guard audit

## Entry baseline

- B4j `7be63f3` committed and worktree clean at entry.
- README assigns version deltas to CHANGELOG, current programme roles to ROADMAP, and immutable identity/evidence to BASELINE_PROVENANCE.
- B4j removed the last known display-wording lock in R36, but left three sensitive guard families for a final owner/failure audit.

## Audit ledger

| Family | Owner and failure consequence | Independent check / overlap | Disposition |
|---|---|---|---|
| Exact 64-hex SHA in CHANGELOG | Exact source/asset identity belongs to provenance and acceptance; copying a literal hash into change history creates a second stale identity claim, even if it is presented as a quotation | Published-release oracle reads exact SHA from provenance rows; R36 only prevents duplicate placement | `KEEP` current ban. No in-scope need to put literal exact hashes in CHANGELOG; 64-bit zero-hash explanatory wording is unaffected. |
| `N registered` in CHANGELOG/provenance | A fixed runtime registration count would drift from machine inventory; literal discussion of an old term is not itself an inventory claim | Runtime bundle/Release contracts and producer tests own actual inventory; no current macro document contains this phrase | `DEFER`, retain both bans. A literal obsolete-term example is a theoretical false positive, but this audit has not designed a reliable owner-specific count guard. Revisit only with a concrete documentation need and bounded negative/positive probes. |
| `candidate`/`accepted`/`immediate fallback` in provenance published ledger | Role labels inside cold published identities would make provenance a moving ROADMAP role window | `assertCurrentPublicationRoutes` checks actual ledger membership and acceptance routes; current-role helper rejects explicit current-status declarations | `NARROW` in the next bounded gate. Broad word ban also rejects a harmless explanation such as “A draft candidate is not a published identity”; retain current ban until row/heading/claim negatives and explanatory positives pass. |
| Provenance ledger/migration headings and ROADMAP accepted heading | Ledger boundaries and accepted role identity must stay parseable | `assertCurrentPublicationRoutes` slices on exact provenance headings; ROADMAP accepted row is separately parsed, but another fixed-version test also pins its heading | `KEEP` provenance parser headings for this gate; `DEFER` any ROADMAP heading loosening to a cross-test design. Changing only heading text breaks the ledger parser, and changing only R36's ROADMAP assertion leaves the duplicate pin. |

## Initial source mapping

- `CHANGELOG.md` explicitly defers exact source, bytes and SHA-256 to provenance/acceptance; R36 bars any literal 64-hex hash and `N registered` there. The publication oracle independently parses exact ZIP/bootstrap hashes from published provenance rows, so the CHANGELOG ban is an authority-placement guard, not an identity validator.
- `BASELINE_PROVENANCE.md` identifies itself as a cold immutable-evidence ledger, not a current role window; ROADMAP has the accepted/fallback role table. R36 bars `candidate`, `accepted`, and `immediate fallback` before the migration section, as well as current/history subsections.
- R36 uses exact headings `## 1. 已发布身份账本`, `## 2. Successor 迁移不可变证据` and the ROADMAP accepted heading to delimit or confirm authority regions. The accepted provenance row/acceptance closeout is independently checked by `assertCurrentPublicationRoutes`; the published-release oracle independently checks exact asset hashes.
- The `registered` ban applies to both CHANGELOG and provenance, but its failure consequence is a stale fixed inventory count, not an immutable published asset size or ZIP entry count; the examples below test that distinction.
- `tests/published-release-oracles.test.js` derives accepted/fallback from ROADMAP, parses exact source/entry-count/two SHA identities from their provenance rows and tests the immutable package path. Thus R36's count and label bans should not be mistaken for this independent asset oracle.
- `assertCurrentPublicationRoutes` uses the exact provenance section headings as slice boundaries and verifies unique accepted/fallback rows and candidate publication membership. Changing only the heading wording without changing that parser is not a harmless prose edit: it removes the section boundary and breaks the identity route check.
- Repository-wide `registered` search found only the two R36 bans (plus fixture prose). The current macro documents have no positive `N registered` occurrence.

## In-memory examples and limits

- Existing role-ban regex returns `true` for both a `v0.4.4` ledger row labeled `accepted` (harmful role label) and “A draft candidate is not a published identity.” (harmless explanation). The latter is a concrete false positive supporting a separate narrow gate.
- Existing count-ban regex returns `true` for both “12 registered runtimes” (harmful fixed count) and “The old phrase ‘12 registered’ is obsolete.” (harmless quotation). No safe replacement was proved here, so it remains unchanged.
- Existing 64-hex ban returns `true` for an exact hash quoted as retired; that is intentionally conservative because CHANGELOG is not the exact-hash owner. Prose referring to SHA-256 without literal identity remains possible.
- Renaming only `## 2. Successor 迁移不可变证据` makes the current parser boundary index `-1`, so this is coupled to ledger parsing, not a standalone wording pin.
- ROADMAP's accepted heading is also pinned by `tests/repository-boundary.test.js` in the current-role fixture at line 1242, including `v0.4.4`; R36-only loosening would not give equivalent-heading freedom. This overlaps the separately deferred current-role test family.

## B4 status after audit

B4 is not yet closed. The next directly evidenced change is provenance role-neutrality narrowing. SHA and parser-boundary guards remain; fixed `registered` and ROADMAP heading deserve separate evidence/design if a concrete need appears. A20 and the original Discovery's `DEFER` groups remain outside B4.

Full Windows suite passed 183/209 with 26 POSIX-only skips and zero failures after the new active planning scope; no test or macro-document content changed.
