# Findings: Phase 6–9 Cloud necessity discovery

## Opening facts

- Current programme remains Phase 5; Phase 6–9 are pending route candidates rather than activated work.
- Existing production events are SessionStart and UserPromptSubmit; SessionStart sources already admit startup, resume, clear and compact.
- Cloud is a confirmed Linux evidence route but its Host payload, paths and tools are dated/variable facts, not permanent contracts.
- Experimental material must stay outside production import/dispatch and Release, name an owner/budget/exit condition, and be retired or promoted before merge into canonical production.

## Necessity decisions

| Phase | Decision | Reason |
|---|---|---|
| 6 | `DISCOVER_FIRST` | Context recovery across compaction matters, but the existing `SessionStart source=clear|compact` path may already be sufficient. Real Host ordering/payload evidence must precede any new event. |
| 7 | `NO_GO` now | No independently justified PreToolUse, PostToolUse or PermissionRequest use case currently outweighs latency, token and noise costs. |
| 8 | `CONDITIONAL_GO` to formal Discovery | A pure, bounded, read-only completion advisory has a clear benefit and smaller risk than blocking, but Host event/recursion and Cloud UX remain unproved. |
| 9 | `NO_GO / DEFER` | Advisory insufficiency is unproved and hard gating adds mutable state, concurrency, recovery and lock risks. |

## Prototype boundary

- Phase 6 has a content-free bounded JSONL event summarizer. It always reports that event presence alone is insufficient evidence of context recovery.
- Phase 8 has a pure evaluator over already-derived counts. It performs no file reads, writes, subprocesses or recursion.
- Phase 7 and Phase 9 intentionally have no code prototype: absent a use case or prerequisite evidence, toy callbacks/counters would create false confidence rather than useful feasibility evidence.
- This Cloud session exposed only the normal managed canary events to the conversation; it did not provide raw PreCompact/PostCompact payload evidence. No simulated result will be labeled Cloud PASS.
